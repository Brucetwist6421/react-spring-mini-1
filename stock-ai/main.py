import numpy as np
import pandas as pd
import pandas_ta as ta
import yfinance as yf
from fastapi import FastAPI
from prophet import Prophet
import logging
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime, timedelta
from pykrx import stock

# NumPy 2.x 호환성 패치
for attr, target in [("float_", np.float64), ("int_", np.int64), ("bool_", bool)]:
    if not hasattr(np, attr): setattr(np, attr, target)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/stock/{code}")
async def get_stock_prediction(code: str, period: str = "2y", predict_days: int = 15):
    try:
        pure_code = code.split('.')[0]
        end_dt = datetime.now()
        start_dt = end_dt - timedelta(days=365 * 5)
        s_date, e_date = start_dt.strftime("%Y%m%d"), end_dt.strftime("%Y%m%d")

        # 1. Pykrx 데이터 풀(Pool) 수집
        df_stock = stock.get_market_ohlcv(s_date, e_date, pure_code) # OHLCV
        if df_stock.empty: return {"error": "데이터를 찾을 수 없습니다."}
        
        df_investors = stock.get_market_net_purchases_of_equities_by_date(s_date, e_date, pure_code) # 수급
        df_fund = stock.get_market_fundamental_by_date(s_date, e_date, pure_code) # PER, PBR, DIV, EPS
        df_short = stock.get_shorting_status_by_date(s_date, e_date, pure_code) # 공매도 잔고
        df_foreign = stock.get_exhaustion_rates_of_foreign_investment_by_date(s_date, e_date, pure_code) # 외인비중

        # 2. yfinance 외부 지수 수집 (해외 지표)
        ext_tickers = ["^KS11", "^SOX", "^IXIC", "USDKRW=X"]
        df_ext = yf.download(ext_tickers, start=start_dt, end=end_dt)['Close'].ffill().bfill()

        # 3. 데이터 통합 레이어
        df = pd.DataFrame(index=df_stock.index)
        df['y'] = df_stock['종가']
        df['Volume'] = df_stock['거래량']
        
        # 외부 지수 Join
        df = df.join(df_ext.rename(columns={'^KS11': 'KOSPI', '^SOX': 'SOX', '^IXIC': 'NASDAQ', 'USDKRW=X': 'EXCHANGE'}))
        
        # Fundamental & 공매도/외인비중 Join (데이터가 있을 경우에만)
        if not df_fund.empty:
            df = df.join(df_fund[['PER', 'PBR', 'DIV', 'EPS']])
        if not df_foreign.empty:
            df['Foreign_Rate'] = df_foreign['보유비중']
        if not df_short.empty:
            df['Short_Balance'] = df_short['잔고수량']

        # 4. 기술적 지표 및 Prophet 학습
        df['SOX_Trend'] = df['SOX'].rolling(window=200).mean()
        df['RSI'] = ta.rsi(df['y'], length=14)
        macd_res = ta.macd(df['y'])
        df['MACD'] = macd_res.iloc[:, 0] if macd_res is not None else 0
        df['MA20'] = ta.sma(df['y'], length=20)

        df_clean = df.ffill().bfill().fillna(0)
        
        # Prophet 학습 (추가된 PER, PBR, Foreign_Rate 등을 Regressor로 포함하여 학습 성능 강화)
        df_p = df_clean.reset_index().rename(columns={'날짜': 'ds'})
        df_p['ds'] = df_p['ds'].dt.tz_localize(None)

        model = Prophet(daily_seasonality=False, weekly_seasonality=True, yearly_seasonality=True)
        # 학습에 활용할 독립 변수들
        regressors = ['KOSPI', 'SOX', 'SOX_Trend', 'NASDAQ', 'EXCHANGE', 'RSI', 'MACD', 'PER', 'PBR', 'Foreign_Rate']
        for col in regressors:
            if col in df_p.columns: model.add_regressor(col)
        
        model.fit(df_p)

        # 미래 예측 데이터 생성 로직 (기존과 동일)
        future = model.make_future_dataframe(periods=predict_days, freq='B')
        for col in regressors:
            if col in df_p.columns:
                last_val, mean_val = df_p[col].iloc[-1], df_p[col].tail(252).mean()
                future_vals = [last_val * 0.8 + mean_val * 0.2] # 간단한 선형 감쇄 예시
                for _ in range(predict_days - 1): future_vals.append(future_vals[-1] * 0.9 + mean_val * 0.1)
                future[col] = list(df_p[col]) + future_vals

        forecast = model.predict(future)

        # 5. StockVO 대응 JSON 구조 생성
        req_period = period.lower().replace("o", "")
        display_days = {"1m": 22, "3m": 66, "6m": 132, "1y": 252, "2y": 504, "5y": 1260}.get(req_period, 252)
        plot_df = df_clean.tail(display_days)

        def to_double_map(series): return {d.strftime('%Y-%m-%d'): round(float(v), 2) for d, v in zip(series.index, series)}
        
        history = to_double_map(plot_df['y'])
        prediction = {row['ds'].strftime('%Y-%m-%d'): round(float(row['yhat']), 2) 
                      for _, row in forecast[forecast['ds'] > df_p['ds'].max()].iterrows()}

        # 6. 최종 Response (Java StockVO 규격)
        return {
            "symbol": code,
            "industry_status": "HANSUNG'S TRI-CORE: 거시지표 및 펀더멘털 분석 통합 완료",
            "total": dict(sorted({**history, **prediction}.items())),
            "history": history,
            "prediction": prediction,
            "volume": {d.strftime('%Y-%m-%d'): int(v) for d, v in zip(plot_df.index, plot_df['Volume'])},
            "events": {"2026-04-15": "실적 발표 기간"},
            "indicators": {
                "rsi": to_double_map(plot_df['RSI']),
                "ma20": to_double_map(plot_df['MA20']),
                "per": to_double_map(plot_df['PER']) if 'PER' in plot_df else {},
                "pbr": to_double_map(plot_df['PBR']) if 'PBR' in plot_df else {},
                "short_balance": to_double_map(plot_df['Short_Balance']) if 'Short_Balance' in plot_df else {}
            },
            "investors": {
                "dates": [d.strftime('%Y-%m-%d') for d in plot_df.index],
                "foreign": [int(df_investors.loc[d, '외국인']) if d in df_investors.index else 0 for d in plot_df.index],
                "institution": [int(df_investors.loc[d, '기관합계']) if d in df_investors.index else 0 for d in plot_df.index]
            }
        }

    except Exception as e:
        logger.exception(f"Error: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
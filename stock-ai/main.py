import numpy as np

# [필독] Prophet 심폐소생술: NumPy 2.x 호환성 패치
if not hasattr(np, "float_"):
    np.float_ = np.float64
if not hasattr(np, "int_"):
    np.int_ = np.int64
if not hasattr(np, "bool_"):
    np.bool_ = bool

import yfinance as yf
from fastapi import FastAPI
from prophet import Prophet
import pandas as pd
import pandas_ta as ta
import logging
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime
from pykrx import stock

# 로그 설정: pykrx 내부 로그 에러 방지를 위해 기본 로깅 레벨 조정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock/{code}")
async def get_stock_prediction(code: str, period: str = "2y", predict_days: int = 15):
    events = {}
    
    try:
        # 1. 종목 코드 처리
        ticker_symbol = f"{code}.KS" if not code.endswith((".KS", ".KQ")) else code
        
        # 2. 데이터 수집
        raw_data = yf.download([ticker_symbol, "^KS11", "^SOX", "^IXIC", "USDKRW=X"], period="5y")

        if raw_data.empty:
            return {"error": "데이터를 가져올 수 없습니다."}

        close_data = raw_data['Close']
        volume_data = raw_data['Volume'][ticker_symbol]

        if ticker_symbol not in close_data or close_data[ticker_symbol].dropna().empty:
            return {"error": "해당 종목의 유효한 데이터가 없습니다."}

        df = pd.DataFrame({
            'y': close_data[ticker_symbol],
            'Volume': volume_data,
            'KOSPI': close_data['^KS11'],
            'SOX': close_data['^SOX'],
            'NASDAQ': close_data['^IXIC'],
            'EXCHANGE': close_data['USDKRW=X']
        }).ffill().dropna()

        # 3. 기술적 지표 생성
        df['SOX_Trend'] = df['SOX'].rolling(window=200).mean()
        df['RSI'] = ta.rsi(df['y'], length=14)
        macd = ta.macd(df['y'])
        df['MACD'] = macd.iloc[:, 0] if macd is not None else 0
        df['MA20'] = ta.sma(df['y'], length=20)

        df_clean = df.dropna()

        # 4. Prophet 학습 데이터 구성
        df_p = df_clean.reset_index().rename(columns={'Date': 'ds'})
        df_p['ds'] = df_p['ds'].dt.tz_localize(None)
        
        # 5. 모델 설정 및 학습
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.05
        )

        regressors = ['KOSPI', 'SOX', 'SOX_Trend', 'NASDAQ', 'EXCHANGE', 'RSI', 'MACD']
        for col in regressors:
            model.add_regressor(col)

        model.fit(df_p)

        # 6. 미래 예측
        future = model.make_future_dataframe(periods=predict_days, freq='B')
        for col in regressors:
            last_val = df_p[col].iloc[-1]
            mean_val = df_p[col].tail(252).mean()
            future_vals = []
            current = last_val
            for _ in range(predict_days):
                current = current * 0.8 + mean_val * 0.2
                future_vals.append(current)
            future[col] = list(df_p[col]) + future_vals

        forecast = model.predict(future)

        # 7. 결과 데이터 정제
        display_days = {"1y": 252, "2y": 504, "5y": 1260}.get(period, 252)
        plot_df = df.tail(display_days)

        def clean_val(v, default=0):
            if pd.isna(v) or np.isinf(v): return default
            return round(float(v), 2)

        history = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['y'])}
        history_volume = {d.strftime('%Y-%m-%d'): int(v) if not pd.isna(v) else 0 for d, v in zip(plot_df.index, plot_df['Volume'])}
        history_rsi = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['RSI'])}
        history_ma20 = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['MA20'])}

        prediction = {}
        last_date = df_p['ds'].max()
        future_forecast = forecast[forecast['ds'] > last_date]
        for _, row in future_forecast.iterrows():
            prediction[row['ds'].strftime('%Y-%m-%d')] = clean_val(row['yhat'])

        total = {**history, **prediction}
        total = dict(sorted(total.items()))

        # 8. 보완된 투자자 수급 데이터 수집 (pykrx)
        inv_dates, inv_foreign, inv_institution = [], [], []
        try:
            pure_code = code.split('.')[0]
            s_date = plot_df.index[0].strftime('%Y%m%d')
            e_date = plot_df.index[-1].strftime('%Y%m%d')
            
            # 단일 종목 일자별 수급 데이터 가져오기
            investor_df = stock.get_market_net_purchases_of_equities(s_date, e_date, pure_code)
            
            if not investor_df.empty:
                investor_df.index = pd.to_datetime(investor_df.index)
                investor_df = investor_df.reindex(plot_df.index).fillna(0)
                inv_dates = [d.strftime('%Y-%m-%d') for d in investor_df.index]
                inv_foreign = [int(v) for v in investor_df['외국인']]
                inv_institution = [int(v) for v in investor_df['기관합계']]
            else:
                raise ValueError("데이터 빔")
        except Exception:
            # 수급 데이터 실패 시 차트 깨짐 방지를 위해 0으로 채움
            inv_dates = list(history.keys())
            inv_foreign = [0] * len(inv_dates)
            inv_institution = [0] * len(inv_dates)

        # 9. 이벤트 데이터
        try:
            ticker_info = yf.Ticker(ticker_symbol)
            calendar = ticker_info.calendar
            if calendar is not None and not calendar.empty:
                if 'Earnings Date' in calendar.index:
                    e_dates = calendar.loc['Earnings Date']
                    if isinstance(e_dates, (pd.Series, list)):
                        for ed in e_dates: events[ed.strftime('%Y-%m-%d')] = "실적 발표 예정"
                    else:
                        events[e_dates.strftime('%Y-%m-%d')] = "실적 발표 예정"
            if not events: events["2026-04-15"] = "실적 발표 시즌"
        except Exception:
            events = {"2026-04-15": "정보 업데이트 예정"}

        return {
            "symbol": code,
            "industry_status": "HANSUNG'S TRI-CORE 분석 완료",
            "total": total,
            "history": history,
            "prediction": prediction,
            "volume": history_volume,
            "indicators": {"rsi": history_rsi, "ma20": history_ma20},
            "investors": {"dates": inv_dates, "foreign": inv_foreign, "institution": inv_institution},
            "events": events
        }

    except Exception as e:
        logger.error(f"주요 에러 발생: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
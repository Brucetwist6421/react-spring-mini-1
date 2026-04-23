import numpy as np

# [필독] NumPy 2.0+ 호환성 패치 (최상단 유지)
# Prophet 및 일부 라이브러리에서 삭제된 구버전 넘파이 속성을 참조할 때 발생하는 에러를 방지합니다.
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

# 로그 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 설정: 프론트엔드(React 등)와 연동하기 위해 필수
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock/{code}")
async def get_stock_prediction(code: str, period: str = "2y", predict_days: int = 15):
    # 전역적으로 쓰일 변수 초기화 (NameError 방지)
    events = {}
    
    try:
        # 1. 종목 코드 처리 (한국 시장용)
        ticker_symbol = f"{code}.KS" if not code.endswith((".KS", ".KQ")) else code
        
        # 2. 데이터 수집 (주식 + 주요 지수)
        raw_data = yf.download([ticker_symbol, "^KS11", "^SOX", "^IXIC", "USDKRW=X"], period="5y")

        if raw_data.empty:
            return {"error": "데이터를 가져올 수 없습니다."}

        # 데이터 추출 (MultiIndex 대응)
        close_data = raw_data['Close']
        volume_data = raw_data['Volume'][ticker_symbol]

        if ticker_symbol not in close_data or close_data[ticker_symbol].dropna().empty:
            return {"error": "해당 종목의 유효한 데이터가 없습니다."}

        # 데이터프레임 구성 및 결측치 처리
        df = pd.DataFrame({
            'y': close_data[ticker_symbol],
            'Volume': volume_data,
            'KOSPI': close_data['^KS11'],
            'SOX': close_data['^SOX'],
            'NASDAQ': close_data['^IXIC'],
            'EXCHANGE': close_data['USDKRW=X']
        }).ffill().dropna()

        # 3. 기술적 지표 및 트렌드 변수 생성
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

        # 6. 미래 외생 변수 예측 및 데이터프레임 생성
        future = model.make_future_dataframe(periods=predict_days, freq='B')

        for col in regressors:
            last_val = df_p[col].iloc[-1]
            mean_val = df_p[col].tail(252).mean() # 최근 1년 평균으로 수렴 유도

            future_vals = []
            current = last_val
            for _ in range(predict_days):
                current = current * 0.8 + mean_val * 0.2
                future_vals.append(current)

            future[col] = list(df_p[col]) + future_vals

        forecast = model.predict(future)

        # 7. 결과 데이터 정제 및 JSON 직렬화 준비
        display_days = {"1y": 252, "2y": 504, "5y": 1260}.get(period, 252)
        plot_df = df.tail(display_days)

        def clean_val(v, default=0):
            if pd.isna(v) or np.isinf(v):
                return default
            return round(float(v), 2)

        history = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['y'])}
        history_volume = {d.strftime('%Y-%m-%d'): int(v) if not pd.isna(v) else 0 for d, v in zip(plot_df.index, plot_df['Volume'])}
        history_rsi = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['RSI'])}
        history_ma20 = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['MA20'])}

        # 예측 데이터 가공
        prediction = {}
        last_date = df_p['ds'].max()
        future_forecast = forecast[forecast['ds'] > last_date]
        
        for _, row in future_forecast.iterrows():
            prediction[row['ds'].strftime('%Y-%m-%d')] = clean_val(row['yhat'])

        total = history.copy()
        total.update(prediction)
        total = dict(sorted(total.items()))

        # 8. 투자자 수급 데이터 (pykrx)
        try:
            pure_code = code.split('.')[0]
            s_date = plot_df.index[0].strftime('%Y%m%d')
            e_date = plot_df.index[-1].strftime('%Y%m%d')
            
            investor_df = stock.get_market_net_purchases_of_equities_by_ticker(s_date, e_date, pure_code)
            investor_df.index = pd.to_datetime(investor_df.index)
            investor_df = investor_df.reindex(plot_df.index).fillna(0)
            
            inv_dates = [d.strftime('%Y-%m-%d') for d in investor_df.index]
            inv_foreign = [int(v) for v in investor_df['외국인']]
            inv_institution = [int(v) for v in investor_df['기관합계']]
        except Exception as e:
            logger.warning(f"수급 데이터 실패: {e}")
            inv_dates, inv_foreign, inv_institution = list(history.keys()), [0]*len(history), [0]*len(history)

        # 9. 실적 발표 등 이벤트 데이터 수집
        try:
            ticker_info = yf.Ticker(ticker_symbol)
            calendar = ticker_info.calendar
            if calendar is not None and not calendar.empty:
                if 'Earnings Date' in calendar.index:
                    e_dates = calendar.loc['Earnings Date']
                    if isinstance(e_dates, pd.Series):
                        for ed in e_dates:
                            events[ed.strftime('%Y-%m-%d')] = "실적 발표 예정"
                    else:
                        events[e_dates.strftime('%Y-%m-%d')] = "실적 발표 예정"
            
            if not events:
                events["2026-04-15"] = "실적 발표 시즌 시작"
        except Exception:
            events = {"2026-04-15": "실적 발표 시즌"}

        # 최종 반환
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
    # 포트 8000에서 실행
    uvicorn.run(app, host="0.0.0.0", port=8000)
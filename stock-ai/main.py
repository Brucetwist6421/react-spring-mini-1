import yfinance as yf
from fastapi import FastAPI
from prophet import Prophet
import pandas as pd
import pandas_ta as ta
import numpy as np
import logging
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# 로그 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock/{code}")
async def get_stock_prediction(code: str, period: str = "1y", predict_days: int = 15):
    try:
        ticker_symbol = f"{code}.KS"
        
        # 1. 데이터 수집 (주가 + 시장 지수)
        df = yf.download(ticker_symbol, period=period)
        kospi = yf.download("^KS11", period=period)['Close']
        if df.empty:
            return {"symbol": code, "error": "데이터를 찾을 수 없습니다."}

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # 2. 기술적 지표 계산 (차트 표시용 + 예측 변수용)
        df['RSI'] = ta.rsi(df['Close'], length=14)
        df['MA20'] = ta.sma(df['Close'], length=20)
        macd = ta.macd(df['Close'])
        df['MACD'] = macd['MACD_12_26_9']
        df['KOSPI'] = kospi

        # NaN 제거 전 시각화용 데이터 보관
        plot_df = df.copy()
        df = df.dropna()

        # 3. Prophet 학습 데이터 구성
        df_p = df.reset_index()
        # 예측값이 튀는 것을 방지하기 위해 상관관계가 높은 지표만 선별
        df_p = df_p[['Date', 'Close', 'KOSPI', 'RSI', 'MACD']].rename(columns={'Date': 'ds', 'Close': 'y'})
        df_p['ds'] = df_p['ds'].dt.tz_localize(None)
        
        # 4. 모델 설정 및 학습
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.15  # 추세 변화 민감도 상향
        )

        # 외부 변수 등록
        model.add_regressor('KOSPI')
        model.add_regressor('RSI')
        model.add_regressor('MACD')
        model.fit(df_p)
        
        # 5. 미래 데이터 생성 및 변수 예측 (하락/상승 변동성 부여)
        future = model.make_future_dataframe(periods=predict_days, freq='B')
        
        # 미래의 보조 변수들을 단순히 고정하지 않고 최근 추세를 반영하여 채움
        for col in ['KOSPI', 'RSI', 'MACD']:
            last_val = df_p[col].iloc[-1]
            # 최근 5일간의 평균 변화량 계산
            delta = df_p[col].diff().tail(5).mean()

            future_vals = []
            current = last_val
            for i in range(predict_days):
                current += delta * (0.8 ** i) # 변화가 점차 수렴하도록 설정
                future_vals.append(current)

            future[col] = list(df_p[col]) + future_vals

        forecast = model.predict(future)

        # 6. 기존 응답 구조에 맞게 데이터 패키징
        history = {}
        history_volume = {}
        history_rsi = {}
        history_ma20 = {}

        for date, row in plot_df.iterrows():
            date_str = date.strftime('%Y-%m-%d')
            history[date_str] = round(float(row['Close']), 2)
            history_volume[date_str] = int(row['Volume'])
            history_rsi[date_str] = round(float(row['RSI']), 2) if not pd.isna(row['RSI']) else 0
            history_ma20[date_str] = round(float(row['MA20']), 2) if not pd.isna(row['MA20']) else 0

        prediction = {}
        last_history_date = df_p['ds'].max()
        # 마지막 역사적 데이터를 예측의 시작점으로 연결
        prediction[last_history_date.strftime('%Y-%m-%d')] = round(float(df_p['y'].iloc[-1]), 2)

        future_forecast = forecast[forecast['ds'] > last_history_date]
        for _, row in future_forecast.iterrows():
            prediction[row['ds'].strftime('%Y-%m-%d')] = round(float(row['yhat']), 2)

        # 7. 수급 및 이벤트 데이터 (기존 구조 유지)
        investors = {
            "dates": df_p['ds'].tail(5).dt.strftime('%Y-%m-%d').tolist(),
            "foreign": [120000, -50000, 300000, 450000, -120000],
            "institution": [80000, 120000, -200000, 50000, 210000]
        }

        events = {
            "2026-04-15": "1분기 실적 발표 임박",
            "2026-04-20": "반도체 수출 호조 뉴스"
        }

        return {
            "symbol": code,
            "history": history,
            "prediction": prediction,
            "volume": history_volume,
            "indicators": {
                "rsi": history_rsi,
                "ma20": history_ma20
            },
            "investors": investors,
            "events": events
        }

    except Exception as e:
        logger.error(f"Error: {e}")
        return {"symbol": code, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
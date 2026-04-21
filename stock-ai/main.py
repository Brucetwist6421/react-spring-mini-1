import yfinance as yf
from fastapi import FastAPI
from prophet import Prophet
import pandas as pd
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import logging
import pandas_ta as ta  # 기술적 지표 계산을 위해 추가

# 로그 설정
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
async def get_stock_prediction(code: str, period: str = "1y", predict_days: int = 15):
    try:
        ticker = f"{code}.KS"
        
        # 1. 데이터 수집
        df = yf.download(ticker, period=period)
        
        if df.empty:
            return {"symbol": code, "error": "데이터를 찾을 수 없습니다."}

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # 2. 기술적 지표 계산 (RSI, MA20)
        # pandas_ta를 사용하여 간편하게 계산합니다.
        df['RSI'] = ta.rsi(df['Close'], length=14)
        df['MA20'] = ta.sma(df['Close'], length=20)
        
        # 지표 계산 초기의 NaN 값 제거 (학습을 위해 필수)
        df = df.dropna()

        # 3. Prophet 학습용 데이터 정제
        df_p = df[['Close', 'Volume', 'RSI', 'MA20']].reset_index()
        df_p.columns = ['ds', 'y', 'volume', 'rsi', 'ma20']
        df_p['ds'] = df_p['ds'].dt.tz_localize(None)

        # 4. Prophet 모델 설정 및 다중 회귀 변수(Regressors) 등록
        model = Prophet(
            daily_seasonality=False, 
            weekly_seasonality=True, 
            yearly_seasonality=True
        )
        
        # 거래량뿐만 아니라 RSI와 이평선을 예측 변수로 추가
        model.add_regressor('volume') 
        model.add_regressor('rsi')
        model.add_regressor('ma20')
        
        model.fit(df_p)
        
        # 5. 미래 데이터프레임 생성 및 보조 변수 채우기
        future = model.make_future_dataframe(periods=predict_days, freq='B')
        
        # 미래의 지표는 정확히 알 수 없으므로, 마지막 값으로 채우는(Last Observation Carried Forward) 방식을 사용합니다.
        avg_volume = df_p['volume'].mean()
        last_rsi = df_p['rsi'].iloc[-1]
        last_ma20 = df_p['ma20'].iloc[-1]

        # 과거 + 미래 데이터 결합
        future['volume'] = df_p['volume'].tolist() + [avg_volume] * predict_days
        future['rsi'] = df_p['rsi'].tolist() + [last_rsi] * predict_days
        future['ma20'] = df_p['ma20'].tolist() + [last_ma20] * predict_days
        
        forecast = model.predict(future)

        # 6. 결과 데이터 정제
        history = {}
        history_volume = {}
        history_rsi = {} # 프론트엔드 추가 시각화용
        
        for _, row in df_p.iterrows():
            date_str = row['ds'].strftime('%Y-%m-%d')
            history[date_str] = round(float(row['y']), 2)
            history_volume[date_str] = int(row['volume'])
            history_rsi[date_str] = round(float(row['rsi']), 2)
        
        prediction = {}
        last_history_date = df_p['ds'].max()
        last_price = float(df_p['y'].iloc[-1])
        
        prediction[last_history_date.strftime('%Y-%m-%d')] = round(last_price, 2)

        future_forecast = forecast[forecast['ds'] > last_history_date]
        for _, row in future_forecast.iterrows():
            prediction[row['ds'].strftime('%Y-%m-%d')] = round(float(row['yhat']), 2)

        # 7. 수급 데이터 (가상의 데이터 - 실제 API 연동 전 구조 확인용)
        # 실제 구현 시 pykrx 등을 사용하여 외인/기관 순매수량을 가져와야 합니다.
        investors = {
            "dates": df_p['ds'].tail(5).dt.strftime('%Y-%m-%d').tolist(),
            "foreign": [120000, -50000, 300000, 450000, -120000], # 순매수 수량 예시
            "institution": [80000, 120000, -200000, 50000, 210000]
        }

        # 8. 뉴스/이벤트
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
                "rsi": history_rsi
            },
            "investors": investors,
            "events": events
        }

    except Exception as e:
        logger.error(f"Error occurred: {e}")
        return {"symbol": code, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
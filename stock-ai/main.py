import yfinance as yf
from fastapi import FastAPI
from prophet import Prophet
import pandas as pd
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import logging

# 로그 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 설정 (React 연동을 위해 필요)
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

        # 2. Prophet 학습용 데이터 정제 (Close와 Volume 포함)
        df_p = df[['Close', 'Volume']].reset_index()
        df_p.columns = ['ds', 'y', 'volume']
        df_p['ds'] = df_p['ds'].dt.tz_localize(None)

        # 3. Prophet 모델 설정 및 '거래량' 추가 변수 등록
        model = Prophet(
            daily_seasonality=False, 
            weekly_seasonality=True, 
            yearly_seasonality=True
        )
        # 거래량을 보조 회귀 변수로 추가하여 가격 예측에 반영
        model.add_regressor('volume') 
        model.fit(df_p)
        
        # 4. 미래 데이터프레임 생성 및 거래량 채우기
        future = model.make_future_dataframe(periods=predict_days, freq='B')
        
        # 미래의 거래량은 알 수 없으므로 과거 평균값으로 채움 (학습 모델의 규칙 준수)
        avg_volume = df_p['volume'].mean()
        # 과거 실제 거래량 + 미래 예측 기간의 평균 거래량 리스트 생성
        future['volume'] = df_p['volume'].tolist() + [avg_volume] * predict_days
        
        forecast = model.predict(future)

        # 5. 결과 데이터 정제
        history = {}
        history_volume = {} # 차트 하단 막대그래프용
        for _, row in df_p.iterrows():
            date_str = row['ds'].strftime('%Y-%m-%d')
            history[date_str] = round(float(row['y']), 2)
            history_volume[date_str] = int(row['volume'])
        
        prediction = {}
        last_history_date = df_p['ds'].max()
        last_price = float(df_p['y'].iloc[-1])
        
        # 실제 마지막 값을 예측의 시작점으로 설정 (차트 연결)
        prediction[last_history_date.strftime('%Y-%m-%d')] = round(last_price, 2)

        future_forecast = forecast[forecast['ds'] > last_history_date]
        for _, row in future_forecast.iterrows():
            prediction[row['ds'].strftime('%Y-%m-%d')] = round(float(row['yhat']), 2)

        # 6. 뉴스/이벤트 (기존 로직 유지)
        events = {
            "2026-04-15": "1분기 실적 발표 임박",
            "2026-04-20": "반도체 수출 호조 뉴스"
        }

        # logger.info(f"거래량 데이터 샘플 (첫 1건): {list(history_volume.items())[0]}")

        return {
            "symbol": code,
            "history": history,
            "prediction": prediction,
            "volume": history_volume,
            "events": events
        }

    except Exception as e:
        print(f"Error: {e}")
        return {"symbol": code, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
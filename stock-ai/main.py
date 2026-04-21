import yfinance as yf
from fastapi import FastAPI
from prophet import Prophet
import pandas as pd
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정 (React 연동을 위해 필요)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/stock/{code}")
async def get_stock_prediction(code: str, period: str = "1y", predict_days: int = 15):
    try:
        # 코스피(.KS), 코스닥(.KQ) 구분은 실제 서비스 시 추가 로직 필요 (여기선 KS 기준)
        ticker = f"{code}.KS"
        
        # 1. 데이터 수집
        df = yf.download(ticker, period=period)
        
        if df.empty:
            return {"symbol": code, "error": "데이터를 찾을 수 없습니다."}

        # Multi-index 컬럼 구조 평탄화
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # 2. Prophet 형식 가공
        df_p = df[['Close']].reset_index()
        df_p.columns = ['ds', 'y']
        df_p['ds'] = df_p['ds'].dt.tz_localize(None)

        # 3. 모델 학습
        model = Prophet(
            daily_seasonality=False, # 주식은 일일 변동성이 크지 않아 끎
            weekly_seasonality=True, 
            yearly_seasonality=True
        )
        model.fit(df_p)
        
        # 4. 미래 예측 (freq='B'로 평일만 예측)
        future = model.make_future_dataframe(periods=predict_days, freq='B')
        forecast = model.predict(future)

        # 5. 결과 데이터 정제
        history = {}
        for date, row in df.iterrows():
            val = row['Close']
            price = float(val.iloc[0]) if isinstance(val, pd.Series) else float(val)
            history[date.strftime('%Y-%m-%d')] = round(price, 2)
        
        # 예측 데이터 (실제 데이터 마지막 날짜 이후만 추출)
        prediction = {}
        last_history_date = df_p['ds'].max()
        
        # [연결 고리] 차트가 끊기지 않게 실제 마지막 값을 예측 시작점에 삽입
        last_price = float(df['Close'].iloc[-1])
        prediction[last_history_date.strftime('%Y-%m-%d')] = round(last_price, 2)

        future_forecast = forecast[forecast['ds'] > last_history_date]
        for _, row in future_forecast.iterrows():
            prediction[row['ds'].strftime('%Y-%m-%d')] = round(float(row['yhat']), 2)

        return {
            "symbol": code,
            "history": history,
            "prediction": prediction
        }

    except Exception as e:
        print(f"Error: {e}")
        return {"symbol": code, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
import yfinance as yf
from fastapi import FastAPI
from prophet import Prophet
import pandas as pd
import uvicorn

app = FastAPI()

# 쿼리 파라미터로 period와 predict_days를 받도록 추가
@app.get("/stock/{code}")
def get_stock_prediction(code: str, period: str = "1y", predict_days: int = 15):
    try:
        ticker = f"{code}.KS"
        
        # 1. 데이터 수집 (요청받은 period 사용)
        df = yf.download(ticker, period=period)
        
        if df.empty:
            return {"symbol": code, "error": "데이터를 찾을 수 없습니다."}

        # Multi-index 컬럼 평탄화
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # 2. Prophet 형식 가공
        df_p = df[['Close']].reset_index()
        df_p.columns = ['ds', 'y']
        df_p['ds'] = df_p['ds'].dt.tz_localize(None)

        # 3. 모델 학습
        model = Prophet(daily_seasonality=True, weekly_seasonality=True, yearly_seasonality=True)
        model.fit(df_p)
        
        # 4. 미래 예측 (요청받은 predict_days 사용)
        future = model.make_future_dataframe(periods=predict_days)
        forecast = model.predict(future)

        # 5. 결과 데이터 정제
        history = {}
        # 전체 조회 기간 중 프론트에 넘길 데이터 (필요에 따라 .tail() 조절)
        for date, row in df.iterrows(): 
            val = row['Close']
            price = float(val.iloc[0]) if isinstance(val, pd.Series) else float(val)
            history[date.strftime('%Y-%m-%d')] = round(price, 2)
        
        prediction = {}
        # 예측된 미래 데이터 정제
        for _, row in forecast[['ds', 'yhat']].tail(predict_days).iterrows():
            prediction[row['ds'].strftime('%Y-%m-%d')] = round(float(row['yhat']), 2)

        return {
            "symbol": code,
            "history": history,
            "prediction": prediction
        }

    except Exception as e:
        print(f"Error processing stock {code}: {e}")
        return {"symbol": code, "history": None, "prediction": None, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
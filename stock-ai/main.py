import yfinance as yf
from fastapi import FastAPI
from prophet import Prophet
import pandas as pd
import uvicorn

app = FastAPI()

@app.get("/stock/{code}")
def get_stock_prediction(code: str):
    try:
        ticker = f"{code}.KS"
        
        # 1. 데이터 수집
        df = yf.download(ticker, period="2y")
        
        if df.empty:
            return {"symbol": code, "error": "데이터를 찾을 수 없습니다."}

        # [중요] Multi-index 컬럼 구조를 단일 레벨로 평탄화
        # yfinance 업데이트로 인해 'Close' 컬럼이 ('Close', '005930.KS') 처럼 올 수 있음
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # 2. Prophet 형식 가공
        df_p = df[['Close']].reset_index()
        df_p.columns = ['ds', 'y']
        df_p['ds'] = df_p['ds'].dt.tz_localize(None)

        # 3. 모델 학습
        model = Prophet(daily_seasonality=True, weekly_seasonality=True, yearly_seasonality=True)
        model.fit(df_p)
        
        # 4. 미래 5일 예측
        future = model.make_future_dataframe(periods=5)
        forecast = model.predict(future)

        # 5. 결과 데이터 정제
        # 과거 데이터 (최근 10일)
        history = {}
        for date, row in df.tail(10).iterrows():
            # row['Close']가 혹시라도 Series일 경우를 대비해 첫 번째 값만 취함
            val = row['Close']
            price = float(val.iloc[0]) if isinstance(val, pd.Series) else float(val)
            history[date.strftime('%Y-%m-%d')] = round(price, 2)
        
        # 예측 데이터 (미래 5일)
        prediction = {}
        for _, row in forecast[['ds', 'yhat']].tail(5).iterrows():
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
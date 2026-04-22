import yfinance as yf
from fastapi import FastAPI
from prophet import Prophet
import pandas as pd
import pandas_ta as ta
import numpy as np
import logging
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime

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
async def get_stock_prediction(code: str, period: str = "2y", predict_days: int = 15):
    try:
        ticker_symbol = f"{code}.KS"
        
        # 1. 데이터 수집
        # Close 외에 Volume도 필요하므로 yf.download 구조 변경
        raw_data = yf.download([ticker_symbol, "^KS11", "^SOX", "^IXIC", "USDKRW=X"], period="5y")

        # MultiIndex 처리 및 데이터 추출
        close_data = raw_data['Close']
        volume_data = raw_data['Volume'][ticker_symbol] # 해당 종목의 거래량만 추출

        if close_data[ticker_symbol].dropna().empty:
            return {"error": "데이터를 가져올 수 없습니다."}

        df = pd.DataFrame({
            'y': close_data[ticker_symbol],
            'Volume': volume_data,
            'KOSPI': close_data['^KS11'],
            'SOX': close_data['^SOX'],
            'NASDAQ': close_data['^IXIC'],
            'EXCHANGE': close_data['USDKRW=X']
        }).dropna()

        # 2. '산업 발전성' 및 '기술적' 지표 생성
        # 산업 발전 궤적: 반도체 지수의 200일 이평선 (장기 성장 트렌드)
        df['SOX_Trend'] = df['SOX'].rolling(window=200).mean()
        # 기술적 지표
        df['RSI'] = ta.rsi(df['y'], length=14)
        macd = ta.macd(df['y'])
        df['MACD'] = macd.iloc[:, 0] if macd is not None else 0
        df['MA20'] = ta.sma(df['y'], length=20)

        # NaN 제거 (이평선 등으로 발생한 초기값)
        df_clean = df.dropna()

        # 3. Prophet 학습 데이터 구성
        df_p = df_clean.reset_index().rename(columns={'Date': 'ds'})
        df_p['ds'] = df_p['ds'].dt.tz_localize(None)
        
        # 4. 모델 설정 (장기 트렌드와 산업 변수 통합)
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.05 # 장기 트렌드 학습을 위해 안정적으로 설정
        )

        # 외생 변수 등록 (산업 발전 + 매크로 + 기술 지표)
        for col in ['KOSPI', 'SOX', 'SOX_Trend', 'NASDAQ', 'EXCHANGE', 'RSI', 'MACD']:
            model.add_regressor(col)

        model.fit(df_p)

        # 5. 미래 데이터 및 변수 예측 (평균 회귀 + 추세 반영)
        future = model.make_future_dataframe(periods=predict_days, freq='B')

        for col in ['KOSPI', 'SOX', 'SOX_Trend', 'NASDAQ', 'EXCHANGE', 'RSI', 'MACD']:
            last_val = df_p[col].iloc[-1]
            mean_val = df_p[col].tail(252).mean() # 최근 1년 평균값으로의 회귀

            future_vals = []
            current = last_val
            for i in range(predict_days):
                # 환율이나 지수는 최근 추세를 반영하되 서서히 평균으로 수렴
                current = current * 0.8 + mean_val * 0.2
                future_vals.append(current)

            future[col] = list(df_p[col]) + future_vals

        forecast = model.predict(future)

        # 6. 결과 데이터 정제 (JSON 에러 방지를 위해 float 변환 및 NaN 체크 필수)
        # 시각화 데이터는 사용자가 선택한 period에 맞춰 절단
        display_days = {"1y": 252, "2y": 504, "5y": 1260}.get(period, 252)
        plot_df = df.tail(display_days)

        def clean_val(v, default=0):
            """NaN이나 Infinity를 처리하여 JSON 에러 방지"""
            if pd.isna(v) or np.isinf(v):
                return default
            return round(float(v), 2)
        history = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['y'])}
        history_volume = {d.strftime('%Y-%m-%d'): int(v) if not pd.isna(v) else 0 for d, v in zip(plot_df.index, plot_df['Volume'])}
        history_rsi = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['RSI'])}
        history_ma20 = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['MA20'])}

        prediction = {}
        last_date = df_p['ds'].max()
        prediction[last_date.strftime('%Y-%m-%d')] = clean_val(df_p['y'].iloc[-1])

        future_forecast = forecast[forecast['ds'] > last_date]
        for _, row in future_forecast.iterrows():
            prediction[row['ds'].strftime('%Y-%m-%d')] = clean_val(row['yhat'])

        # 7. 수급 및 이벤트 데이터 (기존 구조 유지 및 확장)
        return {
            "symbol": code,
            "industry_status": "반도체 산업 장기 성장 추세 반영됨",
            "history": history,
            "prediction": prediction,
            "volume": history_volume,
            "indicators": {
                "rsi": history_rsi,
                "ma20": history_ma20
            },
            "investors": {
                "dates": df_p['ds'].tail(5).dt.strftime('%Y-%m-%d').tolist(),
                "foreign": [120000, -50000, 300000, 450000, -120000],
                "institution": [80000, 120000, -200000, 50000, 210000]
            },
            "events": {
                "2026-04-15": "실적 발표 임박",
                "2026-04-20": "반도체 수출 호조"
            }
        }

    except Exception as e:
        logger.error(f"Error occurred: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
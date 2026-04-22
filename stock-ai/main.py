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
        
        # [수정] 지표 계산 및 Prophet 학습을 위해 최소 1년의 데이터 확보
        # 사용자가 1mo를 요청해도 내부적으론 1y를 가져와서 계산의 안정성을 높입니다.
        fetch_period = "1y" if period in ["1d", "5d", "1mo", "3mo"] else period
        df = yf.download(ticker_symbol, period=fetch_period)
        kospi_data = yf.download("^KS11", period=fetch_period)

        if df.empty:
            return {"symbol": code, "error": "데이터를 찾을 수 없습니다."}

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # 2. 기술적 지표 계산
        df['RSI'] = ta.rsi(df['Close'], length=14)
        df['MA20'] = ta.sma(df['Close'], length=20)

        # [수정] MACD 계산 및 None 체크 (에러 방지)
        macd = ta.macd(df['Close'])
        if macd is not None and not macd.empty:
            # MACD_12_26_9 컬럼을 안전하게 가져옴
            df['MACD'] = macd.iloc[:, 0]
        else:
            df['MACD'] = 0

        # KOSPI 지수 결합 (인덱스 기준 매칭)
        if not kospi_data.empty:
            if isinstance(kospi_data.columns, pd.MultiIndex):
                kospi_data.columns = kospi_data.columns.get_level_values(0)
            df['KOSPI'] = kospi_data['Close']
        else:
            df['KOSPI'] = df['Close'] # 데이터 없으면 주가로 대체

        # NaN 제거 전 시각화용 데이터 보관
        plot_df = df.copy()
        df = df.dropna()

        # 3. Prophet 학습 데이터 구성
        df_p = df.reset_index()
        df_p = df_p[['Date', 'Close', 'KOSPI', 'RSI', 'MACD']].rename(columns={'Date': 'ds', 'Close': 'y'})
        df_p['ds'] = df_p['ds'].dt.tz_localize(None)
        
        # 4. 모델 설정 (안정성 위주)
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.15
        )
        model.add_regressor('KOSPI')
        model.add_regressor('RSI')
        model.add_regressor('MACD')
        model.fit(df_p)
        
        # 5. 미래 데이터 생성 및 보조 변수 채우기
        future = model.make_future_dataframe(periods=predict_days, freq='B')
        
        for col in ['KOSPI', 'RSI', 'MACD']:
            last_val = df_p[col].iloc[-1]
            delta = df_p[col].diff().tail(7).mean() # 최근 7일 평균 변화율

            future_vals = []
            current = last_val
            for i in range(predict_days):
                current += delta * (0.8 ** i)
                future_vals.append(current)
            future[col] = list(df_p[col]) + future_vals

        forecast = model.predict(future)

        # 6. 결과 패키징 (사용자가 요청한 period에 맞춰 history 필터링 가능)
        # 여기서는 전체 history를 보내거나 plot_df를 조절할 수 있습니다.
        history = {}
        history_volume = {}
        history_rsi = {}
        history_ma20 = {}

        # 마지막 100일치 데이터만 history로 전달 (너무 많으면 차트가 무거워짐)
        display_df = plot_df.tail(100)
        for date, row in display_df.iterrows():
            date_str = date.strftime('%Y-%m-%d')
            history[date_str] = round(float(row['Close']), 2)
            history_volume[date_str] = int(row['Volume'])
            history_rsi[date_str] = round(float(row['RSI']), 2) if not pd.isna(row['RSI']) else 0
            history_ma20[date_str] = round(float(row['MA20']), 2) if not pd.isna(row['MA20']) else 0

        prediction = {}
        last_history_date = df_p['ds'].max()
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
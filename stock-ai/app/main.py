from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime, timedelta
import pandas as pd  # pandas_ta 대신 pandas 사용
import logging

from app import config
from app import data_loader as dl
from app import predictor as pt

# 로그 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_methods=["*"], 
    allow_headers=["*"]
)

# RSI 계산 함수 직접 구현 (Wilder's Smoothing 방식)
def calculate_rsi(series, period=14):
    delta = series.diff()
    gain = (delta.where(delta > 0, 0))
    loss = (-delta.where(delta < 0, 0))
    
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    
    # 지수 이동 평균 방식으로 더 정확하게 계산하려면 ewm 사용 가능
    # avg_gain = gain.ewm(alpha=1/period, min_periods=period).mean()
    # avg_loss = loss.ewm(alpha=1/period, min_periods=period).mean()
    
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(0)

# 서버 시작 시 KIS API 토큰 발급
try:
    config.get_access_token()
    logger.info("KIS API Access Token 발급 성공")
except Exception as e:
    logger.error(f"초기 토큰 발급 실패: {e}")

@app.get("/stock/{code}")
async def get_stock_prediction(code: str, period: str = "2y", predict_days: int = 15):
    try:
        pure_code = code.split('.')[0]
        start_date = (datetime.now() - timedelta(days=365*2)).strftime('%Y-%m-%d')

        df_stock = dl.get_stock_data(pure_code, start_date)
        if df_stock.empty:
            return {"error": "시세 데이터를 가져오지 못했습니다."}

        # 데이터 로드
        df_investors = dl.get_investor_data(pure_code)
        fund_info = dl.get_fundamental_data(pure_code)
        
        # Prophet 예측 (predictor.py에서 tail(predict_days) 처리됨)
        forecast = pt.predict_stock(df_stock, predict_days)

        # 표시 기간 설정
        req_period = period.lower().replace("o", "")
        display_days = {"1m": 22, "3m": 66, "6m": 132, "1y": 252, "2y": 504}.get(req_period, 252)
        plot_df = df_stock.tail(display_days)

        # 수급 데이터 정렬 (중요: 날짜 맞춤)
        df_investors_plot = df_investors.reindex(plot_df.index).fillna(0)

        def to_map(series):
            return {d.strftime('%Y-%m-%d'): round(float(v), 2) for d, v in zip(series.index, series)}

        # RSI 계산
        rsi_series = calculate_rsi(df_stock['Close']).tail(display_days)

        return {
            "symbol": code,
            "industry_status": "HANSUNG'S TRI-CORE 분석 엔진 가동 중",
            "history": to_map(plot_df['Close']),
            "prediction": {
                d.strftime('%Y-%m-%d'): {
                    "value": round(float(yhat), 2),
                    "lower": round(float(lower), 2),
                    "upper": round(float(upper), 2)
                } for d, yhat, lower, upper in zip(
                    forecast['ds'], 
                    forecast['yhat'], 
                    forecast['yhat_lower'], 
                    forecast['yhat_upper']
                )
            },
            "volume": {
                d.strftime('%Y-%m-%d'): int(v) for d, v in zip(plot_df.index, plot_df['Volume'])
            },
            "investors": {
                "dates": [d.strftime('%Y-%m-%d') for d in plot_df.index],
                "foreign": df_investors_plot['외국인'].astype(int).tolist(),
                "institution": df_investors_plot['기관합계'].astype(int).tolist()
            },
            "fundamental": fund_info,
            "indicators": {
                "rsi": to_map(rsi_series)
            }
        }

    except Exception as e:
        logger.exception("분석 중 에러 발생")
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
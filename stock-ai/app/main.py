from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime, timedelta
import pandas_ta as ta
import logging

# [수정] 패키지 구조에 맞게 임포트 경로 변경
# uvicorn app.main:app 으로 실행하므로 app 패키지명을 명시합니다.
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

# 서버 시작 시 KIS API 토큰 발급
try:
    config.get_access_token()
    logger.info("KIS API Access Token 발급 성공")
except Exception as e:
    logger.error(f"초기 토큰 발급 실패: {e}")

@app.get("/stock/{code}")
async def get_stock_prediction(code: str, period: str = "2y", predict_days: int = 15):
    try:
        # 종목 코드 전처리 (예: 005930.KS -> 005930)
        pure_code = code.split('.')[0]
        start_date = (datetime.now() - timedelta(days=365*2)).strftime('%Y-%m-%d')

        # 1. 시세 및 수급 데이터 로드 (data_loader 모듈 이용)
        df_stock = dl.get_stock_data(pure_code, start_date)
        if df_stock.empty:
            return {"error": "시세 데이터를 가져오지 못했습니다."}

        df_investors = dl.get_investor_data(pure_code)
        fund_info = dl.get_fundamental_data(pure_code)

        # 2. 예측 로직 실행 (predictor 모듈 이용)
        forecast = pt.predict_stock(df_stock, predict_days)

        # 3. 데이터 가공 및 응답 (Java StockVO 구조 유지)
        req_period = period.lower().replace("o", "")
        display_days = {"1m": 22, "3m": 66, "6m": 132, "1y": 252, "2y": 504}.get(req_period, 252)
        plot_df = df_stock.tail(display_days)

        # 유틸리티 함수: Series를 날짜-값 맵으로 변환
        def to_map(series):
            return {d.strftime('%Y-%m-%d'): round(float(v), 2) for d, v in zip(series.index, series)}

        return {
            "symbol": code,
            "industry_status": "HANSUNG'S TRI-CORE 분석 엔진 가동 중",
            "history": to_map(plot_df['Close']),
            "prediction": {
                d.strftime('%Y-%m-%d'): round(v, 2) for d, v in zip(forecast['ds'], forecast['yhat'])
            },
            "volume": {
                d.strftime('%Y-%m-%d'): int(v) for d, v in zip(plot_df.index, plot_df['Volume'])
            },
            "investors": {
                "dates": [d.strftime('%Y-%m-%d') for d in plot_df.index],
                "foreign": [
                    int(df_investors.loc[d, '외국인']) if not df_investors.empty and d in df_investors.index else 0 
                    for d in plot_df.index
                ],
                "institution": [
                    int(df_investors.loc[d, '기관합계']) if not df_investors.empty and d in df_investors.index else 0 
                    for d in plot_df.index
                ]
            },
            "fundamental": fund_info,
            "indicators": {
                "rsi": to_map(ta.rsi(plot_df['Close'], length=14).fillna(0))
            }
        }

    except Exception as e:
        logger.exception("분석 중 에러 발생")
        return {"error": str(e)}

if __name__ == "__main__":
    # 로컬 테스트용 실행부
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
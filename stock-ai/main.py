from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from contextlib import asynccontextmanager # 추가

from app import config
from app.routers import stock

# 로그 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 💡 Lifespan 이벤트 핸들러 정의
@asynccontextmanager
async def lifespan(app: FastAPI):
    # [Startup] 서버 시작 시 실행될 로직
    try:
        config.get_access_token()
        logger.info("KIS API Access Token 발급 성공 (Lifespan)")
    except Exception as e:
        logger.error(f"초기 토큰 발급 실패: {e}")
    
    yield  # 서버가 작동하는 동안 이 지점에서 대기
    
    # [Shutdown] 서버 종료 시 실행될 로직 (필요 시)
    logger.info("서버를 종료합니다.")

# FastAPI 초기화 시 lifespan 등록
app = FastAPI(title="HANSUNG'S TRI-CORE API", lifespan=lifespan)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# 라우터 등록
app.include_router(stock.router)

@app.get("/")
async def root():
    return {"message": "HANSUNG'S TRI-CORE 분석 엔진이 정상 작동 중입니다."}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
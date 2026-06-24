from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import asyncio  # 💡 백그라운드 주기적 실행을 위해 추가
from contextlib import asynccontextmanager

from app import config
from app.routers import stock

# 로그 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 💡 12시간마다 토큰을 자동으로 갱신하는 백그라운드 태스크
async def _token_refresh_loop():
    try:
        while True:
            # KIS 토큰은 24시간 유효하므로, 안전하게 12시간(43200초)마다 한 번씩 갱신합니다.
            await asyncio.sleep(43200) 
            
            print("\n🔄 [BACKGROUND TASK] KIS API Access Token 자동 주기 갱신을 시작합니다.")
            config.get_access_token()
            print("✅ [BACKGROUND TASK] 토큰 주기 갱신 완료.\n")
            logger.info("KIS API Access Token 자동 주기 갱신 성공")
    except asyncio.CancelledError:
        # 서버 종료 시 태스크가 안전하게 취소됨
        print("🛑 [BACKGROUND TASK] 토큰 갱신 백그라운드 태스크가 종료되었습니다.")

# Lifespan 이벤트 핸들러 정의
@asynccontextmanager
async def lifespan(app: FastAPI):
    # [Startup] 서버 시작 시 실행될 로직
    print("\n🚀 [STARTUP] FastAPI 서버 가동: KIS 초기 토큰 발급을 시도합니다.")
    try:
        config.get_access_token()
        print("✅ [STARTUP] 초기 토큰 발급 성공! TRI-CORE 분석 엔진 준비 완료.\n")
        logger.info("KIS API Access Token 발급 성공 (Lifespan)")
    except Exception as e:
        print(f"💥 [STARTUP CRASH] 초기 토큰 발급 실패: {e}\n")
        logger.error(f"초기 토큰 발급 실패: {e}")
    
    # 💡 서버가 켜져 있는 동안 무한히 돌아갈 백그라운드 리프레시 루프 가동
    refresh_task = asyncio.create_task(_token_refresh_loop())
    
    yield  # ─── 서버가 작동하는 동안 이 지점에서 대기 ───
    
    # [Shutdown] 서버 종료 시 실행될 로직
    refresh_task.cancel()  # 백그라운드 태스크 안전하게 종료
    print("🛑 [SHUTDOWN] FastAPI 서버를 종료합니다.")
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
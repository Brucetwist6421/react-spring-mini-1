import numpy as np

# [패치] NumPy 2.x 호환성 (최상단 유지)
for attr, target in [("float_", np.float64), ("int_", np.int64), ("bool_", bool)]:
    if not hasattr(np, attr): setattr(np, attr, target)

from prophet import Prophet 
import pandas as pd
import pandas_ta as ta
import yfinance as yf
from fastapi import FastAPI
import logging
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime, timedelta
from pykrx import stock

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

@app.get("/stock/{code}")
async def get_stock_prediction(code: str, period: str = "2y", predict_days: int = 15):
    try:
        pure_code = code.split('.')[0]
        end_dt = datetime.now()
        start_dt = end_dt - timedelta(days=365 * 5)
        s_date, e_date = start_dt.strftime("%Y%m%d"), end_dt.strftime("%Y%m%d")

        # 1. 시세 데이터
        df_stock = stock.get_market_ohlcv(s_date, e_date, pure_code)
        if df_stock.empty: return {"error": "데이터를 찾을 수 없습니다."}
        
        # 2. 수급 데이터 (함수명 수정: get_market_net_purchases_of_equities)
        # 이 함수는 일자별, 종목별 순매수량을 반환합니다.
        df_investors = stock.get_market_net_purchases_of_equities(s_date, e_date, pure_code)
        
        # 3. 추가 데이터 (Fundamental, 외인비중, 공매도)
        df_fund = stock.get_market_fundamental_by_date(s_date, e_date, pure_code)
        df_foreign = stock.get_exhaustion_rates_of_foreign_investment_by_date(s_date, e_date, pure_code)
        df_short = stock.get_shorting_status_by_date(s_date, e_date, pure_code)

        # 4. 데이터 통합 레이어
        df = pd.DataFrame(index=df_stock.index)
        df['y'] = df_stock['종가']
        df['Volume'] = df_stock['거래량']
        
        # Fundamental 데이터 병합
        if not df_fund.empty:
            df = df.join(df_fund[['PER', 'PBR', 'DIV', 'EPS']])
        
        # 외인/공매도 병합
        if not df_foreign.empty: df['Foreign_Rate'] = df_foreign['보유비중']
        if not df_short.empty: df['Short_Balance'] = df_short['잔고수량']

        # 5. 기술적 지표 및 Prophet 학습 (중략 - 기존 로직과 동일)
        # ... (이전 코드의 Prophet 학습 및 예측 부분 유지) ...
        
        # [데이터 정리용 클린 데이터]
        df_clean = df.ffill().bfill().fillna(0)
        
        # 6. JSON 반환 (Java StockVO 구조)
        req_period = period.lower().replace("o", "")
        display_days = {"1m": 22, "3m": 66, "6m": 132, "1y": 252, "2y": 504}.get(req_period, 252)
        plot_df = df_clean.tail(display_days)

        def to_double_map(series): 
            return {d.strftime('%Y-%m-%d'): round(float(v), 2) for d, v in zip(series.index, series)}

        return {
            "symbol": code,
            "industry_status": "HANSUNG'S TRI-CORE 분석 엔진 가동 중",
            "total": {}, # history + prediction 병합 로직 (생략)
            "history": to_double_map(plot_df['y']),
            "prediction": {}, # Prophet 결과 맵 (생략)
            "volume": {d.strftime('%Y-%m-%d'): int(v) for d, v in zip(plot_df.index, plot_df['Volume'])},
            "events": {"2026-04-15": "시스템 업데이트 완료"},
            "indicators": {
                "rsi": to_double_map(ta.rsi(plot_df['y'], length=14).fillna(0)),
                "per": to_double_map(plot_df['PER']) if 'PER' in plot_df else {}
            },
            "investors": {
                "dates": [d.strftime('%Y-%m-%d') for d in plot_df.index],
                # '외국인', '기관합계' 컬럼명 확인
                "foreign": [int(df_investors.loc[d, '외국인']) if d in df_investors.index else 0 for d in plot_df.index],
                "institution": [int(df_investors.loc[d, '기관합계']) if d in df_investors.index else 0 for d in plot_df.index]
            }
        }

    except Exception as e:
        logger.exception(f"Error: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
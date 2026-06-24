from fastapi import APIRouter, Query
from datetime import datetime, timedelta
import logging
import pandas as pd
from app import data_loader as dl
from app import predictor as pt

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/stock")

# RSI 계산 함수 (Wilder's Smoothing 방식)
def calculate_rsi(series, period=14):
    delta = series.diff()
    gain = (delta.where(delta > 0, 0))
    loss = (-delta.where(delta < 0, 0))
    avg_gain = gain.rolling(window=period).mean()
    avg_loss = loss.rolling(window=period).mean()
    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(0)

def to_map(series):
    return {d.strftime('%Y-%m-%d'): round(float(v), 2) for d, v in zip(series.index, series)}

# 1. 종목 검색 및 자동완성 API
@router.get("/search/{query}")
async def search_stocks(query: str):
    """
    종목명 또는 종목코드로 유사 종목 리스트를 반환합니다.
    """
    try:
        # data_loader에서 전체 종목 리스트 DataFrame을 가져온다고 가정
        all_stocks = dl.get_all_stocks() 
        
        if all_stocks is None or all_stocks.empty:
            return []

        # 이름이나 코드에 검색어가 포함된 항목 필터링 (최대 10개)
        results = all_stocks[
            all_stocks['name'].str.contains(query, case=False, na=False) | 
            all_stocks['code'].str.contains(query, na=False)
        ].head(10)

        return [
            {"code": row['code'], "name": row['name']} 
            for _, row in results.iterrows()
        ]
    except Exception as e:
        logger.error(f"검색 중 오류 발생: {e}")
        return []

# 2. 기존 종목 분석 및 예측 API
@router.get("/{code}")
async def get_stock_prediction(code: str, period: str = "2y", predict_days: int = 15):
    try:
        # [강제 출력] 어떤 요청이 들어왔는지 라우터 시작점부터 찍어버립니다.
        print(f"[ROUTER START] 요청받은 코드/이름: {code}, 기간: {period}")

        pure_code = code.split('.')[0]
        if not pure_code.isdigit():
            print(f"'{pure_code}'는 숫자가 아니므로 종목명 검색을 시작합니다.")
            converted_code = dl.get_stock_code_by_name(pure_code)
            print(f"이름 검색 결과 반환된 코드: {converted_code}")
            
            if not converted_code:
                return {"error": f"'{pure_code}'에 해당하는 종목을 찾을 수 없습니다."}
            pure_code = converted_code

        print(f"종목코드 [{pure_code}]로 데이터를 수집합니다.")

        # 2. 데이터 로드 및 예측
        start_date = (datetime.now() - timedelta(days=365*2)).strftime('%Y-%m-%d')
        df_stock = dl.get_stock_data(pure_code, start_date)
        
        if df_stock.empty:
            print("시세 데이터(df_stock)가 비어있습니다.")
            return {"error": "시세 데이터를 가져오지 못했습니다."}

        print("🔄 수급 데이터(get_investor_data) 요청 중...")
        df_investors = dl.get_investor_data(pure_code)
        
        print("🔄 기본적 분석 데이터(get_fundamental_data) 요청 중...")
        fund_info = dl.get_fundamental_data(pure_code)
        
        print("🔄 Prophet 예측 엔진(predict_stock) 가동 중...")
        forecast = pt.predict_stock(df_stock, predict_days)

        print("모든 데이터 수집 및 예측 완료. 응답을 조립합니다.")

        # 표시 기간 설정
        req_period = period.lower().replace("o", "")
        display_days = {"1m": 22, "3m": 66, "6m": 132, "1y": 252, "2y": 504}.get(req_period, 252)
        plot_df = df_stock.tail(display_days)

        # 수급 데이터 정렬
        df_investors_plot = df_investors.reindex(plot_df.index).fillna(0)
        rsi_series = calculate_rsi(df_stock['Close']).tail(display_days)

        return {
            "symbol": pure_code,
            "name": dl.get_name_by_code(pure_code),
            "industry_status": "종가 예측 분석 엔진 가동 중",
            "history": to_map(plot_df['Close']),
            "prediction": {
                d.strftime('%Y-%m-%d'): {
                    "value": round(float(yhat), 2),
                    "lower": round(float(lower), 2),
                    "upper": round(float(upper), 2)
                } for d, yhat, lower, upper in zip(
                    forecast['ds'], forecast['yhat'], forecast['yhat_lower'], forecast['yhat_upper']
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
        # 예외 발생 시 어떤 단계에서 터졌는지 터미널에 명확히 기록되도록 설정
        print(f"치명적 오류 발생: {str(e)}")
        logger.exception("분석 중 에러 발생")
        return {"error": str(e)}
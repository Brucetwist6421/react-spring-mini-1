# app/stock_search.py
import logging
from app import data_loader as dl

logger = logging.getLogger(__name__)

def search_stock_list(query: str):
    try:
        # data_loader에서 전체 종목 리스트를 가져온다고 가정 (df_krx)
        # 만약 매번 불러오는 게 느리다면 dl 내부에서 캐싱 처리가 필요합니다.
        df_krx = dl.get_all_stocks() 
        
        if df_krx is None or df_krx.empty:
            return []

        # query가 숫자면 코드에서 검색, 문자면 이름에서 검색
        if query.isdigit():
            mask = df_krx['code'].str.contains(query, na=False)
        else:
            mask = df_krx['name'].str.contains(query, case=False, na=False)

        results = df_krx[mask].head(10) # 너무 많지 않게 10개로 제한
        
        return [
            {"code": row['code'], "name": row['name']} 
            for _, row in results.iterrows()
        ]
    except Exception as e:
        logger.error(f"Search error: {e}")
        return []
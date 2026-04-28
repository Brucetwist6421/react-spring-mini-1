import pandas as pd
import requests
import FinanceDataReader as fdr
import logging
import time
from app.config import APP_KEY, APP_SECRET, URL_BASE, ACCESS_TOKEN

# 로그 설정
logger = logging.getLogger(__name__)

# 전역 변수로 종목 리스트 캐시 설정 (매번 API 호출 방지)
_stock_list_cache = None

def get_stock_code_by_name(name):
    """
    종목명을 입력받아 종목 코드를 반환 (KRX 기준)
    성능을 위해 최초 호출 시에만 StockListing을 수행합니다.
    """
    global _stock_list_cache
    try:
        if _stock_list_cache is None:
            logger.info("KRX 종목 리스트를 캐싱합니다...")
            # KOSPI, KOSDAQ, KONEX 전체 상장사 로드
            _stock_list_cache = fdr.StockListing('KRX')

        # 종목명 검색 (공백 제거 후 비교하여 정확도 향상)
        target = _stock_list_cache[_stock_list_cache['Name'].str.replace(' ', '') == name.replace(' ', '')]
        
        if not target.empty:
            return target.iloc[0]['Code']
        
        # 코드로 직접 입력했을 가능성 대비 (6자리 숫자 확인)
        if name.isdigit() and len(name) == 6:
            return name
            
        return None
    except Exception as e:
        logger.error(f"종목 코드 변환 실패: {e}")
        return None

def get_kis_headers(tr_id):
    """KIS API 공통 헤더 생성"""
    return {
        "Content-Type": "application/json",
        "authorization": f"Bearer {ACCESS_TOKEN}",
        "appkey": APP_KEY,
        "appsecret": APP_SECRET,
        "tr_id": tr_id,
        "custtype": "P"
    }

def get_stock_data(code, start_date):
    """시세 데이터 수집 (FinanceDataReader 사용)"""
    try:
        # 데이터 로드
        df = fdr.DataReader(code, start_date)
        if df.empty:
            logger.warning(f"종목코드 {code}에 대한 데이터가 없습니다.")
        return df
    except Exception as e:
        logger.error(f"FDR 데이터 로드 실패: {e}")
        return pd.DataFrame()

def get_investor_data(code):
    """KIS API: 투자자별 매매동향 (수급)"""
    url = f"{URL_BASE}/uapi/domestic-stock/v1/quotations/inquire-investor"
    headers = get_kis_headers("FHKST01010900")
    
    all_data = []
    last_date = ""

    try:
        for i in range(4):
            if i > 0:
                time.sleep(0.2) # API 호출 제한 방지
                
            params = {
                "FID_COND_MRKT_DIV_CODE": "J",
                "FID_INPUT_ISCD": code,
                "FID_INPUT_DATE_1": last_date
            }
            
            res = requests.get(url, headers=headers, params=params)
            data = res.json()
            
            if data.get('rt_cd') == '0' and data.get('output'):
                output = data['output']
                all_data.extend(output)
                last_date = output[-1]['stck_bsop_date']
                if len(output) < 30:
                    break
            else:
                logger.warning(f"수급 데이터 {i+1}회차 조회 실패: {data.get('msg1')}")
                break

        if not all_data:
            return pd.DataFrame()

        df = pd.DataFrame(all_data)
        df = df.drop_duplicates(subset=['stck_bsop_date'])
        df['날짜'] = pd.to_datetime(df['stck_bsop_date'])
        df.set_index('날짜', inplace=True)
        
        res_df = df[['prsn_ntby_qty', 'orgn_ntby_qty', 'frgn_ntby_qty']].apply(pd.to_numeric)
        res_df.columns = ['개인', '기관합계', '외국인']
        
        return res_df.sort_index()

    except Exception as e:
        logger.error(f"수급 데이터 처리 중 에러: {e}")
        return pd.DataFrame()

def get_fundamental_data(code):
    """KIS API: 주식기본조회 (PER, PBR 등 투자지표)"""
    url = f"{URL_BASE}/uapi/domestic-stock/v1/quotations/inquire-price"
    headers = get_kis_headers("FHKST01010100")
    params = {
        "FID_COND_MRKT_DIV_CODE": "J", 
        "FID_INPUT_ISCD": code
    }
    
    try:
        time.sleep(0.1) # 호출 간격 조정
        res = requests.get(url, headers=headers, params=params)
        res_data = res.json()
        
        data = res_data.get('output', {})
        
        def safe_float(val):
            try:
                if val is None or str(val).strip() in ["", "null", "None"]:
                    return 0.0
                return float(val)
            except (ValueError, TypeError):
                return 0.0

        return {
            "per": safe_float(data.get('per')),
            "pbr": safe_float(data.get('pbr')),
            "eps": safe_float(data.get('eps')),
            "div": safe_float(data.get('dyd')),
            "foreign_rt": safe_float(data.get('frgn_ntby_rt')),
            "change_rt": safe_float(data.get('prdy_ctrt')),
            "vol_power": safe_float(data.get('stck_shrn_vrt'))
        }
    except Exception as e:
        logger.error(f"기본적 분석 데이터 로드 실패: {e}")
        return {"per": 0.0, "pbr": 0.0, "eps": 0.0, "div": 0.0, "foreign_rt": 0.0, "change_rt": 0.0, "vol_power": 0.0}
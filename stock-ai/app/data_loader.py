import pandas as pd
import requests
import FinanceDataReader as fdr
import logging
import time  # API 호출 간격 조절을 위해 필요
from app.config import APP_KEY, APP_SECRET, URL_BASE, ACCESS_TOKEN

# 로그 설정
logger = logging.getLogger(__name__)

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
        df = fdr.DataReader(code, start_date)
        return df
    except Exception as e:
        logger.error(f"FDR 데이터 로드 실패: {e}")
        return pd.DataFrame()

def get_investor_data(code):
    """
    KIS API: 투자자별 매매동향 (수급)
    """
    url = f"{URL_BASE}/uapi/domestic-stock/v1/quotations/inquire-investor"
    headers = get_kis_headers("FHKST01010900")
    
    all_data = []
    last_date = ""

    try:
        for i in range(4):
            # 초당 거래건수 초과 방지 (0.2초 대기)
            if i > 0:
                time.sleep(0.2)
                
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
        # 수급 데이터 조회 직후 바로 호출될 경우를 대비해 살짝 대기
        time.sleep(0.1)
        
        res = requests.get(url, headers=headers, params=params)
        res_data = res.json()
        
        # 로그 활성화: 데이터가 안 나올 때 도커 로그에서 실제 응답을 확인하기 위함
        logger.info(f"KIS Fundamental Raw Response for {code}: {res_data}")
        
        data = res_data.get('output', {})
        
        def safe_float(val):
            try:
                if val is None or str(val).strip() == "" or str(val).lower() == "null":
                    return 0.0
                return float(val)
            except (ValueError, TypeError):
                return 0.0

        return {
            "per": safe_float(data.get('per')),
            "pbr": safe_float(data.get('pbr')),
            "eps": safe_float(data.get('eps')),
            "div": safe_float(data.get('dyd')),
            "foreign_rt": safe_float(data.get('frgn_ntby_rt')), # 외인보유비율(%)
            "change_rt": safe_float(data.get('prdy_ctrt')),     # 전일대비 등락률(%)
            "vol_power": safe_float(data.get('stck_shrn_vrt')) # 체결강도(실시간 수급강도)
        }
    except Exception as e:
        logger.error(f"기본적 분석 데이터 로드 실패: {e}")
        return {"per": 0.0, "pbr": 0.0, "eps": 0.0, "div": 0.0, "foreign_rt": 0.0, "change_rt": 0.0, "vol_power": 0.0}
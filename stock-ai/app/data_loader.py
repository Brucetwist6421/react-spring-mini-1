import pandas as pd
import requests
import FinanceDataReader as fdr
import logging
import time
from app.config import APP_KEY, APP_SECRET, URL_BASE, ACCESS_TOKEN
import re

# 로그 설정
logger = logging.getLogger(__name__)

# 전역 변수로 종목 리스트 캐시 설정 (매번 API 호출 방지)
_stock_list_cache = None

def get_stock_code_by_name(name):
    """
    종목명을 입력받아 종목 코드를 반환 (KRX 기준)
    'LS (006260)' 같은 형태가 들어와도 코드를 정확히 추출합니다.
    """
    global _stock_list_cache
    try:
        if _stock_list_cache is None:
            logger.info("KRX 종목 리스트를 캐싱합니다...")
            _stock_list_cache = fdr.StockListing('KRX')

        name_str = str(name).strip()

        # 1. 정규표현식으로 괄호 안의 6자리 숫자(코드)가 있는지 먼저 확인
        # 예: "LS (006260)" -> "006260" 추출
        code_match = re.search(r'\((\d{6})\)', name_str)
        if code_match:
            return code_match.group(1)

        # 2. 종목명 검색 (기존 로직 유지)
        # 공백 제거 후 비교하여 정확도 향상
        target = _stock_list_cache[_stock_list_cache['Name'].str.replace(' ', '') == name_str.replace(' ', '')]
        
        if not target.empty:
            return target.iloc[0]['Code']
        
        # 3. 입력값 자체가 6자리 숫자(코드)인 경우 처리
        if name_str.isdigit() and len(name_str) == 6:
            return name_str
            
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
                time.sleep(0.5) # API 호출 제한 방지
                
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
    """KIS API: 주식기본조회 (PER, PBR 등 투자지표) 디버깅 버전"""
    url = f"{URL_BASE}/uapi/domestic-stock/v1/quotations/inquire-price"
    headers = get_kis_headers("FHKST01010100")
    params = {
        "FID_COND_MRKT_DIV_CODE": "J", 
        "FID_INPUT_ISCD": code
    }
    
    try:
        time.sleep(0.5) 
        
        res = requests.get(url, headers=headers, params=params)
        res_data = res.json()
        
        # 🔍 [디버깅 1] KIS 서버에서 온 원본 응답 전체를 로그에 출력합니다.
        logger.info(f"==== [DEBUG] KIS API 원본 응답 ({code}) ====")
        logger.info(res_data)
        logger.info("============================================")
        
        # API 응답 결과 확인
        if res_data.get('rt_cd') != '0':
            logger.warning(f"KIS API 호출 실패({code}): {res_data.get('msg1')} (에러코드: {res_data.get('rt_cd')})")
            return {"per": 0.0, "pbr": 0.0, "eps": 0.0, "div": 0.0, "foreign_rt": 0.0, "change_rt": 0.0, "vol_power": 0.0}

        data = res_data.get('output', {})
        
        # 🔍 [디버깅 2] output 내용물만 따로 출력합니다.
        logger.info(f"==== [DEBUG] output 데이터 추출 결과 ====")
        logger.info(data)
        logger.info("============================================")

        if not data:
            logger.warning(f"KIS API 응답 데이터(output)가 비어있음: {code}")
            return {"per": 0.0, "pbr": 0.0, "eps": 0.0, "div": 0.0, "foreign_rt": 0.0, "change_rt": 0.0, "vol_power": 0.0}

        def safe_float(val):
            try:
                if val is None or str(val).strip() in ["", "null", "None", "n/a"]:
                    return 0.0
                return float(val)
            except (ValueError, TypeError):
                return 0.0

        # KIS 기본조회 명세 기준 매핑
        return {
            "per": safe_float(data.get('per')),          
            "pbr": safe_float(data.get('pbrx')),         
            "eps": safe_float(data.get('eps')),          
            "div": safe_float(data.get('perx')), # 배당수익률 대용 (필요시 수정)
            "foreign_rt": safe_float(data.get('frgn_ln_rnw_rt')), 
            "change_rt": safe_float(data.get('prdy_ctrt')),       
            "vol_power": safe_float(data.get('cldg_gskn'))        
        }
    except Exception as e:
        logger.error(f"기본적 분석 데이터 로드 실패 (Code: {code}): {e}")
        return {"per": 0.0, "pbr": 0.0, "eps": 0.0, "div": 0.0, "foreign_rt": 0.0, "change_rt": 0.0, "vol_power": 0.0}
    
def get_all_stocks():
    """
    모든 상장 종목 리스트를 반환합니다. (검색 및 자동완성용)
    """
    global _stock_list_cache
    try:
        if _stock_list_cache is None:
            logger.info("전체 종목 리스트를 새로 고칭합니다...")
            # fdr.StockListing('KRX')는 KOSPI, KOSDAQ, KONEX를 포함합니다.
            _stock_list_cache = fdr.StockListing('KRX')
        
        # 라우터에서 기대하는 'code'와 'name' 컬럼명으로 가공하여 반환
        return _stock_list_cache[['Code', 'Name']].rename(
            columns={'Code': 'code', 'Name': 'name'}
        )
    except Exception as e:
        logger.error(f"전체 종목 리스트 로드 실패: {e}")
        return pd.DataFrame(columns=['code', 'name'])

def get_name_by_code(code):
    """
    종목 코드를 입력받아 해당 종목명을 반환합니다.
    (공백 제거 및 6자리 패딩 처리를 통해 매칭 성공률을 높였습니다.)
    """
    global _stock_list_cache
    try:
        # 1. 캐시가 없으면 로드
        if _stock_list_cache is None:
            get_all_stocks()
            
        if _stock_list_cache is None or _stock_list_cache.empty:
            return code

        # 2. 입력된 코드를 6자리 문자열로 정규화 (예: 20 -> '000020')
        # 앞뒤 공백 제거 후 6자리 숫자로 맞춤
        clean_code = str(code).strip().zfill(6)
        
        # 3. 데이터프레임의 Code 컬럼도 문자열/공백제거 후 비교
        # .values 비교를 통해 인덱스 문제를 방지하고 속도를 높입니다.
        mask = _stock_list_cache['Code'].astype(str).str.strip() == clean_code
        target = _stock_list_cache[mask]
        
        if not target.empty:
            # 매칭된 첫 번째 데이터의 'Name' 반환
            return target.iloc[0]['Name']
        
        # 4. 여전히 찾지 못했다면 로그를 남기고 코드 반환
        logger.warning(f"종목 리스트에서 코드를 찾을 수 없음: {clean_code}")
        return code 
        
    except Exception as e:
        logger.error(f"종목명 변환 실패 (Code: {code}): {e}")
        return code
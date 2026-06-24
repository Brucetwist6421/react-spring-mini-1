import pandas as pd
import requests
import FinanceDataReader as fdr
import logging
import time
import re

# 💡 실시간 전역 변수 자동 갱신을 위해 모듈 자체를 임포트합니다.
from app import config  

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
        code_match = re.search(r'\((\d{6})\)', name_str)
        if code_match:
            return code_match.group(1)

        # 2. 종목명 검색 (공백 제거 후 비교하여 정확도 향상)
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
    """KIS API 공통 헤더 생성 (실시간 토큰 부재 시 강제 발급 세이프가드 추가)"""
    
    # 💡 [핵심 세이프가드]
    # 어떤 이유로든 config.ACCESS_TOKEN이 None이거나 빈 문자열이라면
    # 요청 직전에 한국투자증권 게이트웨이에서 토큰을 실시간으로 다시 채워 넣습니다.
    if not getattr(config, 'ACCESS_TOKEN', None):
        print("[DATA_LOADER WARN] 실시간 참조 토큰이 비어있어 즉시 강제 발급을 시도합니다.")
        try:
            config.get_access_token()
            print(f"[DATA_LOADER RECOVER] 실시간 강제 발급 성공 -> {config.ACCESS_TOKEN[:10]}...")
        except Exception as e:
            logger.error(f"실시간 강제 토큰 발급 실패: {e}")

    return {
        "Content-Type": "application/json",
        "authorization": f"Bearer {config.ACCESS_TOKEN}", # 💡 config. 으로 실시간 참조
        "appkey": config.APP_KEY,                         # 💡 config. 으로 실시간 참조
        "appsecret": config.APP_SECRET,                   # 💡 config. 으로 실시간 참조
        "tr_id": tr_id,
        "custtype": "P"
    }

def get_stock_data(code, start_date):
    """시세 데이터 수집 (FinanceDataReader 사용)"""
    try:
        df = fdr.DataReader(code, start_date)
        if df.empty:
            logger.warning(f"종목코드 {code}에 대한 데이터가 없습니다.")
        return df
    except Exception as e:
        logger.error(f"FDR 데이터 로드 실패: {e}")
        return pd.DataFrame()

def get_investor_data(code):
    """KIS API: 투자자별 매매동향 (수급)"""
    # 💡 config.URL_BASE를 참조하도록 변경
    url = f"{config.URL_BASE}/uapi/domestic-stock/v1/quotations/inquire-investor"
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
    """KIS API: 주식기본조회 (모든 대소문자 변종 및 로깅 먹통 원천 방어 완료 버전)"""
    # 💡 config.URL_BASE를 참조하도록 변경
    url = f"{config.URL_BASE}/uapi/domestic-stock/v1/quotations/inquire-price"
    headers = get_kis_headers("FHKST01010100")
    params = {
        "FID_COND_MRKT_DIV_CODE": "J", 
        "FID_INPUT_ISCD": code
    }
    
    try:
        time.sleep(0.5) 
        
        res = requests.get(url, headers=headers, params=params)
        res_data = res.json()
        
        print("\n" + "="*60)
        print(f"🚨 [DATA_LOADER START] KIS API RAW RESPONSE FOR CODE: {code}")
        print(res_data)
        print("="*60 + "\n")
        
        # 1. 루트 레벨 딕셔너리의 모든 Key를 소문자로 정규화
        normalized_res = {k.lower(): v for k, v in res_data.items()}
        
        if normalized_res.get('rt_cd') != '0' and normalized_res.get('rt_cd') != '00':
            logger.warning(f"KIS API 내부 응답 실패 code({code}): {normalized_res.get('msg1')}")
            return {"per": 0.0, "pbr": 0.0, "eps": 0.0, "div": 0.0, "foreign_rt": 0.0, "change_rt": 0.0, "vol_power": 0.0}

        data = normalized_res.get('output', {})
        if not data:
            print(f"rt_cd는 0이나 'output' 데이터 바디가 비어있습니다.")
            return {"per": 0.0, "pbr": 0.0, "eps": 0.0, "div": 0.0, "foreign_rt": 0.0, "change_rt": 0.0, "vol_power": 0.0}

        # 2. output 내부 필드의 모든 Key도 소문자로 정규화
        d = {k.lower(): v for k, v in data.items()}

        def safe_float(val):
            try:
                if val is None or str(val).strip() in ["", "null", "None", "n/a"]:
                    return 0.0
                return float(val)
            except (ValueError, TypeError):
                return 0.0

        return {
            "per": safe_float(d.get('per') or d.get('perx')),          
            "pbr": safe_float(d.get('pbrx') or d.get('pbr')),         
            "eps": safe_float(d.get('eps')),          
            "div": safe_float(d.get('hry_dyd') or d.get('dyd') or d.get('lst_stkn_thst_div_tnrt')), 
            "foreign_rt": safe_float(d.get('frgn_ln_rnw_rt') or d.get('frgn_ntby_rt')), 
            "change_rt": safe_float(d.get('prdy_ctrt')),       
            "vol_power": safe_float(d.get('cldg_gskn'))        
        }
    except Exception as e:
        print(f"기본 분석 예외 발생: {str(e)}")
        logger.error(f"분석 데이터 로드 중 예외 발생 (Code: {code}): {e}")
        return {"per": 0.0, "pbr": 0.0, "eps": 0.0, "div": 0.0, "foreign_rt": 0.0, "change_rt": 0.0, "vol_power": 0.0}
    
def get_all_stocks():
    """모든 상장 종목 리스트를 반환합니다. (검색 및 자동완성용)"""
    global _stock_list_cache
    try:
        if _stock_list_cache is None:
            logger.info("전체 종목 리스트를 새로 고칭합니다...")
            _stock_list_cache = fdr.StockListing('KRX')
        
        return _stock_list_cache[['Code', 'Name']].rename(
            columns={'Code': 'code', 'Name': 'name'}
        )
    except Exception as e:
        logger.error(f"전체 종목 리스트 로드 실패: {e}")
        return pd.DataFrame(columns=['code', 'name'])

def get_name_by_code(code):
    """종목 코드를 입력받아 해당 종목명을 반환합니다."""
    global _stock_list_cache
    try:
        if _stock_list_cache is None:
            get_all_stocks()
            
        if _stock_list_cache is None or _stock_list_cache.empty:
            return code

        clean_code = str(code).strip().zfill(6)
        mask = _stock_list_cache['Code'].astype(str).str.strip() == clean_code
        target = _stock_list_cache[mask]
        
        if not target.empty:
            return target.iloc[0]['Name']
        
        logger.warning(f"종목 리스트에서 코드를 찾을 수 없음: {clean_code}")
        return code 
        
    except Exception as e:
        logger.error(f"종목명 변환 실패 (Code: {code}): {e}")
        return code
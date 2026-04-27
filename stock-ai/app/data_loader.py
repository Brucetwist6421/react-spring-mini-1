import pandas as pd
import requests
import FinanceDataReader as fdr
import logging
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
    기본 30일 조회를 4회 반복하여 약 120일(6개월 내외) 데이터를 확보합니다.
    """
    url = f"{URL_BASE}/uapi/domestic-stock/v1/quotations/inquire-investor"
    headers = get_kis_headers("FHKST01010900")
    
    all_data = []
    last_date = ""  # 다음 조회를 위한 기준 날짜

    try:
        # 4회 반복 조회 (한 번에 30일씩, 총 약 120거래일)
        for i in range(4):
            params = {
                "FID_COND_MRKT_DIV_CODE": "J",
                "FID_INPUT_ISCD": code,
                "FID_INPUT_DATE_1": last_date  # 빈 값일 경우 최신 데이터부터 조회
            }
            
            res = requests.get(url, headers=headers, params=params)
            data = res.json()
            
            if data.get('rt_cd') == '0' and data.get('output'):
                output = data['output']
                all_data.extend(output)
                
                # 다음 루프를 위해 응답 데이터의 마지막 날짜 저장 (연속 조회)
                last_date = output[-1]['stck_bsop_date']
                
                # 가져온 데이터가 30개 미만이면 더 이상 데이터가 없는 것이므로 중단
                if len(output) < 30:
                    break
            else:
                logger.warning(f"수급 데이터 {i+1}회차 조회 실패: {data.get('msg1')}")
                break

        if not all_data:
            return pd.DataFrame()

        # 데이터프레임 변환 및 정제
        df = pd.DataFrame(all_data)
        # 중복된 날짜 제거
        df = df.drop_duplicates(subset=['stck_bsop_date'])
        
        df['날짜'] = pd.to_datetime(df['stck_bsop_date'])
        df.set_index('날짜', inplace=True)
        
        # 필요한 컬럼만 추출 및 수치형 변환 (순매수 수량 기준)
        res_df = df[['prsn_ntby_qty', 'orgn_ntby_qty', 'frgn_ntby_qty']].apply(pd.to_numeric)
        res_df.columns = ['개인', '기관합계', '외국인']
        
        # 날짜 오름차순 정렬
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
        res = requests.get(url, headers=headers, params=params)
        data = res.json().get('output', {})
        
        # KIS API에서 제공하는 주요 지표 매핑
        return {
            "PER": float(data.get('per', 0)) if data.get('per') else 0,
            "PBR": float(data.get('pbr', 0)) if data.get('pbr') else 0,
            "EPS": float(data.get('eps', 0)) if data.get('eps') else 0,
            "DIV": float(data.get('pbr', 0)) # 필요 시 배당수익률(dyd) 등으로 변경 가능
        }
    except Exception as e:
        logger.error(f"기본적 분석 데이터 로드 실패: {e}")
        return {"PER": 0, "PBR": 0, "EPS": 0, "DIV": 0}
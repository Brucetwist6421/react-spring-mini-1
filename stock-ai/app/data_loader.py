import pandas as pd
import requests
from config import APP_KEY, APP_SECRET, URL_BASE, ACCESS_TOKEN
import FinanceDataReader as fdr

def get_kis_headers(tr_id):
    return {
        "Content-Type": "application/json",
        "authorization": f"Bearer {ACCESS_TOKEN}",
        "appkey": APP_KEY,
        "appsecret": APP_SECRET,
        "tr_id": tr_id,
        "custtype": "P"
    }

def get_stock_data(code, start_date):
    """시세 데이터 (FDR 사용 - KIS보다 시계열 데이터 수집에 더 안정적임)"""
    try:
        df = fdr.DataReader(code, start_date)
        return df
    except:
        return pd.DataFrame()

def get_investor_data(code):
    """KIS API: 투자자별 매매동향 (수급)"""
    url = f"{URL_BASE}/uapi/domestic-stock/v1/quotations/inquire-investor"
    headers = get_kis_headers("FHKST01010900")
    params = {"FID_COND_MRKT_DIV_CODE": "J", "FID_INPUT_ISCD": code}
    
    res = requests.get(url, headers=headers, params=params)
    data = res.json()
    
    if data.get('rt_cd') == '0':
        df = pd.DataFrame(data['output'])
        df['날짜'] = pd.to_datetime(df['stck_bsop_date'])
        df.set_index('날짜', inplace=True)
        # 필요한 수급 데이터만 추출 및 숫자 변환
        res_df = df[['prsn_ntby_qty', 'orgn_ntby_qty', 'frgn_ntby_qty']].apply(pd.to_numeric)
        res_df.columns = ['개인', '기관합계', '외국인']
        return res_df
    return pd.DataFrame()

def get_fundamental_data(code):
    """KIS API: 주식기본조회 (PER, PBR 등)"""
    url = f"{URL_BASE}/uapi/domestic-stock/v1/quotations/inquire-price"
    headers = get_kis_headers("FHKST01010100")
    params = {"FID_COND_MRKT_DIV_CODE": "J", "FID_INPUT_ISCD": code}
    
    res = requests.get(url, headers=headers, params=params)
    data = res.json().get('output', {})
    # 필요한 지표 리턴
    return {
        "PER": float(data.get('per', 0)),
        "PBR": float(data.get('pbr', 0)),
        "EPS": float(data.get('eps', 0)),
        "DIV": float(data.get('pbr', 0)) # 배당수익률 대용 또는 추가 필요
    }
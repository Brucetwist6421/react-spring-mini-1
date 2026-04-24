# app/config.py
import os
import requests
import json
import logging
from dotenv import load_dotenv

# .env 파일의 내용을 로드합니다. (상위 폴더에 있으므로 경로 설정)
load_dotenv()

# os.environ.get을 통해 값을 가져옵니다.
APP_KEY = os.environ.get("KIS_APP_KEY")
APP_SECRET = os.environ.get("KIS_APP_SECRET")
URL_BASE = os.environ.get("KIS_URL_BASE")

ACCESS_TOKEN = None

def get_access_token():
    global ACCESS_TOKEN
    
    # 키 값이 제대로 로드되었는지 확인 (디버깅용)
    if not APP_KEY or not APP_SECRET:
        logging.error(".env 파일에서 API 키를 찾을 수 없습니다!")
        return None

    headers = {"content-type": "application/json"}
    body = {
        "grant_type": "client_credentials",
        "appkey": APP_KEY,
        "secretkey": APP_SECRET
    }
    try:
        res = requests.post(f"{URL_BASE}/oauth2/tokenP", headers=headers, data=json.dumps(body))
        ACCESS_TOKEN = res.json().get("access_token")
        return ACCESS_TOKEN
    except Exception as e:
        logging.error(f"토큰 발급 실패: {e}")
        return None
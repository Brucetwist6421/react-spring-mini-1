import os
import requests
import json
import logging
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 환경 변수 로드
APP_KEY = os.environ.get("KIS_APP_KEY")
APP_SECRET = os.environ.get("KIS_APP_SECRET")
URL_BASE = os.environ.get("KIS_URL_BASE", "https://openapi.koreainvestment.com:9443")

# 실시간 공유용 전역 변수
ACCESS_TOKEN = None

def get_access_token():
    global ACCESS_TOKEN
    
    if not APP_KEY or not APP_SECRET:
        logging.error("[.env ERROR] KIS_APP_KEY 또는 KIS_APP_SECRET이 비어있습니다!")
        return None

    url = f"{URL_BASE}/oauth2/tokenP"
    headers = {"content-type": "application/json"}
    body = {
        "grant_type": "client_credentials",
        "appkey": APP_KEY,
        "secretkey": APP_SECRET
    }
    
    try:
        res = requests.post(url, headers=headers, data=json.dumps(body))
        res_data = res.json()
        
        # 🚨 [중요 디버깅] KIS 인증 서버가 실제로 준 응답 전체를 콘솔에 출력합니다.
        print("\n" + "🔑 " * 15)
        print(f"📡 [KIS TOKEN RESPONSE]: {res_data}")
        print("🔑 " * 15 + "\n")
        
        # KIS 버전/환경에 따라 대소문자가 다를 수 있으므로 두 가지 모두 파싱 시도
        new_token = res_data.get("access_token") or res_data.get("ACCESS_TOKEN")
        
        if new_token:
            ACCESS_TOKEN = new_token  # 전역 변수에 확실하게 주입
            logging.info("KIS API Access Token 전역 갱신 완료")
            return ACCESS_TOKEN
        else:
            # 토큰 발급은 실패했는데 응답은 온 경우 (예: 상용/모의 키 불일치 등)
            error_msg = res_data.get("error_description") or res_data.get("msg1")
            logging.error(f"토큰 파싱 실패 (KIS 거절 이유): {error_msg}")
            return None
            
    except Exception as e:
        logging.error(f"토큰 발급 통신 중 예외 발생: {e}")
        return None
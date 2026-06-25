import os
import requests
import json
import logging
from dotenv import load_dotenv

load_dotenv()

APP_KEY = os.environ.get("KIS_APP_KEY")
APP_SECRET = os.environ.get("KIS_APP_SECRET")
URL_BASE = os.environ.get("KIS_URL_BASE", "https://openapi.koreainvestment.com:9443")

ACCESS_TOKEN = None

def get_access_token():
    global ACCESS_TOKEN
    
    current_key = os.environ.get("KIS_APP_KEY") or APP_KEY
    current_secret = os.environ.get("KIS_APP_SECRET") or APP_SECRET

    if not current_key or not current_secret:
        logging.error("키 누락 발생")
        return None

    url = f"{URL_BASE}/oauth2/tokenP"
    
    # 💡 명세서 규격에 맞춘 Header (charset=utf-8 명시)
    headers = {"content-type": "application/json; charset=utf-8"}
    
    # 💡 명세서 규격에 맞춘 Body (secretkey ➡️ appsecret 변경 완료)
    body = {
        "grant_type": "client_credentials",
        "appkey": current_key,
        "appsecret": current_secret
    }
    
    try:
        res = requests.post(url, headers=headers, data=json.dumps(body))
        res_data = res.json()
        
        print("\n" + "🔑 " * 15)
        print(f"📡 [KIS TOKEN RESPONSE]: {res_data}")
        print("🔑 " * 15 + "\n")
        
        new_token = res_data.get("access_token") or res_data.get("ACCESS_TOKEN")
        
        if new_token:
            ACCESS_TOKEN = new_token
            logging.info("✅ KIS API Access Token 전역 변수 갱신 완료!")
            return ACCESS_TOKEN
        else:
            return None
            
    except Exception as e:
        logging.error(f"예외 발생: {e}")
        return None
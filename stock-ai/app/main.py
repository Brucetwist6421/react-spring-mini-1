from fastapi import FastAPI, logger
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime, timedelta
import pandas_ta as ta
import config
import data_loader as dl
import predictor as pt

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# 시작 시 토큰 발급
config.get_access_token()

@app.get("/stock/{code}")
async def get_stock_prediction(code: str, period: str = "2y", predict_days: int = 15):
    try:
        pure_code = code.split('.')[0]
        start_date = (datetime.now() - timedelta(days=365*2)).strftime('%Y-%m-%d')

        # 1. 시세 및 수급 데이터 로드
        df_stock = dl.get_stock_data(pure_code, start_date)
        df_investors = dl.get_investor_data(pure_code)
        fund_info = dl.get_fundamental_data(pure_code)

        # 2. 예측 로직 실행
        forecast = pt.predict_stock(df_stock, predict_days)

        # 3. 데이터 가공 및 응답 (기존 Java StockVO 구조 유지)
        req_period = period.lower().replace("o", "")
        display_days = {"1m": 22, "3m": 66, "6m": 132, "1y": 252, "2y": 504}.get(req_period, 252)
        plot_df = df_stock.tail(display_days)

        def to_map(series):
            return {d.strftime('%Y-%m-%d'): round(float(v), 2) for d, v in zip(series.index, series)}

        return {
            "symbol": code,
            "industry_status": "HANSUNG'S TRI-CORE 공식 API 엔진 가동 중",
            "history": to_map(plot_df['Close']),
            "prediction": {d.strftime('%Y-%m-%d'): round(v, 2) for d, v in zip(forecast['ds'], forecast['yhat'])},
            "investors": {
                "dates": [d.strftime('%Y-%m-%d') for d in plot_df.index],
                "foreign": [int(df_investors.loc[d, '외국인']) if d in df_investors.index else 0 for d in plot_df.index],
                "institution": [int(df_investors.loc[d, '기관합계']) if d in df_investors.index else 0 for d in plot_df.index]
            },
            "fundamental": fund_info
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
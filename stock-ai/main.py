import yfinance as yf
from fastapi import FastAPI

app = FastAPI()

@app.get("/stock/{code}")
def get_stock_data(code: str):
    # 한국 종목은 뒤에 .KS(코스피) 또는 .KQ(코스닥)를 붙여야 합니다.
    # 예: 삼성전자 005930 -> 005930.KS
    ticker = f"{code}.KS" 
    stock = yf.Ticker(ticker)
    
    # 최근 5일치 종가 데이터 가져오기
    hist = stock.history(period="5d")
    
    return {
        "symbol": code,
        "history": hist['Close'].to_dict()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
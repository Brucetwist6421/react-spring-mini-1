import numpy as np

# [필독] Prophet 심폐소생술: NumPy 2.x 호환성 패치
if not hasattr(np, "float_"):
    np.float_ = np.float64
if not hasattr(np, "int_"):
    np.int_ = np.int64
if not hasattr(np, "bool_"):
    np.bool_ = bool

import yfinance as yf
from fastapi import FastAPI
from prophet import Prophet
import pandas as pd
import pandas_ta as ta
import logging
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import datetime
from pykrx import stock

# 로그 설정: pykrx 내부 로그 에러 방지를 위해 기본 로깅 레벨 조정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/stock/{code}")
async def get_stock_prediction(code: str, period: str = "2y", predict_days: int = 15):
    events = {}
    
    try:
        # 1. 종목 코드 처리
        ticker_symbol = f"{code}.KS" if not code.endswith((".KS", ".KQ")) else code
        
        # 2. 데이터 수집
        raw_data = yf.download([ticker_symbol, "^KS11", "^SOX", "^IXIC", "USDKRW=X"], period="5y")

        if raw_data.empty:
            return {"error": "데이터를 가져올 수 없습니다."}

        close_data = raw_data['Close']
        volume_data = raw_data['Volume'][ticker_symbol]

        if ticker_symbol not in close_data or close_data[ticker_symbol].dropna().empty:
            return {"error": "해당 종목의 유효한 데이터가 없습니다."}

        # 데이터를 구성하고 NaN 처리 개선: 'y' (종목 종가)를 기준으로 NaN 제거
        # KOSPI, SOX, NASDAQ, EXCHANGE, Volume은 ffill/bfill로 채우고,
        # 그래도 남는 NaN은 제거하거나 0 처리
        df = pd.DataFrame({
            'y': close_data[ticker_symbol],
            'Volume': volume_data,
            'KOSPI': close_data['^KS11'],
            'SOX': close_data['^SOX'],
            'NASDAQ': close_data['^IXIC'],
            'EXCHANGE': close_data['USDKRW=X']
        })
        for col_to_fill in ['KOSPI', 'SOX', 'NASDAQ', 'EXCHANGE']:
            df[col_to_fill] = df[col_to_fill].ffill().bfill()
        df['Volume'] = df['Volume'].ffill().bfill().fillna(0) # Volume may legitimately be 0
        df = df.dropna(subset=['y']) # 핵심 종가 데이터가 없는 행만 제거

        # 3. 기술적 지표 생성
        df['SOX_Trend'] = df['SOX'].rolling(window=200).mean()
        df['RSI'] = ta.rsi(df['y'], length=14)
        macd = ta.macd(df['y'])
        df['MACD'] = macd.iloc[:, 0] if macd is not None else 0
        df['MA20'] = ta.sma(df['y'], length=20)

        df_clean = df.dropna()

        # 4. Prophet 학습 데이터 구성
        df_p = df_clean.reset_index().rename(columns={'Date': 'ds'})
        df_p['ds'] = df_p['ds'].dt.tz_localize(None)
        
        # 5. 모델 설정 및 학습
        model = Prophet(
            daily_seasonality=False,
            weekly_seasonality=True,
            yearly_seasonality=True,
            changepoint_prior_scale=0.05
        )

        regressors = ['KOSPI', 'SOX', 'SOX_Trend', 'NASDAQ', 'EXCHANGE', 'RSI', 'MACD']
        for col in regressors:
            model.add_regressor(col)

        model.fit(df_p)

        # 6. 미래 예측
        future = model.make_future_dataframe(periods=predict_days, freq='B')
        for col in regressors:
            last_val = df_p[col].iloc[-1]
            mean_val = df_p[col].tail(252).mean()
            future_vals = []
            current = last_val
            for _ in range(predict_days):
                current = current * 0.8 + mean_val * 0.2
                future_vals.append(current)
            future[col] = list(df_p[col]) + future_vals

        forecast = model.predict(future)

        # 7. 결과 데이터 정제
        # 기간 설정 확장 (1m, 3m, 6m 추가)
        display_days = {
            "1m": 21, 
            "3m": 63, 
            "6m": 126, 
            "1y": 252, 
            "2y": 504, 
            "5y": 1260
        }.get(period, 252)
        
        # plot_df는 df_clean(지표 계산 및 NaN 제거된 최종 데이터)에서 잘라야 함
        plot_df = df_clean.tail(display_days) # <-- **PERIOD ISSUE FIX**

        def clean_val(v, default=0):
            if pd.isna(v) or np.isinf(v): return default
            return round(float(v), 2)


        history = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['y'])}
        history_volume = {d.strftime('%Y-%m-%d'): int(v) if not pd.isna(v) else 0 for d, v in zip(plot_df.index, plot_df['Volume'])}
        history_rsi = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['RSI'])}
        history_ma20 = {d.strftime('%Y-%m-%d'): clean_val(v) for d, v in zip(plot_df.index, plot_df['MA20'])}

        prediction = {}
        last_date = df_p['ds'].max()
        future_forecast = forecast[forecast['ds'] > last_date]
        for _, row in future_forecast.iterrows():
            prediction[row['ds'].strftime('%Y-%m-%d')] = clean_val(row['yhat'])

        total = {**history, **prediction}
        total = dict(sorted(total.items()))

        # 8. 보완된 투자자 수급 데이터 수집 (pykrx) # <-- **INVESTOR DATA FIX**
        inv_dates, inv_foreign, inv_institution = [], [], []
        try:
            pure_code = code.split('.')[0]
            # plot_df.index를 날짜(date) 객체로 변환하여 시간대와 시간 정보 제거
            plot_dates_for_matching = [d.date() for d in plot_df.index.tz_localize(None)]
            
            s_date_str = plot_dates_for_matching[0].strftime('%Y%m%d') if plot_dates_for_matching else None
            e_date_str = plot_dates_for_matching[-1].strftime('%Y%m%d') if plot_dates_for_matching else None

            if s_date_str and e_date_str:
                investor_raw_df = stock.get_market_net_purchases_of_equities_by_date(s_date_str, e_date_str, pure_code)
            else:
                raise ValueError("Plot dates are empty for investor data fetching.")

            if not investor_raw_df.empty:
                # pykrx 데이터의 인덱스도 날짜(date) 객체로 변환
                investor_raw_df.index = pd.to_datetime(investor_raw_df.index).date
                
                # plot_dates_for_matching의 각 날짜에 대해 수급 데이터 매칭
                for plot_date in plot_dates_for_matching:
                    inv_dates.append(plot_date.strftime('%Y-%m-%d'))
                    if plot_date in investor_raw_df.index:
                        # 해당 날짜의 외국인/기관 데이터 추가
                        inv_foreign.append(int(investor_raw_df.loc[plot_date, '외국인']))
                        inv_institution.append(int(investor_raw_df.loc[plot_date, '기관합계']))
                    else:
                        # 해당 날짜에 데이터가 없으면 0으로 채움
                        inv_foreign.append(0)
                        inv_institution.append(0)
            else:
                raise ValueError("No data returned from pykrx for the specified date range.")
        except Exception as e:
            logger.warning(f"투자자 데이터 수집 실패: {e}")
            # 실패 시 plot_df의 날짜만큼 0으로 채워 반환 (클라이언트 오류 방지)
            inv_dates = [d.strftime('%Y-%m-%d') for d in plot_df.index]
            inv_foreign = [0] * len(inv_dates)
            inv_institution = [0] * len(inv_dates)


        # 9. 이벤트 데이터
        try:
            ticker_info = yf.Ticker(ticker_symbol)
            calendar = ticker_info.calendar
            if calendar is not None and not calendar.empty:
                if 'Earnings Date' in calendar.index:
                    e_dates = calendar.loc['Earnings Date']
                    if isinstance(e_dates, (pd.Series, list)):
                        for ed in e_dates: events[ed.strftime('%Y-%m-%d')] = "실적 발표 예정"
                    else:
                        events[e_dates.strftime('%Y-%m-%d')] = "실적 발표 예정"
            if not events: events["2026-04-15"] = "실적 발표 시즌"
        except Exception:
            events = {"2026-04-15": "정보 업데이트 예정"}

        return {
            "symbol": code,
            "industry_status": "HANSUNG'S TRI-CORE 분석 완료",
            "total": total,
            "history": history,
            "prediction": prediction,
            "volume": history_volume,
            "indicators": {"rsi": history_rsi, "ma20": history_ma20},
            "investors": {"dates": inv_dates, "foreign": inv_foreign, "institution": inv_institution},
            "events": events
        }

    except Exception as e:
        logger.error(f"주요 에러 발생: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

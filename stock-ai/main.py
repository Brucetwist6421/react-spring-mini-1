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
        }).dropna(subset=['y']) # 핵심 종가 데이터가 없는 행만 제거

        # Fill NaNs for other columns after initial 'y' drop
        for col_to_fill in ['KOSPI', 'SOX', 'NASDAQ', 'EXCHANGE']:
            df[col_to_fill] = df[col_to_fill].ffill().bfill()
        df['Volume'] = df['Volume'].ffill().bfill().fillna(0) # Volume may legitimately be 0

        # 3. 기술적 지표 생성
        df['SOX_Trend'] = df['SOX'].rolling(window=200).mean()
        df['RSI'] = ta.rsi(df['y'], length=14)
        macd = ta.macd(df['y'])
        df['MACD'] = macd.iloc[:, 0] if macd is not None else 0
        df['MA20'] = ta.sma(df['y'], length=20)

        # df_clean은 Prophet 학습용으로, 모든 NaN 제거
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
        # 사용자가 선택한 period에 따른 실제 영업일수 계산 (대략적)
        display_days = {
            "1m": 22, 
            "3m": 66, 
            "6m": 132, 
            "1y": 252, 
            "2y": 504, 
            "5y": 1260
        }.get(period, 252)

        # 핵심 지표가 계산된 데이터프레임에서 NaN을 제거한 유효 데이터 확보
        # RSI, MA20 등은 앞부분에 NaN이 생기므로 이를 제거해야 그래프가 깨지지 않음
        valid_df = df.dropna(subset=['y', 'RSI', 'MA20'])
        
        # [수정 포인트] tail()만 쓰지 않고 명확하게 display_days만큼 슬라이싱
        plot_df = valid_df.tail(display_days)

        # 만약 가져온 데이터가 요청한 기간보다 적다면 로그 출력 (디버깅용)
        logger.info(f"Requested period: {period}, Actual points: {len(plot_df)}")

        def clean_val(v, default=0):
            if pd.isna(v) or np.isinf(v): return default
            return round(float(v), 2)

        # history 데이터 생성 (이 plot_df를 기준으로 8번 수급 데이터도 연동됨)
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

        # 8. 보완된 투자자 수급 데이터 수집 (최종 수정본)
        inv_dates, inv_foreign, inv_institution = [], [], []
        try:
            pure_code = code.split('.')[0]
            # 1. 날짜 리스트 준비 (시간대 제거 및 문자열화)
            naive_indices = plot_df.index.tz_localize(None)
            s_date = naive_indices[0].strftime('%Y%m%d')
            e_date = naive_indices[-1].strftime('%Y%m%d')

            # 2. pykrx의 가장 안정적인 함수 사용 (일자별 순매수량)
            # get_market_net_purchases_of_equities_by_ticker는 해당 기간 "합계"를 줄 가능성이 높으므로
            # 일자별 데이터인 get_market_net_purchases_of_equities_by_date를 사용하되 컬럼명을 유연하게 처리합니다.
            investor_df = stock.get_market_net_purchases_of_equities_by_date(s_date, e_date, pure_code)

            if not investor_df.empty:
                # pykrx 결과의 인덱스를 문자열(YYYY-MM-DD)로 변환하여 맵 생성
                # 컬럼명이 '외국인', '기관합계' 인지 확인 (버전마다 다를 수 있음)
                f_col = '외국인' if '외국인' in investor_df.columns else investor_df.columns[0]
                i_col = '기관합계' if '기관합계' in investor_df.columns else investor_df.columns[1]
                
                res_map = investor_df.to_dict('index')
                # Timestamp 키를 문자열 키로 변환
                res_map = {k.strftime('%Y-%m-%d'): v for k, v in res_map.items()}

                for d in naive_indices:
                    d_str = d.strftime('%Y-%m-%d')
                    inv_dates.append(d_str)
                    
                    if d_str in res_map:
                        inv_foreign.append(int(res_map[d_str].get(f_col, 0)))
                        inv_institution.append(int(res_map[d_str].get(i_col, 0)))
                    else:
                        inv_foreign.append(0)
                        inv_institution.append(0)
            else:
                raise ValueError("수급 데이터 없음")

        except Exception as e:
            logger.warning(f"Investor data fetch failed: {e}")
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

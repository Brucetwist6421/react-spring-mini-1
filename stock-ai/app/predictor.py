import numpy as np
from prophet import Prophet
import pandas as pd

# NumPy 2.x 패치 (이제 1.26.4로 고정했다면 이 부분은 없어도 무방하지만 유지해도 안전합니다)
for attr, target in [("float_", np.float64), ("int_", np.int64), ("bool_", bool)]:
    if not hasattr(np, attr): setattr(np, attr, target)

def predict_stock(df, days):
    """Prophet 예측 실행"""
    # 1. 데이터 전처리 (ds, y 컬럼명 맞추기)
    pdf = df.reset_index()[['Date', 'Close']].rename(columns={'Date':'ds', 'Close':'y'})
    
    # 2. 모델 설정 및 학습
    model = Prophet(daily_seasonality=True, changepoint_prior_scale=0.05)
    model.fit(pdf)
    
    # 3. 미래 날짜 생성 (학습 데이터 마지막 날 + days)
    future = model.make_future_dataframe(periods=days, freq='B')
    
    # 4. 예측 실행
    forecast = model.predict(future)
    
    # [핵심 수정] 전체 데이터 중 마지막 'days'만큼만 슬라이싱하여 반환
    # 이렇게 하면 과거 학습 구간은 제외되고 실제 예측된 미래 데이터만 리턴됩니다.
    return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(days)
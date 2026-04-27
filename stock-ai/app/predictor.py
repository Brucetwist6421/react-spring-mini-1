import numpy as np
from prophet import Prophet
import pandas as pd

# NumPy 2.x 패치 (이제 1.26.4로 고정했다면 이 부분은 없어도 무방하지만 유지해도 안전합니다)
for attr, target in [("float_", np.float64), ("int_", np.int64), ("bool_", bool)]:
    if not hasattr(np, attr): setattr(np, attr, target)

def predict_stock(df, days):
    """Prophet 예측 실행 - 변동성 강화 버전"""
    pdf = df.reset_index()[['Date', 'Close']].rename(columns={'Date':'ds', 'Close':'y'})
    
    # 1. 모델 설정 최적화
    model = Prophet(
        daily_seasonality=True,
        weekly_seasonality=True,
        yearly_seasonality=True,
        # 추세 변화 민감도 (높을수록 예측선이 구불구불해짐)
        changepoint_prior_scale=0.5, 
        # 계절성 반영 강도
        seasonality_prior_scale=10.0,
        # 가법(additive) 모델 대신 승법(multiplicative) 모델 고려 가능
        seasonality_mode='multiplicative' 
    )
    
    model.fit(pdf)
    
    # 2. 미래 날짜 생성 (평일 기준)
    future = model.make_future_dataframe(periods=days, freq='B')
    
    # 3. 예측 실행
    forecast = model.predict(future)
    
    return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(days)
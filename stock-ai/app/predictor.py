import numpy as np
from prophet import Prophet
import pandas as pd

# NumPy 2.x 패치
for attr, target in [("float_", np.float64), ("int_", np.int64), ("bool_", bool)]:
    if not hasattr(np, attr): setattr(np, attr, target)

def predict_stock(df, days):
    """Prophet 예측 실행"""
    pdf = df.reset_index()[['Date', 'Close']].rename(columns={'Date':'ds', 'Close':'y'})
    model = Prophet(daily_seasonality=True, changepoint_prior_scale=0.05)
    model.fit(pdf)
    
    future = model.make_future_dataframe(periods=days)
    forecast = model.predict(future)
    
    return forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
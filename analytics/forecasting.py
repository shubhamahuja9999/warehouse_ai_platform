from sklearn.linear_model import LinearRegression
import pandas as pd
import numpy as np

def demand_forecast(order_df):

    daily = order_df.groupby("date").size().reset_index(name="orders")

    daily["date"] = pd.to_datetime(daily["date"])

    daily["day_index"] = np.arange(len(daily))

    X = daily[["day_index"]]
    y = daily["orders"]

    model = LinearRegression()

    model.fit(X,y)

    future = np.array([[len(daily)+7]])

    prediction = model.predict(future)

    return prediction[0]
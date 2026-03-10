import pandas as pd

def return_rate(orders, returns):

    order_count = orders.groupby("sku").size().reset_index(name="orders")

    return_count = returns.groupby("sku").size().reset_index(name="returns")

    merged = pd.merge(order_count, return_count, on="sku", how="left")

    merged["returns"] = merged["returns"].fillna(0)

    merged["return_rate"] = merged["returns"] / merged["orders"]

    return merged.sort_values("return_rate", ascending=False)
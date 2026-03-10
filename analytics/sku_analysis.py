import pandas as pd

def sku_frequency(order_df):

    freq = order_df["sku"].value_counts().reset_index()
    freq = freq.rename(columns={"sku": "sku", "count": "orders"})

    return freq


def slow_skus(order_df):

    freq = order_df["sku"].value_counts().reset_index()
    freq = freq.rename(columns={"sku": "sku", "count": "orders"})

    return freq.tail(20)
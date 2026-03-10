import pandas as pd

def zone_activity(order_df):

    zone_counts = order_df.groupby("zone").size().reset_index(name="picks")

    return zone_counts
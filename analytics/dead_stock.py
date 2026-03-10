import pandas as pd

def detect_dead_stock(inventory_df):

    inventory_df["last_sold_date"] = pd.to_datetime(inventory_df["last_sold_date"], utc=False, errors="coerce")

    # Ensure timezone-naive so subtraction doesn't raise TypeError
    if inventory_df["last_sold_date"].dt.tz is not None:
        inventory_df["last_sold_date"] = inventory_df["last_sold_date"].dt.tz_localize(None)

    today = pd.Timestamp.now().normalize()

    inventory_df["days_since_sale"] = (today - inventory_df["last_sold_date"]).dt.days

    dead = inventory_df[inventory_df["days_since_sale"] > 90]

    return dead[["sku", "stock", "days_since_sale"]]
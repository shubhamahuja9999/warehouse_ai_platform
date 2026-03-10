import streamlit as st
import pandas as pd

from core.data_loader import load_data

from analytics.sku_analysis import sku_frequency, slow_skus
from analytics.dead_stock import detect_dead_stock
from analytics.return_analysis import return_rate
from analytics.slotting import slotting_recommendation
from analytics.forecasting import demand_forecast
from analytics.heatmap import zone_activity

from ui.dashboard import show_top_skus, show_dead_stock, show_returns

st.set_page_config(page_title="Warehouse Intelligence", layout="wide")

st.title("📦 Warehouse Intelligence Platform")

st.sidebar.header("Upload Warehouse Data")

orders_file = st.sidebar.file_uploader("Upload Orders CSV")
inventory_file = st.sidebar.file_uploader("Upload Inventory CSV")
returns_file = st.sidebar.file_uploader("Upload Returns CSV")

if orders_file:

    orders = load_data(orders_file)

    st.header("SKU Analytics")

    sku_freq = sku_frequency(orders)

    show_top_skus(sku_freq)

    st.header("Slow Moving SKUs")

    slow = slow_skus(orders)

    st.dataframe(slow)

    st.header("Slotting Recommendation")

    slotting = slotting_recommendation(orders)

    st.dataframe(slotting.head(20))

    st.header("Demand Forecast")

    forecast = demand_forecast(orders)

    st.metric("Predicted Orders Next Week", int(forecast))

    if "zone" in orders.columns:

        st.header("Warehouse Zone Activity")

        zone = zone_activity(orders)

        st.bar_chart(zone.set_index("zone"))

if inventory_file:

    inventory = load_data(inventory_file)

    st.header("Dead Stock")

    dead = detect_dead_stock(inventory)

    show_dead_stock(dead)

if returns_file and orders_file:

    returns = load_data(returns_file)

    st.header("Return Risk")

    risk = return_rate(orders,returns)

    show_returns(risk)
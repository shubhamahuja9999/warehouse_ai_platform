import plotly.express as px
import streamlit as st

def show_top_skus(df):

    fig = px.bar(
        df.head(20),
        x="sku",
        y="orders",
        title="Top Selling SKUs",
        color="orders"
    )

    st.plotly_chart(fig)


def show_dead_stock(df):

    fig = px.bar(
        df,
        x="sku",
        y="days_since_sale",
        title="Dead Stock"
    )

    st.plotly_chart(fig)


def show_returns(df):

    fig = px.bar(
        df.head(20),
        x="sku",
        y="return_rate",
        title="Return Risk SKUs"
    )

    st.plotly_chart(fig)
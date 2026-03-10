import sys
import os
import io
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pandas as pd
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from core.data_loader import load_data
from analytics.sku_analysis import sku_frequency, slow_skus
from analytics.dead_stock import detect_dead_stock
from analytics.return_analysis import return_rate
from analytics.slotting import slotting_recommendation
from analytics.forecasting import demand_forecast
from analytics.heatmap import zone_activity

from backend.database import init_db, seed_showrooms, get_showroom_by_username, save_showroom_data, get_showroom_data
from backend.auth import hash_password, verify_password, create_access_token, get_current_showroom

# ── Bootstrap DB on startup ────────────────────────────────────────────────────
init_db()
seed_showrooms(hash_password)

app = FastAPI(title="Warehouse Intelligence API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ────────────────────────────────────────────────────────────────────
def read_csv(file: UploadFile) -> pd.DataFrame:
    contents = file.file.read()
    return pd.read_csv(io.BytesIO(contents))


# ── Auth endpoints ─────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/auth/login")
def login(req: LoginRequest):
    showroom = get_showroom_by_username(req.username)
    if not showroom or not verify_password(req.password, showroom["password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token(showroom["id"], showroom["username"], showroom["name"])
    return {
        "access_token":  token,
        "token_type":    "bearer",
        "showroom_name": showroom["name"],
        "showroom_id":   showroom["id"],
    }


@app.get("/auth/me")
def me(current=Depends(get_current_showroom)):
    return current


# ── Dashboard — load persisted data ───────────────────────────────────────────
@app.get("/api/dashboard")
def dashboard(current=Depends(get_current_showroom)):
    raw = get_showroom_data(current["id"])
    result = {}
    for data_type, blob in raw.items():
        result[data_type] = {
            "data":        json.loads(blob["data"]),
            "uploaded_at": blob["uploaded_at"],
        }
    return result


# ── Orders ─────────────────────────────────────────────────────────────────────
@app.post("/api/orders")
async def analyze_orders(
    file: UploadFile = File(...),
    current=Depends(get_current_showroom),
):
    try:
        orders = read_csv(file)

        sku_freq = sku_frequency(orders)
        slow     = slow_skus(orders)
        slotting = slotting_recommendation(orders)
        forecast = demand_forecast(orders)

        result = {
            "sku_frequency": sku_freq.head(20).to_dict(orient="records"),
            "slow_skus":     slow.to_dict(orient="records"),
            "slotting":      slotting.head(20).to_dict(orient="records"),
            "forecast":      round(float(forecast), 1),
            "total_orders":  len(orders),
            "unique_skus":   int(orders["sku"].nunique()),
        }

        if "zone" in orders.columns:
            result["zone_activity"] = zone_activity(orders).to_dict(orient="records")

        save_showroom_data(current["id"], "orders", json.dumps(result))
        return result

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Inventory ──────────────────────────────────────────────────────────────────
@app.post("/api/inventory")
async def analyze_inventory(
    file: UploadFile = File(...),
    current=Depends(get_current_showroom),
):
    try:
        inventory = read_csv(file)
        dead = detect_dead_stock(inventory)

        result = {
            "dead_stock":       dead.to_dict(orient="records"),
            "dead_stock_count": len(dead),
            "total_skus":       len(inventory),
        }
        save_showroom_data(current["id"], "inventory", json.dumps(result))
        return result

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Returns ────────────────────────────────────────────────────────────────────
@app.post("/api/returns")
async def analyze_returns(
    orders_file:  UploadFile = File(...),
    returns_file: UploadFile = File(...),
    current=Depends(get_current_showroom),
):
    try:
        orders  = read_csv(orders_file)
        returns = read_csv(returns_file)
        risk    = return_rate(orders, returns)

        result = {
            "return_risk":     risk.head(20).to_dict(orient="records"),
            "avg_return_rate": round(float(risk["return_rate"].mean()), 4),
        }
        save_showroom_data(current["id"], "returns", json.dumps(result))
        return result

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ── Health ─────────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok"}

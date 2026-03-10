import json
import os
import bcrypt
from datetime import datetime

DEMO_SHOWROOMS = {
    "downtown": {"id": 1, "name": "Downtown Showroom", "username": "downtown", "password": bcrypt.hashpw(b"pass123", bcrypt.gensalt()).decode()},
    "north": {"id": 2, "name": "North Wing", "username": "north", "password": bcrypt.hashpw(b"pass123", bcrypt.gensalt()).decode()},
    "east": {"id": 3, "name": "East Branch", "username": "east", "password": bcrypt.hashpw(b"pass123", bcrypt.gensalt()).decode()},
}

DATA_STORE = {}

def init_db():
    pass

def seed_showrooms(hash_fn):
    pass

def get_showroom_by_username(username: str):
    return DEMO_SHOWROOMS.get(username)

def save_showroom_data(showroom_id: int, data_type: str, json_blob: str):
    key = f"showroom_{showroom_id}"
    if key not in DATA_STORE:
        DATA_STORE[key] = {}
    DATA_STORE[key][data_type] = {
        "data": json_blob,
        "uploaded_at": datetime.now().isoformat()
    }

def get_showroom_data(showroom_id: int):
    key = f"showroom_{showroom_id}"
    return DATA_STORE.get(key, {})

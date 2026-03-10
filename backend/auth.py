import os
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

SECRET_KEY = os.getenv("WAREHOUSE_SECRET", "warehouse-ai-super-secret-key-2024")
ALGORITHM  = "HS256"
TOKEN_TTL  = 24  # hours

bearer = HTTPBearer()


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def create_access_token(showroom_id: int, username: str, name: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(hours=TOKEN_TTL)
    payload = {
        "sub":      str(showroom_id),
        "username": username,
        "name":     name,
        "exp":      expire,
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        return {}


async def get_current_showroom(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
) -> dict:
    payload = decode_token(creds.credentials)
    if not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        "id":       int(payload["sub"]),
        "username": payload["username"],
        "name":     payload["name"],
    }

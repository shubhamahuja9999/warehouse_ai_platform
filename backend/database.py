import sqlite3
import os
from contextlib import contextmanager

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "warehouse.db")


@contextmanager
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    with get_db() as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS showrooms (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name        TEXT    NOT NULL,
                username    TEXT    NOT NULL UNIQUE,
                password    TEXT    NOT NULL,
                created_at  TEXT    DEFAULT (datetime('now'))
            );

            CREATE TABLE IF NOT EXISTS showroom_data (
                id           INTEGER PRIMARY KEY AUTOINCREMENT,
                showroom_id  INTEGER NOT NULL REFERENCES showrooms(id),
                data_type    TEXT    NOT NULL,
                json_blob    TEXT    NOT NULL,
                uploaded_at  TEXT    DEFAULT (datetime('now')),
                UNIQUE(showroom_id, data_type)
            );
        """)


def seed_showrooms(hash_fn):
    """Insert demo showrooms if they don't exist yet."""
    demos = [
        ("Downtown Showroom", "downtown", "pass123"),
        ("North Wing",        "north",    "pass123"),
        ("East Branch",       "east",     "pass123"),
    ]
    with get_db() as conn:
        for name, uname, pwd in demos:
            exists = conn.execute(
                "SELECT id FROM showrooms WHERE username = ?", (uname,)
            ).fetchone()
            if not exists:
                conn.execute(
                    "INSERT INTO showrooms (name, username, password) VALUES (?,?,?)",
                    (name, uname, hash_fn(pwd)),
                )


def get_showroom_by_username(username: str):
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM showrooms WHERE username = ?", (username,)
        ).fetchone()
        return dict(row) if row else None


def save_showroom_data(showroom_id: int, data_type: str, json_blob: str):
    with get_db() as conn:
        conn.execute(
            """INSERT INTO showroom_data (showroom_id, data_type, json_blob)
               VALUES (?, ?, ?)
               ON CONFLICT(showroom_id, data_type) DO UPDATE SET
                   json_blob   = excluded.json_blob,
                   uploaded_at = datetime('now')
            """,
            (showroom_id, data_type, json_blob),
        )


def get_showroom_data(showroom_id: int):
    with get_db() as conn:
        rows = conn.execute(
            "SELECT data_type, json_blob, uploaded_at FROM showroom_data WHERE showroom_id = ?",
            (showroom_id,),
        ).fetchall()
        return {r["data_type"]: {"data": r["json_blob"], "uploaded_at": r["uploaded_at"]} for r in rows}

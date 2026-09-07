"""Small CLI helper for working with the Roamly SQLite database.

Usage:
    python -m backend.db info        # tables, row counts, indexes
    python -m backend.db listings    # show listings (id, title, location, price)
    python -m backend.db bookings    # show bookings (dates + status)
    python -m backend.db reset       # drop everything and reseed 8 listings
    python -m backend.db path        # print the absolute DB path
"""
from __future__ import annotations

import os
import sys
import sqlite3
from pathlib import Path
from typing import Iterable

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = Path(os.getenv("SQLITE_DB_PATH", str(BASE_DIR / "roamly.db"))).resolve()


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def _tabulate(rows: Iterable[sqlite3.Row]) -> None:
    rows = list(rows)
    if not rows:
        print("  (no rows)")
        return
    headers = rows[0].keys()
    widths = [max(len(str(h)), max(len(str(r[h])) for r in rows)) for h in headers]
    print("  " + "  ".join(h.ljust(w) for h, w in zip(headers, widths)))
    print("  " + "  ".join("-" * w for w in widths))
    for r in rows:
        print("  " + "  ".join(str(r[h]).ljust(w) for h, w in zip(headers, widths)))


def cmd_info() -> None:
    print(f"DB: {DB_PATH}  ({'exists' if DB_PATH.exists() else 'missing'})")
    if not DB_PATH.exists():
        return
    with _connect() as conn:
        tables = [r[0] for r in conn.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        ).fetchall()]
        for t in tables:
            count = conn.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
            print(f"  - {t}: {count} rows")


def cmd_listings() -> None:
    with _connect() as conn:
        _tabulate(conn.execute(
            "SELECT id, title, location, price, type FROM listings ORDER BY created_at DESC"
        ).fetchall())


def cmd_bookings() -> None:
    with _connect() as conn:
        _tabulate(conn.execute(
            "SELECT id, listing_id, guest_name, start_date, end_date, total, status FROM bookings"
            " ORDER BY created_at DESC"
        ).fetchall())


def cmd_path() -> None:
    print(DB_PATH)


def cmd_reset() -> None:
    # Import here so the CLI stays lightweight when the DB is intact.
    from main import initialize  # type: ignore

    if DB_PATH.exists():
        DB_PATH.unlink()
        print(f"Deleted {DB_PATH}")
    initialize()
    print("Reseeded with 8 sample listings.")


COMMANDS = {
    "info": cmd_info,
    "listings": cmd_listings,
    "bookings": cmd_bookings,
    "reset": cmd_reset,
    "path": cmd_path,
}


def main() -> None:
    args = sys.argv[1:]
    if not args or args[0] not in COMMANDS:
        print(__doc__)
        raise SystemExit(1 if args else 0)
    COMMANDS[args[0]]()


if __name__ == "__main__":
    main()

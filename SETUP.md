# Airbnb clone — Local setup

If the app looks different on your laptop vs the hosted preview, it's almost always because the **FastAPI backend isn't running** or **`FASTAPI_URL` in `frontend/.env` doesn't match the port uvicorn is bound to**. Follow this exactly.

## 1. Prerequisites

- Node.js ≥ 18 and Yarn 1.x
- Python ≥ 3.9

## 2. First-time install

```bash
cd airbnb-main

# Copy env templates
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env

# Install root + frontend deps
yarn install
yarn --cwd frontend install

# Install backend deps
python3 -m venv .venv
source .venv/bin/activate           # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
```

## 3. Run both services with ONE command

```bash
yarn dev:all
```

That command boots:

- **FastAPI** on `http://127.0.0.1:8001` (auto-seeds SQLite with 8 stays on first boot)
- **Next.js** on `http://localhost:3000` (proxies every `/api/*` request to FastAPI)

Open http://localhost:3000.

## 4. Or run them in separate terminals

```bash
# terminal 1
source .venv/bin/activate
cd backend && uvicorn main:app --host 127.0.0.1 --port 8001 --reload

# terminal 2
yarn --cwd frontend dev
# or from repo root: yarn dev
```

## Project layout

```
frontend/     → Next.js (Render Root Directory: frontend)
backend/      → FastAPI  (Render Root Directory: backend)
```

## Troubleshooting

**"It looks the same but bookings don't persist and any host listing I add disappears on refresh."**
→ FastAPI isn't reachable. The frontend silently falls back to the 8 built-in seed listings. Check:
1. Is `uvicorn` running on port `8001`? (visit http://127.0.0.1:8001/api/listings — you should get JSON)
2. Does `frontend/.env` contain `FASTAPI_URL=http://127.0.0.1:8001`?
3. Restart the frontend after editing `.env` — Next.js only reads env vars on startup.

**"The map is blank / just shows grey."**
→ Leaflet needs internet to load OpenStreetMap tiles. Check your network.

**"`sqlite3.OperationalError: unable to open database file`"**
→ The path in `backend/.env` (`SQLITE_DB_PATH=./roamly.db`) is resolved relative to the folder uvicorn is started from. Make sure you're in the `backend/` folder when running `uvicorn`, or use an absolute path.

**"Cross origin request detected" warning in the console**
→ Safe to ignore in dev. Only matters if you deploy behind a different origin.

## Stack

| Layer    | Tech                                          |
|----------|-----------------------------------------------|
| Frontend | Next.js 15 (App Router) + TypeScript (strict) |
| UI       | Tailwind CSS + shadcn primitives + lucide     |
| Map      | Leaflet + react-leaflet + OpenStreetMap tiles |
| Backend  | FastAPI + Pydantic v2                         |
| Storage  | SQLite (auto-created + seeded on first boot)  |
| Proxy    | Next.js `rewrites()` reads `FASTAPI_URL`      |

## Working with SQLite

The database lives at `backend/roamly.db` and is a single file — you can copy it, back it up, or delete it at will.

The FastAPI startup hook creates the schema and seeds 8 stays automatically. The full DDL lives in [`backend/schema.sql`](./backend/schema.sql).

A small CLI helper is included at [`backend/db.py`](./backend/db.py):

```bash
# from the backend/ folder, with your venv active

python db.py info        # tables + row counts
python db.py listings    # id, title, location, price, type
python db.py bookings    # id, listing_id, guest, dates, total, status
python db.py path        # absolute path to the .db file
python db.py reset       # delete the DB and reseed the 8 sample stays
```

**Schema at a glance**

- `listings(id, title, location, region, country, price, rating, reviews, type, guests, bedrooms, beds, baths, host, host_initials, host_color, badge, host_id, description, amenities_json, images_json, created_at)`
- `bookings(id, listing_id, listing_title, listing_image, location, guest_id, guest_name, host_id, start_date, end_date, guests, nights, subtotal, total, status, created_at)` with `FOREIGN KEY(listing_id) REFERENCES listings(id)`
- Amenities and image URLs are stored as JSON strings and expanded to arrays before they leave the API layer.
- `id` columns are UUID/string values generated in Python — SQLite `rowid` is never exposed.
- Booking overlap protection is enforced in `main.py`, not with a SQLite constraint.

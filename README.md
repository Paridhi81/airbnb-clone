# Roamly Marketplace

Roamly is a photo-forward Airbnb-inspired stay marketplace built with **Next.js (TypeScript)**, a **FastAPI** backend, and **SQLite** persistence. It includes seeded stays, browse/search/filter, listing detail, date and guest validation, mocked checkout, My Trips, favourites, a static map mode, and full host CRUD.

Live source: https://github.com/Paridhi81/airbnb

## Tech stack

- **Frontend**: Next.js 15 (App Router) with strict-mode TypeScript, Tailwind CSS, shadcn primitives, lucide-react icons
- **Backend**: Python 3 + FastAPI + Pydantic
- **Database**: SQLite (auto-created and seeded at first boot)
- **Dev orchestration**: supervisord runs both the Next.js dev server and the FastAPI process

## Features

- Responsive marketplace home with listing grid, sticky header, category rail, search bar, filters, wishlist hearts, and a static map preview
- Listing detail with photo gallery, amenities, host card, reviews, date-range picker, guest stepper, and live price breakdown
- End-to-end booking flow with overlap prevention, guest-capacity checks, persistent bookings, and a "My Trips" view
- Host dashboard with persistent create / edit / delete listings and upcoming bookings
- **MOCKED** checkout (no real payment provider is called and no card data is stored)
- **COMING SOON** dialogs for messaging, identity verification, login/signup, language/currency, Experiences, and Services

## Project layout

```
frontend/                 # Next.js app
  app/                    # App Router pages + layout
  components/roamly/      # UI components
  lib/                    # types, data, format helpers
  public/                 # static assets (logo, nav icons)
  package.json
  next.config.js          # proxies /api/* → FASTAPI_URL

backend/                  # FastAPI + SQLite
  main.py
  schema.sql
  requirements.txt

package.json              # root scripts: yarn dev:all
docker-compose.yml        # run frontend + backend together
```

## Database schema

Two SQLite tables, all `id` columns are UUID-shaped strings:

```
listings(
  id TEXT PK, title, description, location, region, country,
  price REAL, rating REAL, reviews INT, type TEXT,
  guests INT, bedrooms INT, beds INT, baths INT,
  host TEXT, host_id TEXT, host_initials TEXT, host_color TEXT,
  badge TEXT, amenities JSON, images JSON, created_at TEXT
)

bookings(
  id TEXT PK, listing_id TEXT FK, guest_id TEXT, guest_name TEXT,
  start_date TEXT, end_date TEXT, guests INT,
  nights INT, subtotal REAL, total REAL, status TEXT, created_at TEXT
)
```

## API overview

All routes are exposed under `/api/*` and are proxied from Next.js to FastAPI via the `FASTAPI_URL` env var.

| Method | Path | Purpose |
| ------ | ---- | ------- |
| GET  | `/api/listings` | Seeded listings, supports `q`, `category`, `maxPrice` filters |
| GET  | `/api/listings/:id` | Listing detail |
| POST | `/api/listings` | Create a host listing |
| PUT  | `/api/listings/:id` | Update a listing |
| DELETE | `/api/listings/:id` | Remove a listing |
| GET  | `/api/bookings?guestId=guest-demo` | Guest trips |
| POST | `/api/bookings` | Validate + create booking (blocks overlapping dates) |
| GET  | `/api/host/listings?hostId=host-demo` | Host listings + upcoming bookings |

## Run locally

**One-command setup** (see [`SETUP.md`](./SETUP.md) for a step-by-step troubleshooting guide):

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
yarn install
yarn --cwd frontend install
python3 -m venv .venv && source .venv/bin/activate
pip install -r backend/requirements.txt

yarn dev:all      # runs FastAPI (127.0.0.1:8001) + Next.js (localhost:3000)
```

Open http://localhost:3000. On first boot FastAPI creates `backend/roamly.db` and seeds 8 stays.

> **Important**: `FASTAPI_URL` in `frontend/.env` must match the port uvicorn is bound to (`8001` by default). If they mismatch, the frontend silently falls back to built-in seed data and bookings/host CRUD will not persist.

## Assumptions

- Real payment processing, live map with pricing pins, messaging, identity verification, and OAuth login are intentional **Coming Soon** or mocked flows to keep the demo self-contained.
- The demo assumes a single hard-coded guest (`guest-demo` / "Alex Morgan") and host (`host-demo`) so booking and hosting flows can be exercised without an auth layer.
- All record IDs are UUID-shaped strings; SQLite `rowid` values are never exposed to clients.

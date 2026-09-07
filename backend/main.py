import json
import os
import sqlite3
from contextlib import closing
from datetime import date
from pathlib import Path
from typing import Optional
from uuid import uuid4

from fastapi import APIRouter, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field


BASE_DIR = Path(__file__).resolve().parent
DB_PATH = os.getenv("SQLITE_DB_PATH", str(BASE_DIR / "roamly.db"))


SEED_LISTINGS = [
    {
        "id": "stay-01", "title": "Sunlit apartment with skyline views", "location": "Sector 63, Noida", "region": "Noida", "country": "India", "price": 3700, "rating": 4.92, "reviews": 86, "type": "Apartment", "guests": 4, "bedrooms": 2, "beds": 2, "baths": 2, "host": "Riya", "host_initials": "RK", "host_color": "#f9c5b7", "badge": "Guest favourite", "host_id": "seed-host", "description": "Wake up to a wide city view in this calm, design-led home with plenty of light, a chef-ready kitchen, and a dedicated work corner.", "amenities": ["Wifi", "Kitchen", "Workspace", "Air conditioning"], "images": ["https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=85"]
    },
    {
        "id": "stay-02", "title": "Warm villa tucked into a quiet garden", "location": "Chattarpur, New Delhi", "region": "New Delhi", "country": "India", "price": 5800, "rating": 4.88, "reviews": 121, "type": "Villa", "guests": 6, "bedrooms": 3, "beds": 4, "baths": 3, "host": "Arjun", "host_initials": "AS", "host_color": "#bfe2d0", "badge": "Guest favourite", "host_id": "seed-host", "description": "A leafy hideaway for slow mornings, long lunches, and evenings around the fire pit. The garden is all yours.", "amenities": ["Wifi", "Pool", "Free parking", "Kitchen"], "images": ["https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85"]
    },
    {
        "id": "stay-03", "title": "Peaceful home near Lodhi Garden", "location": "Lodhi Colony, New Delhi", "region": "New Delhi", "country": "India", "price": 4400, "rating": 4.97, "reviews": 64, "type": "Home", "guests": 3, "bedrooms": 1, "beds": 2, "baths": 1, "host": "Meera", "host_initials": "MP", "host_color": "#f5d29c", "badge": "Rare find", "host_id": "seed-host", "description": "A quiet, art-filled stay in the heart of Delhi with leafy streets, independent cafés, and the city’s best morning walks nearby.", "amenities": ["Wifi", "Kitchen", "Washer", "Patio"], "images": ["https://images.unsplash.com/photo-1641232458416-feace752b346?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=85"]
    },
    {
        "id": "stay-04", "title": "Modern retreat with a private pool", "location": "Greater Kailash, New Delhi", "region": "New Delhi", "country": "India", "price": 7200, "rating": 4.86, "reviews": 43, "type": "Villa", "guests": 8, "bedrooms": 4, "beds": 5, "baths": 4, "host": "Aarav", "host_initials": "AD", "host_color": "#c6d7f4", "badge": "Guest favourite", "host_id": "seed-host", "description": "A polished indoor-outdoor villa for celebrations and reset weekends, with a pool, terrace dining, and hotel-level comfort.", "amenities": ["Wifi", "Pool", "Hot tub", "Free parking"], "images": ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"]
    },
    {
        "id": "stay-05", "title": "The little blue door in Hauz Khas", "location": "Hauz Khas, New Delhi", "region": "New Delhi", "country": "India", "price": 3900, "rating": 4.81, "reviews": 77, "type": "Apartment", "guests": 2, "bedrooms": 1, "beds": 1, "baths": 1, "host": "Naina", "host_initials": "NS", "host_color": "#d6c2ef", "badge": "Guest favourite", "host_id": "seed-host", "description": "A tiny, colourful nest surrounded by art galleries, independent coffee, and the lake trail. Best for two.", "amenities": ["Wifi", "Kitchen", "Air conditioning", "TV"], "images": ["https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85"]
    },
    {
        "id": "stay-06", "title": "Terrace home overlooking the Aravallis", "location": "Aravalli Hills, Gurugram", "region": "Gurugram", "country": "India", "price": 6400, "rating": 4.95, "reviews": 39, "type": "Home", "guests": 5, "bedrooms": 2, "beds": 3, "baths": 2, "host": "Kabir", "host_initials": "KM", "host_color": "#f2c4c4", "badge": "Amazing views", "host_id": "seed-host", "description": "Trade the city noise for bird song and sunset skies. This warm terrace home is made for long weekends.", "amenities": ["Wifi", "Mountain view", "Breakfast", "Free parking"], "images": ["https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1200&q=85"]
    },
    {
        "id": "stay-07", "title": "A calm studio in the heart of Goa", "location": "Assagao, Goa", "region": "Goa", "country": "India", "price": 3100, "rating": 4.9, "reviews": 101, "type": "Apartment", "guests": 2, "bedrooms": 1, "beds": 1, "baths": 1, "host": "Ishita", "host_initials": "IP", "host_color": "#f6dca9", "badge": "Guest favourite", "host_id": "seed-host", "description": "A light-filled studio with a shaded veranda, close to Goa’s best bakeries and a short scooter ride from the beach.", "amenities": ["Wifi", "Pool", "Kitchen", "Garden"], "images": ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"]
    },
    {
        "id": "stay-08", "title": "Glass cabin above the cedar forest", "location": "Naukuchiatal, Uttarakhand", "region": "Uttarakhand", "country": "India", "price": 8100, "rating": 4.99, "reviews": 28, "type": "Cabin", "guests": 4, "bedrooms": 2, "beds": 2, "baths": 2, "host": "Dev", "host_initials": "DS", "host_color": "#c4dfdc", "badge": "Amazing views", "host_id": "seed-host", "description": "Sleep beside the forest in a glass-walled cabin with a fireplace, a cedar deck, and nothing but green beyond it.", "amenities": ["Wifi", "Mountain view", "Fireplace", "Kitchen"], "images": ["https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85", "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=85"]
    },
]


SCHEMA = """
CREATE TABLE IF NOT EXISTS listings (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, location TEXT NOT NULL, region TEXT,
  country TEXT, price INTEGER NOT NULL, rating REAL DEFAULT 0, reviews INTEGER DEFAULT 0,
  type TEXT NOT NULL, guests INTEGER NOT NULL, bedrooms INTEGER DEFAULT 1, beds INTEGER DEFAULT 1,
  baths INTEGER DEFAULT 1, host TEXT, host_initials TEXT, host_color TEXT, badge TEXT,
  host_id TEXT NOT NULL, description TEXT, amenities_json TEXT NOT NULL, images_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY, listing_id TEXT NOT NULL, listing_title TEXT NOT NULL,
  listing_image TEXT, location TEXT, guest_id TEXT NOT NULL, guest_name TEXT,
  host_id TEXT NOT NULL, start_date TEXT NOT NULL, end_date TEXT NOT NULL,
  guests INTEGER NOT NULL, nights INTEGER NOT NULL, subtotal INTEGER NOT NULL,
  total INTEGER NOT NULL, status TEXT NOT NULL, created_at TEXT NOT NULL,
  FOREIGN KEY(listing_id) REFERENCES listings(id)
);
"""


class ListingCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: str = Field(min_length=1)
    location: str = Field(min_length=1)
    price: int = Field(gt=0)
    type: str = "Home"
    guests: int = Field(default=2, gt=0)
    bedrooms: int = Field(default=1, gt=0)
    beds: int = Field(default=1, gt=0)
    baths: int = Field(default=1, gt=0)
    description: str = ""
    amenities: list[str] = Field(default_factory=lambda: ["Wifi", "Kitchen"])
    images: list[str] = Field(default_factory=list)
    host: str = "You"
    host_id: str = Field(default="host-demo", alias="hostId")
    region: str = ""
    country: str = "India"


class ListingUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    title: Optional[str] = None
    location: Optional[str] = None
    price: Optional[int] = Field(default=None, gt=0)
    type: Optional[str] = None
    guests: Optional[int] = Field(default=None, gt=0)
    bedrooms: Optional[int] = Field(default=None, gt=0)
    beds: Optional[int] = Field(default=None, gt=0)
    baths: Optional[int] = Field(default=None, gt=0)
    description: Optional[str] = None
    amenities: Optional[list[str]] = None
    images: Optional[list[str]] = None
    region: Optional[str] = None


class BookingCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    listing_id: str = Field(alias="listingId")
    start_date: str = Field(alias="startDate")
    end_date: str = Field(alias="endDate")
    guests: int = Field(gt=0)
    guest_id: str = Field(default="guest-demo", alias="guestId")
    guest_name: str = Field(default="Alex Morgan", alias="guestName")


def connect() -> sqlite3.Connection:
    Path(DB_PATH).parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")
    return connection


def serialize_listing(row: sqlite3.Row) -> dict:
    item = dict(row)
    item["amenities"] = json.loads(item.pop("amenities_json"))
    item["images"] = json.loads(item.pop("images_json"))
    return item


def serialize_booking(row: sqlite3.Row) -> dict:
    return dict(row)


def insert_listing(connection: sqlite3.Connection, item: dict) -> None:
    connection.execute(
        """INSERT INTO listings
        (id,title,location,region,country,price,rating,reviews,type,guests,bedrooms,beds,baths,host,host_initials,host_color,badge,host_id,description,amenities_json,images_json,created_at)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now'))""",
        (item["id"], item["title"], item["location"], item.get("region", ""), item.get("country", "India"), item["price"], item.get("rating", 0), item.get("reviews", 0), item.get("type", "Home"), item.get("guests", 2), item.get("bedrooms", 1), item.get("beds", 1), item.get("baths", 1), item.get("host", "You"), item.get("host_initials", "YO"), item.get("host_color", "#ffd4c7"), item.get("badge", "New on Roamly"), item.get("host_id", "host-demo"), item.get("description", ""), json.dumps(item.get("amenities", ["Wifi", "Kitchen"])), json.dumps(item.get("images") or [SEED_LISTINGS[0]["images"][0]])),
    )


def initialize() -> None:
    with closing(connect()) as connection:
        connection.executescript(SCHEMA)
        if connection.execute("SELECT COUNT(*) FROM listings").fetchone()[0] == 0:
            for item in SEED_LISTINGS:
                insert_listing(connection, item)
        connection.commit()


app = FastAPI(title="Roamly API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=os.getenv("CORS_ORIGINS", "*").split(","), allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
api = APIRouter(prefix="/api")


@app.on_event("startup")
def on_startup() -> None:
    initialize()


@api.get("/health")
def health() -> dict:
    return {"status": "ok", "database": "sqlite"}


@api.get("/listings")
def get_listings(q: str = "", category: Optional[str] = None, maxPrice: int = Query(default=0, ge=0)) -> list[dict]:
    with closing(connect()) as connection:
        rows = connection.execute("SELECT * FROM listings ORDER BY created_at DESC").fetchall()
    query = q.lower().strip()
    return [serialize_listing(row) for row in rows if (not query or query in f"{row['title']} {row['location']} {row['region']}".lower()) and (not maxPrice or row["price"] <= maxPrice) and (not category or category in ("All", "All stays", "Trending", "OMG!") or row["type"] == category or category in json.loads(row["amenities_json"]) or row["badge"] == category)]


@api.get("/listings/{listing_id}")
def get_listing(listing_id: str) -> dict:
    with closing(connect()) as connection:
        row = connection.execute("SELECT * FROM listings WHERE id = ?", (listing_id,)).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Stay not found")
    return serialize_listing(row)


@api.post("/listings", status_code=status.HTTP_201_CREATED)
def create_listing(payload: ListingCreate) -> dict:
    item = payload.model_dump()
    item.update({"id": str(uuid4()), "host_initials": "YO", "host_color": "#ffd4c7", "badge": "New on Roamly", "rating": 0, "reviews": 0})
    with closing(connect()) as connection:
        insert_listing(connection, item)
        connection.commit()
        row = connection.execute("SELECT * FROM listings WHERE id = ?", (item["id"],)).fetchone()
    return serialize_listing(row)


@api.put("/listings/{listing_id}")
def update_listing(listing_id: str, payload: ListingUpdate) -> dict:
    values = payload.model_dump(exclude_none=True)
    json_fields = {"amenities": "amenities_json", "images": "images_json"}
    assignments, args = [], []
    for key, value in values.items():
        column = json_fields.get(key, key)
        assignments.append(f"{column} = ?")
        args.append(json.dumps(value) if key in json_fields else value)
    if not assignments:
        return get_listing(listing_id)
    args.append(listing_id)
    with closing(connect()) as connection:
        result = connection.execute(f"UPDATE listings SET {', '.join(assignments)} WHERE id = ?", args)
        if not result.rowcount:
            raise HTTPException(status_code=404, detail="Stay not found")
        connection.commit()
        row = connection.execute("SELECT * FROM listings WHERE id = ?", (listing_id,)).fetchone()
    return serialize_listing(row)


@api.delete("/listings/{listing_id}")
def delete_listing(listing_id: str) -> dict:
    with closing(connect()) as connection:
        result = connection.execute("DELETE FROM listings WHERE id = ?", (listing_id,))
        if not result.rowcount:
            raise HTTPException(status_code=404, detail="Stay not found")
        connection.commit()
    return {"success": True, "id": listing_id}


@api.get("/bookings")
def get_bookings(guestId: str = "guest-demo") -> list[dict]:
    with closing(connect()) as connection:
        rows = connection.execute("SELECT * FROM bookings WHERE guest_id = ? ORDER BY created_at DESC", (guestId,)).fetchall()
    return [serialize_booking(row) for row in rows]


@api.get("/listings/{listing_id}/availability")
def get_availability(listing_id: str) -> dict:
    """Return the blocked (guest-booked) date ranges for a listing so
    the frontend can grey them out on the calendar."""
    with closing(connect()) as connection:
        listing = connection.execute("SELECT id FROM listings WHERE id = ?", (listing_id,)).fetchone()
        if not listing:
            raise HTTPException(status_code=404, detail="Stay not found")
        rows = connection.execute(
            "SELECT start_date, end_date FROM bookings WHERE listing_id = ? AND status != 'cancelled' ORDER BY start_date",
            (listing_id,),
        ).fetchall()
    return {
        "listingId": listing_id,
        "blocked": [{"startDate": r["start_date"], "endDate": r["end_date"]} for r in rows],
    }



@api.post("/bookings", status_code=status.HTTP_201_CREATED)
def create_booking(payload: BookingCreate) -> dict:
    try:
        start, end = date.fromisoformat(payload.start_date), date.fromisoformat(payload.end_date)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Choose valid ISO dates") from exc
    if end <= start:
        raise HTTPException(status_code=400, detail="Choose a valid date range")
    nights = (end - start).days
    with closing(connect()) as connection:
        listing = connection.execute("SELECT * FROM listings WHERE id = ?", (payload.listing_id,)).fetchone()
        if not listing:
            raise HTTPException(status_code=404, detail="Stay not found")
        if payload.guests > listing["guests"]:
            raise HTTPException(status_code=400, detail=f"This stay hosts up to {listing['guests']} guests")
        overlap = connection.execute("SELECT id FROM bookings WHERE listing_id = ? AND status != 'cancelled' AND start_date < ? AND end_date > ?", (payload.listing_id, payload.end_date, payload.start_date)).fetchone()
        if overlap:
            raise HTTPException(status_code=409, detail="Those dates are no longer available")
        booking_id = str(uuid4())
        subtotal = nights * listing["price"]
        total = round(subtotal * 1.14)
        connection.execute("""INSERT INTO bookings (id,listing_id,listing_title,listing_image,location,guest_id,guest_name,host_id,start_date,end_date,guests,nights,subtotal,total,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,? ,datetime('now'))""", (booking_id, listing["id"], listing["title"], json.loads(listing["images_json"])[0], listing["location"], payload.guest_id, payload.guest_name, listing["host_id"], payload.start_date, payload.end_date, payload.guests, nights, subtotal, total, "confirmed"))
        connection.commit()
        row = connection.execute("SELECT * FROM bookings WHERE id = ?", (booking_id,)).fetchone()
    return serialize_booking(row)


@api.get("/host/listings")
def get_host_listings(hostId: str = "host-demo") -> dict:
    with closing(connect()) as connection:
        listings = connection.execute("SELECT * FROM listings WHERE host_id = ? ORDER BY created_at DESC", (hostId,)).fetchall()
        bookings = connection.execute("SELECT * FROM bookings WHERE host_id = ? ORDER BY created_at DESC", (hostId,)).fetchall()
    return {"listings": [serialize_listing(row) for row in listings], "bookings": [serialize_booking(row) for row in bookings]}


app.include_router(api)
-- Roamly SQLite schema
-- The FastAPI app runs these statements on startup via
-- `backend/main.py:initialize()` and then seeds 8 sample listings.
-- All public ids are UUID-shaped TEXT strings; SQLite rowids are never exposed.

CREATE TABLE IF NOT EXISTS listings (
  id             TEXT PRIMARY KEY,
  title          TEXT NOT NULL,
  location       TEXT NOT NULL,
  region         TEXT,
  country        TEXT,
  price          INTEGER NOT NULL,
  rating         REAL    DEFAULT 0,
  reviews        INTEGER DEFAULT 0,
  type           TEXT NOT NULL,      -- Home | Apartment | Villa | Cabin
  guests         INTEGER NOT NULL,
  bedrooms       INTEGER DEFAULT 1,
  beds           INTEGER DEFAULT 1,
  baths          INTEGER DEFAULT 1,
  host           TEXT,
  host_initials  TEXT,
  host_color     TEXT,
  badge          TEXT,                -- Guest favourite | Amazing views | ...
  host_id        TEXT NOT NULL,
  description    TEXT,
  amenities_json TEXT NOT NULL,       -- JSON array of amenity strings
  images_json    TEXT NOT NULL,       -- JSON array of photo URLs
  created_at     TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS bookings (
  id             TEXT PRIMARY KEY,
  listing_id     TEXT NOT NULL,
  listing_title  TEXT NOT NULL,
  listing_image  TEXT,
  location       TEXT,
  guest_id       TEXT NOT NULL,
  guest_name     TEXT,
  host_id        TEXT NOT NULL,
  start_date     TEXT NOT NULL,       -- ISO YYYY-MM-DD
  end_date       TEXT NOT NULL,       -- ISO YYYY-MM-DD
  guests         INTEGER NOT NULL,
  nights         INTEGER NOT NULL,
  subtotal       INTEGER NOT NULL,
  total          INTEGER NOT NULL,    -- includes 14% service fee
  status         TEXT NOT NULL,       -- "confirmed"
  created_at     TEXT NOT NULL,
  FOREIGN KEY(listing_id) REFERENCES listings(id)
);

-- Helpful indexes for the most common lookups:
CREATE INDEX IF NOT EXISTS idx_listings_host    ON listings(host_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest   ON bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_listing ON bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates   ON bookings(listing_id, start_date, end_date);

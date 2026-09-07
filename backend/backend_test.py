#!/usr/bin/env python3
"""
Roamly FastAPI Backend Test Suite
Tests the live FastAPI backend through the Next.js proxy at the public URL
"""
import os
import sys
import requests
from typing import Optional

# Public URL from environment
BASE_URL = os.getenv("NEXT_PUBLIC_BASE_URL", "https://property-portal-606.preview.emergentagent.com")
API_URL = f"{BASE_URL}/api"

# Test tracking
passed = 0
failed = 0
test_results = []


def check(name: str, condition: bool, detail: str = "") -> None:
    """Assert a test condition and track results"""
    global passed, failed
    if not condition:
        failed += 1
        msg = f"❌ FAIL: {name}"
        if detail:
            msg += f" - {detail}"
        print(msg)
        test_results.append({"name": name, "status": "FAIL", "detail": detail})
        return
    passed += 1
    print(f"✅ PASS: {name}")
    test_results.append({"name": name, "status": "PASS", "detail": ""})


def test_get_listings_seeded():
    """Test 1: GET /api/listings returns >= 8 seeded listings with required fields"""
    try:
        response = requests.get(f"{API_URL}/listings", timeout=10)
        check("GET /listings returns 200", response.status_code == 200, f"Got {response.status_code}")
        
        if response.status_code == 200:
            listings = response.json()
            check("GET /listings returns >= 8 seeded listings", len(listings) >= 8, f"Got {len(listings)} listings")
            
            if listings:
                first = listings[0]
                required_fields = ["id", "title", "location", "price", "rating", "reviews", "images", "amenities"]
                for field in required_fields:
                    check(f"Listing has '{field}' field", field in first, f"Missing field: {field}")
                
                check("Listing images is a list", isinstance(first.get("images"), list), f"Got {type(first.get('images'))}")
                check("Listing amenities is a list", isinstance(first.get("amenities"), list), f"Got {type(first.get('amenities'))}")
    except Exception as e:
        check("GET /listings request", False, str(e))


def test_search_filters():
    """Test 2-3: Search and filter parameters work correctly"""
    try:
        # Test q=Noida filter
        response = requests.get(f"{API_URL}/listings", params={"q": "Noida"}, timeout=10)
        check("GET /listings?q=Noida returns 200", response.status_code == 200)
        
        if response.status_code == 200:
            noida_listings = response.json()
            check("Noida search returns results", len(noida_listings) > 0, f"Got {len(noida_listings)} results")
            
            if noida_listings:
                # Verify all results contain "noida" in location or region
                all_match = all(
                    "noida" in (item.get("location", "") + " " + item.get("region", "")).lower()
                    for item in noida_listings
                )
                check("Noida search results contain 'noida'", all_match)
        
        # Test category=Villa filter
        response = requests.get(f"{API_URL}/listings", params={"category": "Villa"}, timeout=10)
        check("GET /listings?category=Villa returns 200", response.status_code == 200)
        
        if response.status_code == 200:
            villa_listings = response.json()
            check("Villa category returns results", len(villa_listings) > 0, f"Got {len(villa_listings)} results")
            
            if villa_listings:
                all_villas = all(item.get("type") == "Villa" for item in villa_listings)
                check("Villa category results are all Villas", all_villas)
        
        # Test maxPrice=4000 filter
        response = requests.get(f"{API_URL}/listings", params={"maxPrice": 4000}, timeout=10)
        check("GET /listings?maxPrice=4000 returns 200", response.status_code == 200)
        
        if response.status_code == 200:
            price_listings = response.json()
            check("maxPrice filter returns results", len(price_listings) > 0, f"Got {len(price_listings)} results")
            
            if price_listings:
                all_under_max = all(item.get("price", 0) <= 4000 for item in price_listings)
                check("maxPrice results all <= 4000", all_under_max)
    
    except Exception as e:
        check("Search/filter tests", False, str(e))


def test_listing_detail():
    """Test 4: GET /api/listings/{id} returns detail for a seeded listing"""
    try:
        # First get a listing ID
        response = requests.get(f"{API_URL}/listings", timeout=10)
        if response.status_code == 200:
            listings = response.json()
            if listings:
                listing_id = listings[0]["id"]
                
                # Get detail
                detail_response = requests.get(f"{API_URL}/listings/{listing_id}", timeout=10)
                check(f"GET /listings/{listing_id} returns 200", detail_response.status_code == 200)
                
                if detail_response.status_code == 200:
                    detail = detail_response.json()
                    check("Detail has matching id", detail.get("id") == listing_id)
                    check("Detail has title", "title" in detail and len(detail["title"]) > 0)
                    check("Detail has description", "description" in detail)
    except Exception as e:
        check("GET listing detail", False, str(e))


def test_host_crud():
    """Test 5: Host CRUD - POST, PUT, DELETE listing"""
    created_id = None
    
    try:
        # POST new listing
        new_listing = {
            "title": "Cozy Penthouse near India Gate",
            "location": "Connaught Place, New Delhi",
            "price": 4200,
            "guests": 3,
            "hostId": "host-demo",
            "images": ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=85"]
        }
        
        response = requests.post(f"{API_URL}/listings", json=new_listing, timeout=10)
        check("POST /listings returns 201", response.status_code == 201, f"Got {response.status_code}")
        
        if response.status_code == 201:
            created = response.json()
            created_id = created.get("id")
            check("Created listing has UUID id", created_id is not None and len(created_id) > 0)
            check("Created listing has title", created.get("title") == new_listing["title"])
            check("Created listing has price", created.get("price") == new_listing["price"])
            
            # PUT update listing
            if created_id:
                update_data = {
                    "title": "Updated Penthouse near India Gate",
                    "price": 4500
                }
                
                update_response = requests.put(f"{API_URL}/listings/{created_id}", json=update_data, timeout=10)
                check("PUT /listings/{id} returns 200", update_response.status_code == 200, f"Got {update_response.status_code}")
                
                if update_response.status_code == 200:
                    updated = update_response.json()
                    check("Updated listing has new title", updated.get("title") == update_data["title"])
                    check("Updated listing has new price", updated.get("price") == update_data["price"])
                
                # DELETE listing
                delete_response = requests.delete(f"{API_URL}/listings/{created_id}", timeout=10)
                check("DELETE /listings/{id} returns 200/204", delete_response.status_code in [200, 204], f"Got {delete_response.status_code}")
                
                # Verify deletion - should return 404
                get_deleted = requests.get(f"{API_URL}/listings/{created_id}", timeout=10)
                check("GET deleted listing returns 404", get_deleted.status_code == 404, f"Got {get_deleted.status_code}")
    
    except Exception as e:
        check("Host CRUD operations", False, str(e))


def test_booking_happy_path():
    """Test 6: Booking happy path - create booking with valid data"""
    global created_booking_id
    created_booking_id = None
    
    try:
        # Get a listing to book
        response = requests.get(f"{API_URL}/listings", timeout=10)
        if response.status_code == 200:
            listings = response.json()
            if listings:
                listing = listings[0]
                listing_id = listing["id"]
                listing_price = listing["price"]
                
                # Create booking with unique future dates
                import random
                month = random.randint(1, 12)
                day = random.randint(1, 20)
                booking_data = {
                    "listing_id": listing_id,
                    "start_date": f"2028-{month:02d}-{day:02d}",
                    "end_date": f"2028-{month:02d}-{day+4:02d}",
                    "guests": 2,
                    "guest_id": f"guest-test-{random.randint(10000, 99999)}",
                    "guest_name": "Priya Sharma"
                }
                
                booking_response = requests.post(f"{API_URL}/bookings", json=booking_data, timeout=10)
                check("POST /bookings returns 200/201", booking_response.status_code in [200, 201], f"Got {booking_response.status_code}")
                
                if booking_response.status_code in [200, 201]:
                    booking = booking_response.json()
                    created_booking_id = booking.get("id")
                    
                    check("Booking has nights=4", booking.get("nights") == 4, f"Got {booking.get('nights')} nights")
                    
                    expected_subtotal = 4 * listing_price
                    check("Booking has correct subtotal", booking.get("subtotal") == expected_subtotal, f"Expected {expected_subtotal}, got {booking.get('subtotal')}")
                    
                    check("Booking has non-zero total", booking.get("total", 0) > 0, f"Got total={booking.get('total')}")
                    
                    check("Booking status is confirmed", booking.get("status") in ["confirmed", "CONFIRMED"], f"Got status={booking.get('status')}")
    
    except Exception as e:
        check("Booking happy path", False, str(e))


def test_booking_overlap():
    """Test 7: Overlapping booking returns 409"""
    try:
        # Get a listing
        response = requests.get(f"{API_URL}/listings", timeout=10)
        if response.status_code == 200:
            listings = response.json()
            if listings:
                listing_id = listings[0]["id"]
                
                # Create first booking with unique dates
                import random
                month = random.randint(1, 12)
                day = random.randint(1, 20)
                booking_data = {
                    "listing_id": listing_id,
                    "start_date": f"2030-{month:02d}-{day:02d}",
                    "end_date": f"2030-{month:02d}-{day+5:02d}",
                    "guests": 2,
                    "guest_id": f"guest-overlap-{random.randint(10000, 99999)}",
                    "guest_name": "Test User"
                }
                
                first_booking = requests.post(f"{API_URL}/bookings", json=booking_data, timeout=10)
                
                # Try to create overlapping booking
                overlap_booking = requests.post(f"{API_URL}/bookings", json=booking_data, timeout=10)
                check("Overlapping booking returns 409", overlap_booking.status_code == 409, f"Got {overlap_booking.status_code}")
    
    except Exception as e:
        check("Booking overlap validation", False, str(e))


def test_booking_guest_capacity():
    """Test 8: Booking with guests exceeding capacity returns 400"""
    try:
        # Get a listing
        response = requests.get(f"{API_URL}/listings", timeout=10)
        if response.status_code == 200:
            listings = response.json()
            if listings:
                listing = listings[0]
                listing_id = listing["id"]
                max_guests = listing.get("guests", 2)
                
                # Try to book with too many guests
                import random
                month = random.randint(1, 12)
                day = random.randint(1, 20)
                booking_data = {
                    "listing_id": listing_id,
                    "start_date": f"2031-{month:02d}-{day:02d}",
                    "end_date": f"2031-{month:02d}-{day+4:02d}",
                    "guests": max_guests + 5,  # Exceed capacity
                    "guest_id": f"guest-capacity-{random.randint(10000, 99999)}",
                    "guest_name": "Test User"
                }
                
                response = requests.post(f"{API_URL}/bookings", json=booking_data, timeout=10)
                check("Booking exceeding guest capacity returns 400", response.status_code == 400, f"Got {response.status_code}")
    
    except Exception as e:
        check("Guest capacity validation", False, str(e))


def test_booking_bad_dates():
    """Test 9: Bad date range (end <= start) returns 400"""
    try:
        # Get a listing
        response = requests.get(f"{API_URL}/listings", timeout=10)
        if response.status_code == 200:
            listings = response.json()
            if listings:
                listing_id = listings[0]["id"]
                
                # Try booking with end date same as start date
                import random
                month = random.randint(1, 12)
                day = random.randint(1, 20)
                booking_data = {
                    "listing_id": listing_id,
                    "start_date": f"2032-{month:02d}-{day:02d}",
                    "end_date": f"2032-{month:02d}-{day:02d}",  # Same as start
                    "guests": 2,
                    "guest_id": f"guest-baddate-{random.randint(10000, 99999)}",
                    "guest_name": "Test User"
                }
                
                response = requests.post(f"{API_URL}/bookings", json=booking_data, timeout=10)
                check("Booking with end <= start returns 400", response.status_code == 400, f"Got {response.status_code}")
    
    except Exception as e:
        check("Bad date range validation", False, str(e))


def test_get_guest_bookings():
    """Test 10: GET /api/bookings?guestId returns guest bookings"""
    try:
        # Create a booking first
        response = requests.get(f"{API_URL}/listings", timeout=10)
        if response.status_code == 200:
            listings = response.json()
            if listings:
                listing_id = listings[0]["id"]
                
                import random
                guest_id = f"guest-query-test-{random.randint(10000, 99999)}"
                month = random.randint(1, 12)
                day = random.randint(1, 20)
                booking_data = {
                    "listing_id": listing_id,
                    "start_date": f"2029-{month:02d}-{day:02d}",
                    "end_date": f"2029-{month:02d}-{day+4:02d}",
                    "guests": 2,
                    "guest_id": guest_id,
                    "guest_name": "Query Test User"
                }
                
                create_response = requests.post(f"{API_URL}/bookings", json=booking_data, timeout=10)
                
                if create_response.status_code in [200, 201]:
                    created_booking = create_response.json()
                    booking_id = created_booking.get("id")
                    
                    # Query bookings for this guest
                    query_response = requests.get(f"{API_URL}/bookings", params={"guestId": guest_id}, timeout=10)
                    check("GET /bookings?guestId returns 200", query_response.status_code == 200, f"Got {query_response.status_code}")
                    
                    if query_response.status_code == 200:
                        bookings = query_response.json()
                        check("Guest bookings query returns results", len(bookings) > 0, f"Got {len(bookings)} bookings")
                        
                        if bookings and booking_id:
                            found = any(b.get("id") == booking_id for b in bookings)
                            check("Created booking found in guest query", found)
    
    except Exception as e:
        check("Guest bookings query", False, str(e))


def test_host_listings_endpoint():
    """Test 11: GET /api/host/listings?hostId returns listings and bookings structure"""
    try:
        host_id = "host-demo"
        response = requests.get(f"{API_URL}/host/listings", params={"hostId": host_id}, timeout=10)
        check("GET /host/listings returns 200", response.status_code == 200, f"Got {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            check("Host response has 'listings' key", "listings" in data)
            check("Host response has 'bookings' key", "bookings" in data)
            
            if "listings" in data:
                check("Host listings is a list", isinstance(data["listings"], list))
            
            if "bookings" in data:
                check("Host bookings is a list", isinstance(data["bookings"], list))
    
    except Exception as e:
        check("Host listings endpoint", False, str(e))


def main():
    """Run all backend tests"""
    print("=" * 80)
    print("Roamly FastAPI Backend Test Suite")
    print(f"Testing against: {API_URL}")
    print("=" * 80)
    print()
    
    # Run all test scenarios
    print("Test 1: Seeded listings with required fields")
    test_get_listings_seeded()
    print()
    
    print("Test 2-3: Search and filter parameters")
    test_search_filters()
    print()
    
    print("Test 4: Listing detail endpoint")
    test_listing_detail()
    print()
    
    print("Test 5: Host CRUD operations")
    test_host_crud()
    print()
    
    print("Test 6: Booking happy path")
    test_booking_happy_path()
    print()
    
    print("Test 7: Booking overlap validation")
    test_booking_overlap()
    print()
    
    print("Test 8: Guest capacity validation")
    test_booking_guest_capacity()
    print()
    
    print("Test 9: Bad date range validation")
    test_booking_bad_dates()
    print()
    
    print("Test 10: Guest bookings query")
    test_get_guest_bookings()
    print()
    
    print("Test 11: Host listings endpoint")
    test_host_listings_endpoint()
    print()
    
    # Summary
    print("=" * 80)
    print(f"TEST SUMMARY: {passed} passed, {failed} failed out of {passed + failed} total")
    print("=" * 80)
    
    if failed > 0:
        print("\n❌ SOME TESTS FAILED")
        sys.exit(1)
    else:
        print("\n✅ ALL TESTS PASSED")
        sys.exit(0)


if __name__ == "__main__":
    main()

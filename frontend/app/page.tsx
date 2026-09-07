'use client'

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Map, Search, SlidersHorizontal } from 'lucide-react'

import Header, { type Tab } from '@/components/roamly/Header'
import CategoryRow from '@/components/roamly/CategoryRow'
import ListingCard from '@/components/roamly/ListingCard'
import ListingDetail from '@/components/roamly/ListingDetail'
import SearchPanel from '@/components/roamly/SearchPanel'
import FilterPanel from '@/components/roamly/FilterPanel'
import TripsModal from '@/components/roamly/TripsModal'
import HostModal from '@/components/roamly/HostModal'
import CheckoutModal from '@/components/roamly/CheckoutModal'
import MenuModal from '@/components/roamly/MenuModal'
import ComingSoonModal from '@/components/roamly/ComingSoonModal'
import MapPanel from '@/components/roamly/MapPanel'
import Toast from '@/components/roamly/Toast'

import type { Booking, HostBundle, HostForm, Listing } from '@/lib/types'
import { nightsBetween, normalizeListing } from '@/lib/format'
import { CURATED_IMAGES, FALLBACK_LISTINGS, enrichListing } from '@/lib/data'
import { DEFAULT_FILTERS, countActiveFilters, listingMatches, type Filters } from '@/lib/filters'
import { rangeOverlapsBlocked, type BlockedRange } from '@/lib/availability'
import { useLocalStorageState } from '@/lib/useLocalStorageState'
import { DEMO_GUEST, DEMO_HOST, userForRole, type Role } from '@/lib/auth'

const createEmptyHostForm = (): HostForm => ({
  title: '',
  location: '',
  price: '',
  type: 'Home',
  guests: 2,
  bedrooms: 1,
  description: '',
  image: CURATED_IMAGES[0],
})

const App = () => {
  const [role, setRole] = useLocalStorageState<Role>('roamly-role', 'guest')
  const user = userForRole(role)

  const [listings, setListings] = useState<Listing[]>(FALLBACK_LISTINGS)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [query, setQuery] = useState<string>('')
  const [activeCategory, setActiveCategory] = useState<string>('All stays')
  const [filters, setFilters] = useState<Filters>({ ...DEFAULT_FILTERS })
  const [guests, setGuests] = useState<number>(0)
  const [activeTab, setActiveTab] = useState<Tab>('homes')

  const [showSearchPanel, setShowSearchPanel] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showTrips, setShowTrips] = useState(false)
  const [showHost, setShowHost] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [comingSoon, setComingSoon] = useState<string>('')

  const [selected, setSelected] = useState<Listing | null>(null)
  const [liked, setLiked] = useLocalStorageState<string[]>('roamly-liked', [])
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [detailGuests, setDetailGuests] = useState<number>(1)
  const [toast, setToast] = useState<string>('')
  const [blockedRanges, setBlockedRanges] = useState<BlockedRange[]>([])

  const [hostListings, setHostListings] = useState<Listing[]>([])
  const [hostBookings, setHostBookings] = useState<Booking[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [hostForm, setHostForm] = useState<HostForm>(createEmptyHostForm())

  const notify = useCallback((message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 3200)
  }, [])

  const refreshGuestBookings = useCallback(() => {
    fetch(`/api/bookings?guestId=${DEMO_GUEST.id}`)
      .then((response) => (response.ok ? response.json() : []))
      .then((data: Booking[]) => setBookings((data || []).map((item) => normalizeListing(item))))
      .catch(() => undefined)
  }, [])

  useEffect(() => {
    fetch('/api/listings')
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((data: Listing[]) => {
        if (data?.length) setListings(data.map((item) => enrichListing(normalizeListing(item))))
      })
      .catch(() => notify('Showing our handpicked stays for now'))
    refreshGuestBookings()
  }, [notify, refreshGuestBookings])

  const filteredListings = useMemo(
    () =>
      listings.filter((listing) => {
        const text = `${listing.title} ${listing.location}`.toLowerCase()
        const matchesQuery = !query || text.includes(query.toLowerCase())
        const matchesCategory =
          activeCategory === 'All stays' ||
          activeCategory === 'Trending' ||
          activeCategory === 'OMG!' ||
          listing.type === activeCategory ||
          listing.badge === activeCategory ||
          listing.amenities.includes(activeCategory)
        return matchesQuery && matchesCategory && listingMatches(listing, filters)
      }),
    [listings, query, filters, activeCategory]
  )

  const activeFilterCount = countActiveFilters(filters)
  const selectedNights = nightsBetween(startDate, endDate)
  const selectedTotal = selected ? Math.round(selectedNights * selected.price * 1.14) : 0

  const loadAvailability = useCallback(async (listingId: string) => {
    try {
      const response = await fetch(`/api/listings/${listingId}/availability`)
      if (!response.ok) throw new Error('unavailable')
      const data = (await response.json()) as { blocked: BlockedRange[] }
      setBlockedRanges(data.blocked || [])
    } catch {
      setBlockedRanges([])
    }
  }, [])

  const openListing = (listing: Listing) => {
    setSelected(listing)
    setStartDate('')
    setEndDate('')
    setDetailGuests(1)
    setBlockedRanges([])
    void loadAvailability(listing.id)
  }

  const handleDateChange = (start: string, end: string) => {
    if (start && end && rangeOverlapsBlocked(start, end, blockedRanges)) {
      notify('Those dates overlap an existing booking — please pick another range')
      setStartDate(start)
      setEndDate('')
      return
    }
    setStartDate(start)
    setEndDate(end)
  }

  const toggleLike = (id: string) =>
    setLiked(liked.includes(id) ? liked.filter((item) => item !== id) : [...liked, id])

  const showComingSoon = (label: string) => {
    setShowMenu(false)
    setComingSoon(label)
  }

  const reserve = () => {
    if (!selected) return
    if (!selectedNights) {
      notify('Choose a check-in and check-out date')
      return
    }
    if (detailGuests > selected.guests) {
      notify(`This stay hosts up to ${selected.guests} guests`)
      return
    }
    if (rangeOverlapsBlocked(startDate, endDate, blockedRanges)) {
      notify('Those dates are already booked — pick another range')
      return
    }
    setShowCheckout(true)
  }

  const confirmBooking = async () => {
    if (!selected) return
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: selected.id,
          startDate,
          endDate,
          guests: detailGuests,
          guestId: DEMO_GUEST.id,
          guestName: DEMO_GUEST.name,
        }),
      })
      const data = await response.json().catch(() => null)
      if (!response.ok) {
        notify(data?.detail || data?.error || 'Those dates are unavailable')
        return
      }
      const booking = normalizeListing<Booking>(data)
      setBookings((current) => [booking, ...current])
      setBlockedRanges((current) => [...current, { startDate, endDate }])
      setShowCheckout(false)
      setSelected(null)
      setShowTrips(true)
      notify('Your stay is confirmed — enjoy the escape ✨')
    } catch {
      notify('Could not complete the reservation just yet')
    }
  }

  const loadHost = useCallback(async () => {
    try {
      const response = await fetch(`/api/host/listings?hostId=${DEMO_HOST.id}`)
      const data = (await response.json()) as HostBundle
      setHostListings((data?.listings || []).map((item) => enrichListing(normalizeListing(item))))
      setHostBookings((data?.bookings || []).map((item) => normalizeListing(item)))
    } catch {
      setHostListings([])
      setHostBookings([])
    }
  }, [])

  const openHost = () => {
    if (role !== 'host') {
      setRole('host')
      notify('Switched to host mode')
    }
    setShowHost(true)
    void loadHost()
  }

  const submitHost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = {
      ...hostForm,
      price: Number(hostForm.price),
      guests: Number(hostForm.guests) || 2,
      bedrooms: Number(hostForm.bedrooms) || 1,
      host: DEMO_HOST.name,
      hostId: DEMO_HOST.id,
      host_id: DEMO_HOST.id,
      region: hostForm.location,
      images: [hostForm.image || CURATED_IMAGES[0]],
    }
    const response = await fetch(editingId ? `/api/listings/${editingId}` : '/api/listings', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (response.ok) {
      notify(editingId ? 'Listing updated' : 'Listing published')
      setEditingId(null)
      setHostForm(createEmptyHostForm())
      void loadHost()
      fetch('/api/listings')
        .then((r) => (r.ok ? r.json() : []))
        .then((data: Listing[]) => data?.length && setListings(data.map((item) => enrichListing(normalizeListing(item)))))
        .catch(() => undefined)
    } else {
      notify('Please add a title, location, and nightly price')
    }
  }

  const deleteHostListing = async (id: string) => {
    const response = await fetch(`/api/listings/${id}`, { method: 'DELETE' })
    if (response.ok) {
      notify('Listing removed')
      void loadHost()
      setListings((current) => current.filter((listing) => listing.id !== id))
    }
  }

  const editHostListing = (listing: Listing) => {
    setEditingId(listing.id)
    setHostForm({
      title: listing.title || '',
      location: listing.location || '',
      price: listing.price || '',
      type: listing.type || 'Home',
      guests: listing.guests || 2,
      bedrooms: listing.bedrooms || 1,
      description: listing.description || '',
      image: listing.images?.[0] || CURATED_IMAGES[0],
    })
  }

  const closeHost = () => {
    setShowHost(false)
    setEditingId(null)
  }

  const handleSwitchRole = (nextRole: Role) => {
    setRole(nextRole)
    setShowMenu(false)
    notify(nextRole === 'host' ? 'You are now in host mode' : 'Back to guest mode')
    if (nextRole === 'host') {
      setShowHost(true)
      void loadHost()
    }
  }

  const isHomesTab = activeTab === 'homes'

  return (
    <main className="min-h-screen bg-white text-[#222222]">
      <Header
        query={query}
        setQuery={setQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setShowSearchPanel={setShowSearchPanel}
        onLogoClick={() => {
          setQuery('')
          setActiveCategory('All stays')
          setFilters({ ...DEFAULT_FILTERS })
          setActiveTab('homes')
          setShowTrips(false)
          setShowHost(false)
        }}
        onHost={openHost}
        onMenu={() => setShowMenu(true)}
        onComingSoon={showComingSoon}
        role={role}
      />

      <div className="mx-auto max-w-[1440px] px-5 lg:px-10">
        {activeTab === 'homes' && (
          <CategoryRow activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
        )}

        {isHomesTab && (
          <>
            <section className="flex items-center justify-between py-5">
              <div>
                <h1 className="text-[25px] font-semibold tracking-[-.7px]">
                  Stays that feel like a getaway
                </h1>
                <p className="mt-1 text-sm text-[#717171]">
                  Curated homes for your next long weekend
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(true)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold transition ${
                    activeFilterCount > 0
                      ? 'border-[#222222] bg-[#f7f7f7]'
                      : 'border-[#dddddd] hover:border-[#222222]'
                  }`}
                >
                  <SlidersHorizontal size={16} /> Filters
                  {activeFilterCount > 0 && (
                    <span className="rounded-full bg-[#222222] px-2 py-0.5 text-[11px] font-bold text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setShowMap((value) => !value)}
                  className={`hidden items-center gap-2 rounded-full border px-4 py-3 text-sm font-semibold sm:flex ${
                    showMap ? 'border-[#222222] bg-[#f7f7f7]' : 'border-[#dddddd]'
                  }`}
                >
                  <Map size={16} /> {showMap ? 'Hide map' : 'Show map'}
                </button>
              </div>
            </section>

            <div className={showMap ? 'grid gap-6 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_560px]' : ''}>
              <section
                className={`grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 ${
                  showMap ? 'lg:grid-cols-2' : 'lg:grid-cols-3 xl:grid-cols-4'
                }`}
              >
                {filteredListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    liked={liked.includes(listing.id)}
                    onLike={() => toggleLike(listing.id)}
                    onOpen={() => openListing(listing)}
                  />
                ))}
                {!filteredListings.length && (
                  <div className="col-span-full rounded-2xl border border-dashed border-[#dddddd] py-20 text-center">
                    <Search className="mx-auto text-[#717171]" />
                    <h2 className="mt-4 text-xl font-semibold">No stays found</h2>
                    <p className="mt-2 text-sm text-[#717171]">
                      Try a different location or loosen your filters.
                    </p>
                    <button
                      onClick={() => {
                        setQuery('')
                        setFilters({ ...DEFAULT_FILTERS })
                        setActiveCategory('All stays')
                      }}
                      className="mt-5 rounded-lg bg-[#222222] px-5 py-3 text-sm font-semibold text-white"
                    >
                      Clear search
                    </button>
                  </div>
                )}
              </section>
              {showMap && <MapPanel listings={filteredListings} onOpen={openListing} />}
            </div>
          </>
        )}
      </div>

      {showSearchPanel && (
        <SearchPanel
          query={query}
          setQuery={setQuery}
          guests={guests}
          setGuests={setGuests}
          onClose={() => setShowSearchPanel(false)}
          onSearch={() => setShowSearchPanel(false)}
        />
      )}
      {showFilters && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          matchCount={filteredListings.length}
          onClose={() => setShowFilters(false)}
        />
      )}
      {selected && (
        <ListingDetail
          listing={selected}
          startDate={startDate}
          endDate={endDate}
          onDateChange={handleDateChange}
          guests={detailGuests}
          setGuests={setDetailGuests}
          nights={selectedNights}
          total={selectedTotal}
          liked={liked.includes(selected.id)}
          onLike={() => toggleLike(selected.id)}
          onClose={() => setSelected(null)}
          onReserve={reserve}
          onMessage={() => showComingSoon('Messaging with hosts')}
          blockedRanges={blockedRanges}
        />
      )}
      {showTrips && <TripsModal bookings={bookings} onClose={() => setShowTrips(false)} />}
      {showHost && (
        <HostModal
          listings={hostListings}
          bookings={hostBookings}
          form={hostForm}
          setForm={setHostForm}
          editingId={editingId}
          onClose={closeHost}
          onSubmit={submitHost}
          onEdit={editHostListing}
          onDelete={deleteHostListing}
          onComingSoon={showComingSoon}
        />
      )}
      {showCheckout && selected && (
        <CheckoutModal
          listing={selected}
          nights={selectedNights}
          total={selectedTotal}
          startDate={startDate}
          onClose={() => setShowCheckout(false)}
          onConfirm={confirmBooking}
        />
      )}
      {showMenu && (
        <MenuModal
          user={user}
          onClose={() => setShowMenu(false)}
          onTrips={() => {
            setShowMenu(false)
            setShowTrips(true)
          }}
          onHost={() => {
            setShowMenu(false)
            openHost()
          }}
          onSwitchRole={handleSwitchRole}
          onComingSoon={showComingSoon}
        />
      )}
      {comingSoon && <ComingSoonModal label={comingSoon} onClose={() => setComingSoon('')} />}
      <Toast message={toast} />
    </main>
  )
}

export default App

// Filter state + helpers for the Airbnb-style filter modal.

import type { Listing } from './types'

export type PlaceType = 'any' | 'room' | 'entire'

export interface BookingOptions {
  instantBook: boolean
  selfCheckIn: boolean
  petsAllowed: boolean
}

export interface Filters {
  placeType: PlaceType
  minPrice: number
  maxPrice: number
  bedrooms: number // 0 = any
  beds: number
  baths: number
  amenities: string[]
  propertyTypes: string[]
  bookingOptions: BookingOptions
  standoutStays: string[]
}

export const PRICE_MIN = 1500
export const PRICE_MAX = 15000

export const DEFAULT_FILTERS: Filters = {
  placeType: 'any',
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
  bedrooms: 0,
  beds: 0,
  baths: 0,
  amenities: [],
  propertyTypes: [],
  bookingOptions: { instantBook: false, selfCheckIn: false, petsAllowed: false },
  standoutStays: [],
}

export const AMENITY_OPTIONS: string[] = [
  'Wifi',
  'Air conditioning',
  'TV',
  'Free parking',
  'Pool',
  'Iron',
  'Kitchen',
  'Washer',
  'Workspace',
  'Hot tub',
  'Fireplace',
  'Mountain view',
  'Breakfast',
  'Garden',
  'Patio',
]

export const PROPERTY_TYPE_OPTIONS: string[] = ['Home', 'Apartment', 'Villa', 'Cabin']
export const STANDOUT_OPTIONS: string[] = ['Guest favourite', 'Amazing views', 'Rare find', 'Luxe']

export const countActiveFilters = (filters: Filters): number => {
  let count = 0
  if (filters.placeType !== 'any') count++
  if (filters.minPrice > PRICE_MIN) count++
  if (filters.maxPrice < PRICE_MAX) count++
  if (filters.bedrooms > 0) count++
  if (filters.beds > 0) count++
  if (filters.baths > 0) count++
  count += filters.amenities.length
  count += filters.propertyTypes.length
  count += filters.standoutStays.length
  if (filters.bookingOptions.instantBook) count++
  if (filters.bookingOptions.selfCheckIn) count++
  if (filters.bookingOptions.petsAllowed) count++
  return count
}

// Given a listing and the active filters, does it pass?
export const listingMatches = (listing: Listing, filters: Filters): boolean => {
  if (filters.minPrice > 0 && Number(listing.price) < filters.minPrice) return false
  if (filters.maxPrice > 0 && Number(listing.price) > filters.maxPrice) return false
  if (filters.bedrooms > 0 && (listing.bedrooms || 0) < filters.bedrooms) return false
  if (filters.beds > 0 && (listing.beds || 0) < filters.beds) return false
  if (filters.baths > 0 && (listing.baths || 0) < filters.baths) return false

  if (filters.placeType !== 'any') {
    // Villa/Home/Cabin are treated as "entire"; Apartment can be either.
    const inferred: 'entire' | 'room' = listing.placeType || (listing.type === 'Apartment' ? 'room' : 'entire')
    if (inferred !== filters.placeType) return false
  }

  if (filters.propertyTypes.length && !filters.propertyTypes.includes(listing.type)) return false

  if (filters.standoutStays.length) {
    const badge = listing.badge || ''
    if (!filters.standoutStays.some((tag) => badge.toLowerCase() === tag.toLowerCase())) return false
  }

  if (filters.amenities.length) {
    const listingAmenities = (listing.amenities || []).map((a) => a.toLowerCase())
    const hasAll = filters.amenities.every((needed) => listingAmenities.includes(needed.toLowerCase()))
    if (!hasAll) return false
  }

  const { instantBook, selfCheckIn, petsAllowed } = filters.bookingOptions
  if (instantBook && !listing.instantBook) return false
  if (selfCheckIn && !listing.selfCheckIn) return false
  if (petsAllowed && !listing.petsAllowed) return false

  return true
}

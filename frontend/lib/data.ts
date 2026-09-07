import type { LucideIcon } from 'lucide-react'
import { Compass, Home, Mountain, Sparkles, TentTree } from 'lucide-react'
import type { Listing } from './types'

export const CURATED_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1641232458416-feace752b346?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85',
  'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=85',
]

export type CategoryIcon = LucideIcon | string

export interface Category {
  label: string
  icon: CategoryIcon
}

export const CATEGORIES: Category[] = [
  { label: 'All stays', icon: Compass },
  { label: 'Amazing views', icon: Mountain },
  { label: 'Beach', icon: '🌊' },
  { label: 'Cabin', icon: TentTree },
  { label: 'Villa', icon: Home },
  { label: 'Apartment', icon: Home },
  { label: 'Trending', icon: Sparkles },
  { label: 'Pool', icon: '🏊' },
  { label: 'Farms', icon: '🌾' },
  { label: 'OMG!', icon: '🎈' },
]

export const HEADER_NAV: Array<{ label: string; icon: string }> = [
  { label: 'All', icon: '/nav/all.png' },
  { label: 'Homes', icon: '/nav/homes.png' },
  { label: 'Experiences', icon: '/nav/experiences.png' },
  { label: 'Services', icon: '/nav/services.png' },
]

export const LOCATION_COORDS: Record<string, [number, number]> = {
  'Sector 63, Noida': [28.6285, 77.3712],
  'Chattarpur, New Delhi': [28.5069, 77.1734],
  'Lodhi Colony, New Delhi': [28.5891, 77.2273],
  'Greater Kailash, New Delhi': [28.5442, 77.2418],
  'Hauz Khas, New Delhi': [28.5494, 77.2001],
  'Aravalli Hills, Gurugram': [28.4089, 77.0421],
  'Assagao, Goa': [15.6154, 73.7526],
  'Naukuchiatal, Uttarakhand': [29.3253, 79.5714],
}

const withExtras = (listing: Listing): Listing => {
  const coords = LOCATION_COORDS[listing.location]
  const inferredPlaceType: 'entire' | 'room' = listing.type === 'Apartment' ? 'room' : 'entire'
  return {
    ...listing,
    lat: listing.lat ?? coords?.[0],
    lng: listing.lng ?? coords?.[1],
    placeType: listing.placeType ?? inferredPlaceType,
    instantBook: listing.instantBook ?? true,
    selfCheckIn: listing.selfCheckIn ?? listing.type !== 'Villa',
    petsAllowed: listing.petsAllowed ?? (listing.type === 'Villa' || listing.type === 'Home'),
  }
}

export const enrichListing = (listing: Listing): Listing => withExtras(listing)


export const FALLBACK_LISTINGS: Listing[] = [
  { id: 'stay-01', title: 'Sunlit apartment with skyline views', location: 'Sector 63, Noida', price: 3700, rating: 4.92, reviews: 86, type: 'Apartment', guests: 4, bedrooms: 2, beds: 2, baths: 2, host: 'Riya', hostInitials: 'RK', hostColor: '#f9c5b7', badge: 'Guest favourite', description: 'Wake up to a wide city view in this calm, design-led home with plenty of light, a chef-ready kitchen, and a dedicated work corner.', amenities: ['Wifi', 'Kitchen', 'Workspace', 'Air conditioning'], images: [CURATED_IMAGES[0], CURATED_IMAGES[2], CURATED_IMAGES[1]] },
  { id: 'stay-02', title: 'Warm villa tucked into a quiet garden', location: 'Chattarpur, New Delhi', price: 5800, rating: 4.88, reviews: 121, type: 'Villa', guests: 6, bedrooms: 3, beds: 4, baths: 3, host: 'Arjun', hostInitials: 'AS', hostColor: '#bfe2d0', badge: 'Guest favourite', description: 'A leafy hideaway for slow mornings, long lunches, and evenings around the fire pit. The garden is all yours.', amenities: ['Wifi', 'Pool', 'Free parking', 'Kitchen'], images: [CURATED_IMAGES[1], CURATED_IMAGES[3], CURATED_IMAGES[6]] },
  { id: 'stay-03', title: 'Peaceful home near Lodhi Garden', location: 'Lodhi Colony, New Delhi', price: 4400, rating: 4.97, reviews: 64, type: 'Home', guests: 3, bedrooms: 1, beds: 2, baths: 1, host: 'Meera', hostInitials: 'MP', hostColor: '#f5d29c', badge: 'Rare find', description: 'A quiet, art-filled stay in the heart of Delhi with leafy streets, independent cafes, and the city\u2019s best morning walks nearby.', amenities: ['Wifi', 'Kitchen', 'Washer', 'Patio'], images: [CURATED_IMAGES[2], CURATED_IMAGES[4], CURATED_IMAGES[0]] },
  { id: 'stay-04', title: 'Modern retreat with a private pool', location: 'Greater Kailash, New Delhi', price: 7200, rating: 4.86, reviews: 43, type: 'Villa', guests: 8, bedrooms: 4, beds: 5, baths: 4, host: 'Aarav', hostInitials: 'AD', hostColor: '#c6d7f4', badge: 'Guest favourite', description: 'A polished indoor-outdoor villa for celebrations and reset weekends, with a pool, terrace dining, and hotel-level comfort.', amenities: ['Wifi', 'Pool', 'Hot tub', 'Free parking'], images: [CURATED_IMAGES[3], CURATED_IMAGES[1], CURATED_IMAGES[6]] },
  { id: 'stay-05', title: 'The little blue door in Hauz Khas', location: 'Hauz Khas, New Delhi', price: 3900, rating: 4.81, reviews: 77, type: 'Apartment', guests: 2, bedrooms: 1, beds: 1, baths: 1, host: 'Naina', hostInitials: 'NS', hostColor: '#d6c2ef', badge: 'Guest favourite', description: 'A tiny, colourful nest surrounded by art galleries, independent coffee, and the lake trail. Best for two.', amenities: ['Wifi', 'Kitchen', 'Air conditioning', 'TV'], images: [CURATED_IMAGES[4], CURATED_IMAGES[0], CURATED_IMAGES[2]] },
  { id: 'stay-06', title: 'Terrace home overlooking the Aravallis', location: 'Aravalli Hills, Gurugram', price: 6400, rating: 4.95, reviews: 39, type: 'Home', guests: 5, bedrooms: 2, beds: 3, baths: 2, host: 'Kabir', hostInitials: 'KM', hostColor: '#f2c4c4', badge: 'Amazing views', description: 'Trade the city noise for bird song and sunset skies. This warm terrace home is made for long weekends.', amenities: ['Wifi', 'Mountain view', 'Breakfast', 'Free parking'], images: [CURATED_IMAGES[5], CURATED_IMAGES[0], CURATED_IMAGES[4]] },
  { id: 'stay-07', title: 'A calm studio in the heart of Goa', location: 'Assagao, Goa', price: 3100, rating: 4.9, reviews: 101, type: 'Apartment', guests: 2, bedrooms: 1, beds: 1, baths: 1, host: 'Ishita', hostInitials: 'IP', hostColor: '#f6dca9', badge: 'Guest favourite', description: 'A light-filled studio with a shaded veranda, close to Goa\u2019s best bakeries and a short scooter ride from the beach.', amenities: ['Wifi', 'Pool', 'Kitchen', 'Garden'], images: [CURATED_IMAGES[6], CURATED_IMAGES[2], CURATED_IMAGES[1]] },
  { id: 'stay-08', title: 'Glass cabin above the cedar forest', location: 'Naukuchiatal, Uttarakhand', price: 8100, rating: 4.99, reviews: 28, type: 'Cabin', guests: 4, bedrooms: 2, beds: 2, baths: 2, host: 'Dev', hostInitials: 'DS', hostColor: '#c4dfdc', badge: 'Amazing views', description: 'Sleep beside the forest in a glass-walled cabin with a fireplace, a cedar deck, and nothing but green beyond it.', amenities: ['Wifi', 'Mountain view', 'Fireplace', 'Kitchen'], images: [CURATED_IMAGES[7], CURATED_IMAGES[5], CURATED_IMAGES[4]] },
].map(withExtras)

export const EMPTY_HOST_FORM = {
  title: '',
  location: '',
  price: '' as string | number,
  type: 'Home',
  guests: 2 as string | number,
  bedrooms: 1 as string | number,
  description: '',
  image: CURATED_IMAGES[0],
}

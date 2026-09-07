// Static curated content for the Experiences and Services tabs so the top
// navigation feels alive instead of just opening Coming Soon modals.

import { CURATED_IMAGES } from './data'

export interface ExperienceCard {
  id: string
  title: string
  location: string
  price: number
  rating: number
  reviews: number
  duration: string
  category: string
  image: string
  host: string
}

export interface ServiceCard {
  id: string
  title: string
  provider: string
  location: string
  price: number
  rating: number
  reviews: number
  category: string
  image: string
}

export const EXPERIENCES: ExperienceCard[] = [
  { id: 'exp-01', title: 'Old Delhi food walk with a local storyteller', location: 'New Delhi', price: 1900, rating: 4.94, reviews: 213, duration: '3 hours', category: 'Food & drink', image: CURATED_IMAGES[2], host: 'Aditi' },
  { id: 'exp-02', title: 'Sunrise yoga on a hidden Goan beach', location: 'North Goa', price: 1400, rating: 4.98, reviews: 184, duration: '90 minutes', category: 'Wellness', image: CURATED_IMAGES[6], host: 'Kabir' },
  { id: 'exp-03', title: 'Learn to cook a homestyle Punjabi thali', location: 'Amritsar', price: 2400, rating: 4.9, reviews: 96, duration: '4 hours', category: 'Food & drink', image: CURATED_IMAGES[4], host: 'Meera' },
  { id: 'exp-04', title: 'Sunset kayaking through the mangroves', location: 'Alleppey', price: 1800, rating: 4.87, reviews: 121, duration: '2 hours', category: 'Nature', image: CURATED_IMAGES[5], host: 'Dev' },
  { id: 'exp-05', title: 'Rooftop pottery class with chai and stories', location: 'Jaipur', price: 2100, rating: 4.92, reviews: 74, duration: '2.5 hours', category: 'Art & culture', image: CURATED_IMAGES[3], host: 'Ishita' },
  { id: 'exp-06', title: 'Late-night jazz walk in Bandra', location: 'Mumbai', price: 1600, rating: 4.85, reviews: 158, duration: '3 hours', category: 'Music', image: CURATED_IMAGES[0], host: 'Naina' },
  { id: 'exp-07', title: 'Backwater houseboat lunch and slow cruise', location: 'Kumarakom', price: 3200, rating: 4.96, reviews: 62, duration: '4 hours', category: 'Nature', image: CURATED_IMAGES[7], host: 'Arjun' },
  { id: 'exp-08', title: 'Photography walk in the pastel bylanes', location: 'Pondicherry', price: 1500, rating: 4.89, reviews: 89, duration: '2 hours', category: 'Art & culture', image: CURATED_IMAGES[1], host: 'Riya' },
]

export const SERVICES: ServiceCard[] = [
  { id: 'svc-01', title: 'In-home chef for a five-course dinner', provider: 'Chef Meera', location: 'Delhi NCR', price: 4500, rating: 4.97, reviews: 41, category: 'Chef', image: CURATED_IMAGES[3] },
  { id: 'svc-02', title: 'Sunrise portrait session on the beach', provider: 'Kabir Photo Co.', location: 'Goa', price: 3800, rating: 4.92, reviews: 58, category: 'Photography', image: CURATED_IMAGES[6] },
  { id: 'svc-03', title: 'Airport pickup with a curated welcome kit', provider: 'Airbnb Concierge', location: 'Mumbai', price: 2200, rating: 4.88, reviews: 112, category: 'Transport', image: CURATED_IMAGES[0] },
  { id: 'svc-04', title: 'Deep tissue massage at your stay', provider: 'The Green Studio', location: 'Bangalore', price: 3200, rating: 4.94, reviews: 76, category: 'Wellness', image: CURATED_IMAGES[5] },
  { id: 'svc-05', title: 'Personal city guide for a full day', provider: 'Aditi · Local storyteller', location: 'New Delhi', price: 3500, rating: 4.99, reviews: 39, category: 'Guide', image: CURATED_IMAGES[2] },
  { id: 'svc-06', title: 'Hair and makeup for a wedding morning', provider: 'Ishita Studio', location: 'Jaipur', price: 6800, rating: 4.9, reviews: 27, category: 'Beauty', image: CURATED_IMAGES[4] },
]

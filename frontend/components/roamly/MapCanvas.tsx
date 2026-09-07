'use client'

import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L, { type DivIcon } from 'leaflet'
import { Star } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

import type { Listing } from '@/lib/types'
import { formatMoney } from '@/lib/format'

interface MapCanvasProps {
  listings: Listing[]
  onOpen: (listing: Listing) => void
  highlightedId?: string | null
}

const makePriceIcon = (price: number, highlighted: boolean): DivIcon =>
  L.divIcon({
    className: 'roamly-price-marker',
    html: `<div class="roamly-pin ${highlighted ? 'is-active' : ''}">${formatMoney(price)}</div>`,
    iconSize: [72, 32],
    iconAnchor: [36, 32],
  })

const MapCanvas = ({ listings, onOpen, highlightedId = null }: MapCanvasProps) => {
  const pinnedListings = useMemo(
    () => listings.filter((l) => typeof l.lat === 'number' && typeof l.lng === 'number'),
    [listings]
  )

  const center = useMemo<[number, number]>(() => {
    if (pinnedListings.length === 0) return [22.5, 78.9]
    const lat = pinnedListings.reduce((sum, l) => sum + (l.lat ?? 0), 0) / pinnedListings.length
    const lng = pinnedListings.reduce((sum, l) => sum + (l.lng ?? 0), 0) / pinnedListings.length
    return [lat, lng]
  }, [pinnedListings])

  return (
    <MapContainer
      center={center}
      zoom={5}
      scrollWheelZoom
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {pinnedListings.map((listing) => (
        <Marker
          key={listing.id}
          position={[listing.lat as number, listing.lng as number]}
          icon={makePriceIcon(listing.price, highlightedId === listing.id)}
          eventHandlers={{
            click: () => onOpen(listing),
          }}
        >
          <Popup closeButton={false} className="roamly-popup">
            <div
              className="w-[220px] cursor-pointer overflow-hidden rounded-xl"
              onClick={() => onOpen(listing)}
            >
              <img
                src={listing.images?.[0]}
                alt={listing.title}
                className="h-32 w-full object-cover"
              />
              <div className="p-2">
                <div className="flex items-center justify-between text-[13px] font-semibold">
                  <span className="line-clamp-1">{listing.title}</span>
                  <span className="flex shrink-0 items-center gap-1 text-xs">
                    <Star size={11} fill="#222" /> {Number(listing.rating || 0).toFixed(2)}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-[#717171]">{listing.location}</p>
                <p className="mt-1 text-[13px]">
                  <strong>{formatMoney(listing.price)}</strong>{' '}
                  <span className="text-[#717171]">night</span>
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapCanvas

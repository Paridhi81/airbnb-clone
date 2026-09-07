'use client'

import dynamic from 'next/dynamic'
import type { Listing } from '@/lib/types'

// Leaflet touches `window` on import, so we defer to the client only.
const MapCanvas = dynamic(() => import('./MapCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl bg-[#f0f0f0] text-sm text-[#717171]">
      Loading map…
    </div>
  ),
})

interface MapPanelProps {
  listings: Listing[]
  onOpen: (listing: Listing) => void
  highlightedId?: string | null
}

const MapPanel = ({ listings, onOpen, highlightedId = null }: MapPanelProps) => (
  <aside className="hidden min-h-[650px] overflow-hidden rounded-2xl bg-[#f0f0f0] lg:sticky lg:top-36 lg:block">
    <div className="relative h-[calc(100vh-160px)] min-h-[650px] w-full overflow-hidden rounded-2xl">
      <MapCanvas listings={listings} onOpen={onOpen} highlightedId={highlightedId} />
      <div className="pointer-events-none absolute bottom-5 left-5 z-[400] rounded-xl bg-white/95 px-4 py-3 text-sm font-semibold shadow-lg">
        Explore the map <span className="ml-2 text-[#717171]">{listings.length} stays</span>
      </div>
    </div>
  </aside>
)

export default MapPanel

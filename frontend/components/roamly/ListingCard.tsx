'use client'

import { Heart, Star } from 'lucide-react'
import type { Listing } from '@/lib/types'
import { formatMoney } from '@/lib/format'

interface ListingCardProps {
  listing: Listing
  liked: boolean
  onLike: () => void
  onOpen: () => void
}

const ListingCard = ({ listing, liked, onLike, onOpen }: ListingCardProps) => (
  <article className="group cursor-pointer" onClick={onOpen}>
    <div className="relative aspect-[1.02/1] overflow-hidden rounded-2xl bg-[#f1f1f1]">
      <img
        src={listing.images?.[0]}
        alt={listing.title}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
      />
      <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-sm">
        {listing.badge || 'New stay'}
      </div>
      <button
        onClick={(event) => {
          event.stopPropagation()
          onLike()
        }}
        className="absolute right-3 top-3 rounded-full p-1 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.7)] transition hover:scale-110"
        aria-label="Add to wishlist"
      >
        <Heart
          size={25}
          fill={liked ? '#ff385c' : 'rgba(0,0,0,.25)'}
          color={liked ? '#ff385c' : 'white'}
          strokeWidth={1.8}
        />
      </button>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
    </div>
    <div className="px-1 pt-3">
      <div className="flex items-start justify-between gap-2">
        <h2 className="line-clamp-1 text-[15px] font-semibold">{listing.title}</h2>
        <span className="flex shrink-0 items-center gap-1 text-sm">
          <Star size={13} fill="#222" /> {Number(listing.rating || 0).toFixed(2)}
        </span>
      </div>
      <p className="mt-1 text-sm text-[#717171]">{listing.location}</p>
      <p className="mt-2 text-sm">
        <strong>{formatMoney(listing.price)}</strong> night{' '}
        <span className="text-[#717171]">· {listing.reviews || 0} reviews</span>
      </p>
    </div>
  </article>
)

export default ListingCard

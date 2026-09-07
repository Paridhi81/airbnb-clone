'use client'

import { ArrowRight, ChevronLeft, Heart, Minus, Plus, Sparkles, Star, Wifi } from 'lucide-react'
import type { Listing } from '@/lib/types'
import { formatMoney } from '@/lib/format'
import type { BlockedRange } from '@/lib/availability'
import DateRangePicker from './DateRangePicker'

interface ListingDetailProps {
  listing: Listing
  startDate: string
  endDate: string
  onDateChange: (start: string, end: string) => void
  guests: number
  setGuests: (value: number) => void
  nights: number
  total: number
  liked: boolean
  onLike: () => void
  onClose: () => void
  onReserve: () => void
  onMessage: () => void
  blockedRanges: BlockedRange[]
}

const REVIEWS: Array<{ author: string; initials: string; body: string; color: string }> = [
  { author: 'Aditi S.', initials: 'AS', color: '#e5c4ba', body: 'The home was exactly as pictured and beautifully quiet.' },
  { author: 'Sana M.', initials: 'SM', color: '#c6d7f4', body: 'Wonderful host, thoughtful details, and a perfect location.' },
]

const ListingDetail = ({
  listing,
  startDate,
  endDate,
  onDateChange,
  guests,
  setGuests,
  nights,
  total,
  liked,
  onLike,
  onClose,
  onReserve,
  blockedRanges,
}: ListingDetailProps) => (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
    <div className="mx-auto max-w-[1240px] px-5 py-5 lg:px-10">
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 rounded-full px-2 py-2 text-sm font-semibold hover:bg-[#f7f7f7]"
        >
          <ChevronLeft size={18} /> Back to stays
        </button>
        <div className="flex gap-2">
          <button
            onClick={onLike}
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold underline hover:bg-[#f7f7f7]"
          >
            <Heart size={18} fill={liked ? '#ff385c' : 'none'} color={liked ? '#ff385c' : '#222'} />{' '}
            {liked ? 'Saved' : 'Save'}
          </button>
          <button className="rounded-full px-3 py-2 text-sm font-semibold underline hover:bg-[#f7f7f7]">
            <ArrowRight size={18} className="inline rotate-[-45deg]" /> Share
          </button>
        </div>
      </div>

      <div className="mt-5 grid h-[360px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl lg:h-[460px]">
        <img src={listing.images?.[0]} alt="Main view" className="col-span-2 row-span-2 h-full w-full object-cover" />
        {listing.images?.slice(1, 3).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt={`Gallery ${index + 2}`} className="h-full w-full object-cover" />
        ))}
        <div className="relative overflow-hidden">
          <img
            src={listing.images?.[0]}
            alt="Gallery detail"
            className="h-full w-full object-cover brightness-90"
          />
          <span className="absolute bottom-4 right-4 rounded-lg bg-white px-3 py-2 text-xs font-bold">
            View all photos
          </span>
        </div>
      </div>

      <div className="grid gap-10 py-8 lg:grid-cols-[1fr_390px]">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[#717171]">
                {listing.type} in {listing.location}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-[-.6px] lg:text-[30px]">{listing.title}</h1>
              <p className="mt-3 text-sm">
                <strong>{listing.guests} guests</strong> · <strong>{listing.bedrooms} bedrooms</strong> ·{' '}
                <strong>{listing.beds} beds</strong> · <strong>{listing.baths} baths</strong>
              </p>
            </div>
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: listing.hostColor || '#f5d29c' }}
            >
              {listing.hostInitials || 'YO'}
            </div>
          </div>
          <div className="my-8 border-y border-[#eeeeee] py-6">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7f7f7]">
                <Sparkles size={21} />
              </div>
              <div>
                <p className="font-semibold">Hosted by {listing.host || 'your host'}</p>
                <p className="mt-1 text-sm text-[#717171]">A top-rated host · Welcomes you to Airbnb</p>
              </div>
            </div>
          </div>
          <p className="leading-7 text-[#484848]">{listing.description}</p>
          <div className="mt-8">
            <h2 className="text-xl font-semibold">What this place offers</h2>
            <div className="mt-5 grid grid-cols-2 gap-y-5 sm:grid-cols-3">
              {(listing.amenities || []).map((amenity) => (
                <div key={amenity} className="flex items-center gap-3 text-sm">
                  <Wifi size={19} strokeWidth={1.5} />
                  {amenity}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-10 border-t border-[#eeeeee] pt-8">
            <h2 className="text-xl font-semibold">
              <Star size={19} className="mr-1 inline" fill="#222" /> {Number(listing.rating || 0).toFixed(2)} ·{' '}
              {listing.reviews || 0} reviews
            </h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {REVIEWS.map((review) => (
                <div key={review.author} className="rounded-xl bg-[#f7f7f7] p-4 text-sm leading-6">
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs"
                      style={{ backgroundColor: review.color }}
                    >
                      {review.initials}
                    </span>
                    {review.author}
                  </div>
                  {review.body}
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-[#dddddd] p-6 shadow-[0_5px_20px_rgba(0,0,0,.10)] lg:sticky lg:top-5">
          <p className="text-xl">
            <strong>{formatMoney(listing.price)}</strong> <span className="text-sm font-normal">night</span>
          </p>
          <div className="mt-5">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={onDateChange}
              blockedRanges={blockedRanges}
            />
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-[#999999] p-3">
            <span className="text-[10px] font-bold uppercase">Guests</span>
            <span className="flex items-center gap-3">
              <button
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="rounded-full border p-1"
                aria-label="Remove guest"
              >
                <Minus size={14} />
              </button>
              <span className="text-sm">{guests}</span>
              <button
                onClick={() => setGuests(Math.min(listing.guests, guests + 1))}
                className="rounded-full border p-1"
                aria-label="Add guest"
              >
                <Plus size={14} />
              </button>
            </span>
          </div>
          <button
            onClick={onReserve}
            className="mt-5 w-full rounded-xl bg-[#ff385c] py-3.5 font-bold text-white hover:bg-[#e61e4d]"
          >
            Reserve
          </button>
          {nights > 0 ? (
            <div className="mt-5 space-y-3 border-t border-[#eeeeee] pt-5 text-sm">
              <div className="flex justify-between">
                <span className="underline">
                  {formatMoney(listing.price)} × {nights} nights
                </span>
                <span>{formatMoney(nights * listing.price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="underline">Airbnb service fee</span>
                <span>{formatMoney(Math.round(nights * listing.price * 0.14))}</span>
              </div>
              <div className="flex justify-between border-t border-[#eeeeee] pt-4 text-base font-bold">
                <span>Total before taxes</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-center text-xs text-[#717171]">You won’t be charged yet</p>
          )}
        </aside>
      </div>
    </div>
  </div>
)

export default ListingDetail

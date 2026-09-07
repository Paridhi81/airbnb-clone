'use client'

import { Compass } from 'lucide-react'
import Overlay from './Overlay'
import type { Booking } from '@/lib/types'
import { prettyDate } from '@/lib/format'

interface TripsModalProps {
  bookings: Booking[]
  onClose: () => void
}

const TripsModal = ({ bookings, onClose }: TripsModalProps) => (
  <Overlay onClose={onClose} title="My trips">
    <div className="mb-5 rounded-2xl bg-[#fdf1ee] p-5">
      <p className="text-sm font-semibold">Your next adventure is one click away</p>
      <p className="mt-1 text-sm text-[#717171]">Confirmed stays and memorable weekends, all in one place.</p>
    </div>
    {bookings.length ? (
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="flex gap-4 rounded-2xl border border-[#eeeeee] p-3">
            {booking.listingImage && (
              <img
                src={booking.listingImage}
                alt={booking.listingTitle}
                className="h-24 w-28 rounded-xl object-cover"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#717171]">{booking.status}</p>
              <h3 className="mt-1 truncate font-semibold">{booking.listingTitle}</h3>
              <p className="mt-1 text-sm text-[#717171]">{booking.location}</p>
              <p className="mt-2 text-sm font-medium">
                {prettyDate(booking.startDate)} – {prettyDate(booking.endDate)} · {booking.guests} guests
              </p>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="py-12 text-center">
        <Compass className="mx-auto text-[#717171]" size={34} />
        <p className="mt-4 font-semibold">No trips booked yet</p>
        <p className="mt-1 text-sm text-[#717171]">Your next great stay is waiting.</p>
      </div>
    )}
  </Overlay>
)

export default TripsModal

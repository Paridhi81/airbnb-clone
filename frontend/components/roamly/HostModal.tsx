'use client'

import { HousePlus, Trash2 } from 'lucide-react'
import type { FormEvent } from 'react'
import Overlay from './Overlay'
import type { Booking, HostForm, Listing } from '@/lib/types'
import { formatMoney, prettyDate } from '@/lib/format'
import { CURATED_IMAGES } from '@/lib/data'

interface HostModalProps {
  listings: Listing[]
  bookings: Booking[]
  form: HostForm
  setForm: (form: HostForm) => void
  editingId: string | null
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onEdit: (listing: Listing) => void
  onDelete: (id: string) => void
  onComingSoon: (label: string) => void
}

const HostModal = ({
  listings,
  bookings,
  form,
  setForm,
  editingId,
  onClose,
  onSubmit,
  onEdit,
  onDelete,
}: HostModalProps) => (
  <Overlay onClose={onClose} title="Your hosting dashboard" wide>
    <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
      <form onSubmit={onSubmit} className="rounded-2xl bg-[#f7f7f7] p-5">
        <div className="flex items-center gap-2">
          <HousePlus size={20} />
          <h3 className="font-semibold">{editingId ? 'Edit your listing' : 'List your home'}</h3>
        </div>
        <div className="mt-5 space-y-3">
          <input
            required
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
            placeholder="Listing title"
            className="w-full rounded-xl border border-[#dddddd] bg-white px-4 py-3 text-sm"
          />
          <input
            required
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
            placeholder="Location"
            className="w-full rounded-xl border border-[#dddddd] bg-white px-4 py-3 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="number"
              value={form.price}
              onChange={(event) => setForm({ ...form, price: event.target.value })}
              placeholder="Price / night"
              className="w-full rounded-xl border border-[#dddddd] bg-white px-4 py-3 text-sm"
            />
            <select
              value={form.type}
              onChange={(event) => setForm({ ...form, type: event.target.value })}
              className="rounded-xl border border-[#dddddd] bg-white px-4 py-3 text-sm"
            >
              <option>Home</option>
              <option>Apartment</option>
              <option>Villa</option>
              <option>Cabin</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min={1}
              value={form.guests}
              onChange={(event) => setForm({ ...form, guests: event.target.value })}
              placeholder="Guests"
              className="w-full rounded-xl border border-[#dddddd] bg-white px-4 py-3 text-sm"
            />
            <input
              type="number"
              min={1}
              value={form.bedrooms}
              onChange={(event) => setForm({ ...form, bedrooms: event.target.value })}
              placeholder="Bedrooms"
              className="w-full rounded-xl border border-[#dddddd] bg-white px-4 py-3 text-sm"
            />
          </div>
          <input
            value={form.image}
            onChange={(event) => setForm({ ...form, image: event.target.value })}
            placeholder="Photo URL"
            className="w-full rounded-xl border border-[#dddddd] bg-white px-4 py-3 text-sm"
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm({ ...form, description: event.target.value })}
            placeholder="Tell guests about your place"
            rows={3}
            className="w-full resize-none rounded-xl border border-[#dddddd] bg-white px-4 py-3 text-sm"
          />
        </div>
        <button className="mt-4 w-full rounded-xl bg-[#222222] py-3 font-bold text-white">
          {editingId ? 'Save changes' : 'Publish listing'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() =>
              setForm({
                title: '',
                location: '',
                price: '',
                type: 'Home',
                guests: 2,
                bedrooms: 1,
                description: '',
                image: CURATED_IMAGES[0],
              })
            }
            className="mt-2 w-full py-2 text-sm font-semibold underline"
          >
            Cancel editing
          </button>
        )}
      </form>
      <div>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-[#717171]">HOST MODE</p>
            <h3 className="mt-1 text-xl font-semibold">Your listings</h3>
          </div>
          <span className="rounded-full bg-[#fdf1ee] px-3 py-1 text-sm font-semibold">{listings.length} live</span>
        </div>
        {listings.length ? (
          <div className="space-y-3">
            {listings.map((listing) => (
              <div key={listing.id} className="flex items-center gap-3 rounded-xl border border-[#eeeeee] p-3">
                <img src={listing.images?.[0]} alt={listing.title} className="h-16 w-20 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{listing.title}</p>
                  <p className="text-xs text-[#717171]">
                    {listing.location} · {formatMoney(listing.price)} / night
                  </p>
                  <div className="mt-2 flex gap-3">
                    <button onClick={() => onEdit(listing)} className="text-xs font-bold underline">
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(listing.id)}
                      className="flex items-center gap-1 text-xs font-bold text-[#c13515]"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed p-8 text-center text-sm text-[#717171]">
            Publish your first stay to see it here.
          </p>
        )}
        <div className="mt-7 rounded-xl border border-[#eeeeee] p-4">
          <h4 className="font-semibold">Upcoming guest bookings</h4>
          {bookings.length ? (
            bookings.map((booking) => (
              <p key={booking.id} className="mt-3 text-sm text-[#717171]">
                {booking.listingTitle} · {prettyDate(booking.startDate)} – {prettyDate(booking.endDate)}
              </p>
            ))
          ) : (
            <p className="mt-2 text-sm text-[#717171]">Your reservations will show up here.</p>
          )}
        </div>
      </div>
    </div>
  </Overlay>
)

export default HostModal

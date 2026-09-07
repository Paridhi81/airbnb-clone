'use client'

import { CreditCard, ShieldCheck } from 'lucide-react'
import Overlay from './Overlay'
import type { Listing } from '@/lib/types'
import { formatMoney, prettyDate } from '@/lib/format'

interface CheckoutModalProps {
  listing: Listing
  nights: number
  total: number
  startDate: string
  onClose: () => void
  onConfirm: () => void
}

const CheckoutModal = ({ listing, nights, total, startDate, onClose, onConfirm }: CheckoutModalProps) => (
  <Overlay onClose={onClose} title="Confirm and pay">
    <div className="space-y-5">
      <div className="flex gap-4 rounded-2xl border border-[#eeeeee] p-3">
        <img src={listing.images?.[0]} alt={listing.title} className="h-20 w-24 rounded-xl object-cover" />
        <div>
          <p className="font-semibold">{listing.title}</p>
          <p className="mt-1 text-sm text-[#717171]">
            {prettyDate(startDate)} · {nights} nights
          </p>
          <p className="mt-2 text-sm font-semibold">{formatMoney(total)} total</p>
        </div>
      </div>
      <div className="rounded-xl border border-[#dddddd] p-4">
        <div className="flex items-center gap-2 font-semibold">
          <CreditCard size={18} /> Payment details
        </div>
        <input placeholder="Card number" className="mt-4 w-full rounded-lg border border-[#dddddd] px-3 py-3 text-sm" />
        <div className="mt-3 grid grid-cols-2 gap-3">
          <input placeholder="MM / YY" className="rounded-lg border border-[#dddddd] px-3 py-3 text-sm" />
          <input placeholder="CVV" className="rounded-lg border border-[#dddddd] px-3 py-3 text-sm" />
        </div>
      </div>
      <p className="flex items-start gap-2 rounded-xl bg-[#f7f7f7] p-3 text-xs leading-5 text-[#717171]">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-[#222222]" /> This is a mocked checkout. No real
        payment is processed and your card details are not saved.
      </p>
      <button
        onClick={onConfirm}
        className="w-full rounded-xl bg-[#ff385c] py-3.5 font-bold text-white hover:bg-[#e61e4d]"
      >
        Confirm reservation
      </button>
    </div>
  </Overlay>
)

export default CheckoutModal

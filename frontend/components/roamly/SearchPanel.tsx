'use client'

import { Minus, Plus, Search, Users } from 'lucide-react'
import Overlay from './Overlay'

interface SearchPanelProps {
  query: string
  setQuery: (value: string) => void
  guests: number
  setGuests: (value: number) => void
  onClose: () => void
  onSearch: () => void
}

const SearchPanel = ({ query, setQuery, guests, setGuests, onClose, onSearch }: SearchPanelProps) => (
  <Overlay onClose={onClose} title="Search stays">
    <div className="space-y-4">
      <label className="block text-sm font-semibold">
        Where
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by city, neighbourhood, or landmark"
          className="mt-2 w-full rounded-xl border border-[#b0b0b0] px-4 py-3 text-base outline-none focus:border-[#222222]"
          autoFocus
        />
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm font-semibold">
          Check in
          <input type="date" className="mt-2 w-full rounded-xl border border-[#b0b0b0] px-3 py-3 font-normal" />
        </label>
        <label className="text-sm font-semibold">
          Check out
          <input type="date" className="mt-2 w-full rounded-xl border border-[#b0b0b0] px-3 py-3 font-normal" />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Guests
        <div className="mt-2 flex items-center justify-between rounded-xl border border-[#b0b0b0] px-4 py-3">
          <span className="flex items-center gap-2 font-normal">
            <Users size={18} /> {guests || 'Add guests'}
          </span>
          <span className="flex items-center gap-3">
            <button
              onClick={() => setGuests(Math.max(0, guests - 1))}
              className="rounded-full border p-1"
              aria-label="Remove guest"
            >
              <Minus size={15} />
            </button>
            <button onClick={() => setGuests(guests + 1)} className="rounded-full border p-1" aria-label="Add guest">
              <Plus size={15} />
            </button>
          </span>
        </div>
      </label>
      <button
        onClick={onSearch}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff385c] py-3.5 font-bold text-white hover:bg-[#e61e4d]"
      >
        <Search size={18} /> Search stays
      </button>
    </div>
  </Overlay>
)

export default SearchPanel

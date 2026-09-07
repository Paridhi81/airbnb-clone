'use client'

import { Minus, Plus } from 'lucide-react'
import { X } from 'lucide-react'
import type { Filters, PlaceType } from '@/lib/filters'
import {
  AMENITY_OPTIONS,
  DEFAULT_FILTERS,
  PRICE_MAX,
  PRICE_MIN,
  PROPERTY_TYPE_OPTIONS,
  STANDOUT_OPTIONS,
} from '@/lib/filters'
import { formatMoney } from '@/lib/format'

interface FilterPanelProps {
  filters: Filters
  setFilters: (filters: Filters) => void
  matchCount: number
  onClose: () => void
}

const PLACE_TYPES: Array<{ value: PlaceType; label: string; hint: string }> = [
  { value: 'any', label: 'Any type', hint: 'All stays' },
  { value: 'room', label: 'Room', hint: 'A private room in a home' },
  { value: 'entire', label: 'Entire home', hint: 'Have a place all to yourself' },
]

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) => (
  <section className="border-t border-[#eeeeee] py-6">
    <h3 className="text-[17px] font-semibold text-[#222222]">{title}</h3>
    {subtitle && <p className="mt-1 text-[13px] text-[#717171]">{subtitle}</p>}
    <div className="mt-4">{children}</div>
  </section>
)

const Stepper = ({
  label,
  value,
  onChange,
  max = 8,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  max?: number
}) => (
  <div className="flex items-center justify-between py-3">
    <span className="text-[15px] font-medium text-[#222222]">{label}</span>
    <span className="flex items-center gap-4">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= 0}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b0b0b0] text-[#717171] transition hover:border-[#222222] hover:text-[#222222] disabled:opacity-40 disabled:hover:border-[#b0b0b0]"
        aria-label={`Decrease ${label}`}
      >
        <Minus size={14} />
      </button>
      <span className="min-w-[40px] text-center text-[15px] font-medium">
        {value === 0 ? 'Any' : `${value}+`}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b0b0b0] text-[#717171] transition hover:border-[#222222] hover:text-[#222222]"
        aria-label={`Increase ${label}`}
      >
        <Plus size={14} />
      </button>
    </span>
  </div>
)

const Toggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <label className="flex cursor-pointer items-center justify-between py-3">
    <span className="text-[15px] font-medium">{label}</span>
    <span
      className={`relative inline-block h-6 w-11 rounded-full transition ${
        checked ? 'bg-[#222222]' : 'bg-[#dddddd]'
      }`}
      onClick={() => onChange(!checked)}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </span>
  </label>
)

const FilterPanel = ({ filters, setFilters, matchCount, onClose }: FilterPanelProps) => {
  const patch = (partial: Partial<Filters>) => setFilters({ ...filters, ...partial })

  const toggleFromList = (list: string[], value: string): string[] =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-5">
      <div className="flex max-h-[92vh] w-full max-w-[780px] flex-col rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl">
        <header className="flex items-center justify-between border-b border-[#eeeeee] px-6 py-4">
          <button onClick={onClose} className="rounded-full p-2 hover:bg-[#f7f7f7]" aria-label="Close filters">
            <X size={18} />
          </button>
          <h2 className="text-[16px] font-semibold">Filters</h2>
          <span className="w-8" />
        </header>

        <div className="flex-1 overflow-y-auto px-6 pb-8">
          {/* Type of place */}
          <Section title="Type of place">
            <div className="grid grid-cols-3 overflow-hidden rounded-xl border border-[#b0b0b0]">
              {PLACE_TYPES.map((option, i) => {
                const active = filters.placeType === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => patch({ placeType: option.value })}
                    className={`px-4 py-3 text-sm font-medium transition ${
                      active ? 'bg-[#222222] text-white' : 'bg-white text-[#222222] hover:bg-[#f7f7f7]'
                    } ${i !== 0 ? 'border-l border-[#b0b0b0]' : ''}`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Price range */}
          <Section title="Price range" subtitle="Nightly prices before taxes and fees">
            <div className="mb-2 grid grid-cols-2 gap-3">
              <label className="rounded-xl border border-[#b0b0b0] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#717171]">
                Minimum
                <div className="mt-1 flex items-center gap-1 text-[15px] font-normal text-[#222222]">
                  <span>₹</span>
                  <input
                    type="number"
                    min={0}
                    value={filters.minPrice}
                    onChange={(e) => patch({ minPrice: Math.max(0, Number(e.target.value) || 0) })}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </label>
              <label className="rounded-xl border border-[#b0b0b0] px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[#717171]">
                Maximum
                <div className="mt-1 flex items-center gap-1 text-[15px] font-normal text-[#222222]">
                  <span>₹</span>
                  <input
                    type="number"
                    min={0}
                    value={filters.maxPrice}
                    onChange={(e) => patch({ maxPrice: Math.max(0, Number(e.target.value) || 0) })}
                    className="w-full bg-transparent outline-none"
                  />
                </div>
              </label>
            </div>
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={100}
              value={filters.maxPrice}
              onChange={(e) => patch({ maxPrice: Number(e.target.value) })}
              className="mt-4 w-full accent-[#ff385c]"
            />
            <div className="mt-1 flex justify-between text-xs text-[#717171]">
              <span>{formatMoney(PRICE_MIN)}</span>
              <span>{formatMoney(PRICE_MAX)}+</span>
            </div>
          </Section>

          {/* Rooms and beds */}
          <Section title="Rooms and beds">
            <Stepper
              label="Bedrooms"
              value={filters.bedrooms}
              onChange={(n) => patch({ bedrooms: n })}
            />
            <Stepper label="Beds" value={filters.beds} onChange={(n) => patch({ beds: n })} />
            <Stepper
              label="Bathrooms"
              value={filters.baths}
              onChange={(n) => patch({ baths: n })}
            />
          </Section>

          {/* Amenities */}
          <Section title="Amenities">
            <div className="flex flex-wrap gap-2">
              {AMENITY_OPTIONS.map((amenity) => {
                const active = filters.amenities.includes(amenity)
                return (
                  <button
                    key={amenity}
                    onClick={() => patch({ amenities: toggleFromList(filters.amenities, amenity) })}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      active
                        ? 'border-[#222222] bg-[#f7f7f7] font-semibold'
                        : 'border-[#dddddd] hover:border-[#222222]'
                    }`}
                  >
                    {amenity}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Booking options */}
          <Section title="Booking options">
            <Toggle
              label="Instant Book"
              checked={filters.bookingOptions.instantBook}
              onChange={(v) => patch({ bookingOptions: { ...filters.bookingOptions, instantBook: v } })}
            />
            <Toggle
              label="Self check-in"
              checked={filters.bookingOptions.selfCheckIn}
              onChange={(v) => patch({ bookingOptions: { ...filters.bookingOptions, selfCheckIn: v } })}
            />
            <Toggle
              label="Allows pets"
              checked={filters.bookingOptions.petsAllowed}
              onChange={(v) => patch({ bookingOptions: { ...filters.bookingOptions, petsAllowed: v } })}
            />
          </Section>

          {/* Standout stays */}
          <Section title="Standout stays">
            <div className="flex flex-wrap gap-2">
              {STANDOUT_OPTIONS.map((tag) => {
                const active = filters.standoutStays.includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => patch({ standoutStays: toggleFromList(filters.standoutStays, tag) })}
                    className={`rounded-full border px-3 py-2 text-sm transition ${
                      active
                        ? 'border-[#222222] bg-[#f7f7f7] font-semibold'
                        : 'border-[#dddddd] hover:border-[#222222]'
                    }`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </Section>

          {/* Property type */}
          <Section title="Property type">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PROPERTY_TYPE_OPTIONS.map((type) => {
                const active = filters.propertyTypes.includes(type)
                return (
                  <button
                    key={type}
                    onClick={() =>
                      patch({ propertyTypes: toggleFromList(filters.propertyTypes, type) })
                    }
                    className={`rounded-xl border px-3 py-4 text-left text-sm transition ${
                      active
                        ? 'border-[#222222] bg-[#f7f7f7] font-semibold'
                        : 'border-[#dddddd] hover:border-[#222222]'
                    }`}
                  >
                    {type}
                  </button>
                )
              })}
            </div>
          </Section>
        </div>

        <footer className="flex items-center justify-between border-t border-[#eeeeee] px-6 py-4">
          <button
            onClick={() => setFilters({ ...DEFAULT_FILTERS })}
            className="rounded-lg px-2 py-2 text-[15px] font-semibold underline hover:bg-[#f7f7f7]"
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-[#222222] px-6 py-3 text-[15px] font-semibold text-white hover:bg-black"
          >
            Show {matchCount} {matchCount === 1 ? 'stay' : 'stays'}
          </button>
        </footer>
      </div>
    </div>
  )
}

export default FilterPanel

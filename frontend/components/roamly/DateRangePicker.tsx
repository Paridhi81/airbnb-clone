'use client'

import { useMemo, useState } from 'react'
import { DayPicker, type DateRange } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { buildBlockedDates, toISO, type BlockedRange } from '@/lib/availability'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onChange: (start: string, end: string) => void
  blockedRanges: BlockedRange[]
}

const DateRangePicker = ({ startDate, endDate, onChange, blockedRanges }: DateRangePickerProps) => {
  const [open, setOpen] = useState(false)

  const disabledDates = useMemo(() => buildBlockedDates(blockedRanges), [blockedRanges])

  const selected: DateRange | undefined =
    startDate && endDate
      ? { from: new Date(`${startDate}T00:00:00`), to: new Date(`${endDate}T00:00:00`) }
      : startDate
        ? { from: new Date(`${startDate}T00:00:00`), to: undefined }
        : undefined

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      onChange('', '')
      return
    }
    const from = range.from ? toISO(range.from) : ''
    const to = range.to ? toISO(range.to) : ''
    onChange(from, to)
    if (from && to) setOpen(false)
  }

  const label = (v: string) =>
    v
      ? new Date(`${v}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      : 'Add date'

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="grid w-full grid-cols-2 overflow-hidden rounded-xl border border-[#999999] text-left"
      >
        <span className="border-r border-[#999999] p-3">
          <span className="block text-[10px] font-bold uppercase">Check in</span>
          <span className="mt-1 block text-sm text-[#222222]">{label(startDate)}</span>
        </span>
        <span className="p-3">
          <span className="block text-[10px] font-bold uppercase">Check out</span>
          <span className="mt-1 block text-sm text-[#222222]">{label(endDate)}</span>
        </span>
      </button>
      {open && (
        <div className="absolute left-1/2 z-40 mt-2 -translate-x-1/2 rounded-2xl border border-[#dddddd] bg-white p-4 shadow-2xl">
          <DayPicker
            mode="range"
            numberOfMonths={1}
            selected={selected}
            onSelect={handleSelect}
            disabled={[{ before: new Date() }, ...disabledDates]}
            modifiersStyles={{
              range_start: { backgroundColor: '#222222', color: 'white' },
              range_end: { backgroundColor: '#222222', color: 'white' },
              range_middle: { backgroundColor: '#f7f7f7', color: '#222222' },
            }}
          />
          <div className="mt-2 flex items-center justify-between border-t border-[#eeeeee] pt-3 text-xs text-[#717171]">
            <span>
              {blockedRanges.length > 0
                ? `${blockedRanges.length} booked ${blockedRanges.length === 1 ? 'range' : 'ranges'} greyed out`
                : 'All dates open'}
            </span>
            <button
              type="button"
              onClick={() => {
                onChange('', '')
                setOpen(false)
              }}
              className="font-semibold text-[#222222] underline"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DateRangePicker

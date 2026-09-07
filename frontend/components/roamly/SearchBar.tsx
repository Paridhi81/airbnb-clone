'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  query: string
  setQuery: (value: string) => void
  setShowSearchPanel: (value: boolean) => void
  compact?: boolean
}

const SearchBar = ({ query, setShowSearchPanel, compact = false }: SearchBarProps) => (
  <div
    className={`flex items-center rounded-full border border-[#dddddd] bg-white shadow-[0_5px_20px_rgba(0,0,0,.10)] transition hover:shadow-[0_7px_25px_rgba(0,0,0,.14)] ${
      compact ? 'h-14' : 'h-[66px]'
    }`}
  >
    <button onClick={() => setShowSearchPanel(true)} className="min-w-0 flex-1 px-6 text-left">
      <span className="block text-[12px] font-bold">Where</span>
      <span className="block truncate text-sm text-[#717171]">{query || 'Search destinations'}</span>
    </button>
    <span className="h-8 w-px bg-[#dddddd]" />
    <button
      onClick={() => setShowSearchPanel(true)}
      className="hidden min-w-[190px] flex-1 px-6 text-left sm:block"
    >
      <span className="block text-[12px] font-bold">When</span>
      <span className="block text-sm text-[#717171]">Add dates</span>
    </button>
    <span className="hidden h-8 w-px bg-[#dddddd] sm:block" />
    <button
      onClick={() => setShowSearchPanel(true)}
      className="hidden min-w-[150px] flex-1 px-6 text-left md:block"
    >
      <span className="block text-[12px] font-bold">Who</span>
      <span className="block text-sm text-[#717171]">Add guests</span>
    </button>
    <button
      onClick={() => setShowSearchPanel(true)}
      className="mr-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-white transition hover:bg-[#e61e4d]"
      aria-label="Open search"
    >
      <Search size={21} strokeWidth={2.5} />
    </button>
  </div>
)

export default SearchBar

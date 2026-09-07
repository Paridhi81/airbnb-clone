'use client'

import { useState } from 'react'
import { CircleUserRound, Globe2, Menu } from 'lucide-react'
import Logo from './Logo'
import SearchBar from './SearchBar'
import type { Role } from '@/lib/auth'

export type Tab = 'homes' | 'experiences' | 'services'

interface HeaderProps {
  query: string
  setQuery: (value: string) => void
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
  setShowSearchPanel: (value: boolean) => void
  onLogoClick: () => void
  onHost: () => void
  onMenu: () => void
  onComingSoon: (label: string) => void
  role: Role
}

const NAV_ITEMS: Array<{
  label: string
  tab: Tab
  icon: string
  comingSoon?: boolean
}> = [
  { label: 'All', tab: 'homes', icon: '/nav/all.png' },
  { label: 'Homes', tab: 'homes', icon: '/nav/homes.png' },
  { label: 'Experiences', tab: 'experiences', icon: '/nav/experiences.png', comingSoon: true },
  { label: 'Services', tab: 'services', icon: '/nav/services.png', comingSoon: true },
]

const Header = ({
  query,
  setQuery,
  setActiveTab,
  setShowSearchPanel,
  onLogoClick,
  onHost,
  onMenu,
  onComingSoon,
  role,
}: HeaderProps) => {
  const [activeNav, setActiveNav] = useState('Homes')

  return (
    <header className="sticky top-0 z-30 border-b border-[#ebebeb] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
        <Logo
          onClick={() => {
            setActiveNav('Homes')
            onLogoClick()
          }}
        />
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map(({ label, tab, icon, comingSoon }) => {
            const isActive = activeNav === label
            return (
              <button
                key={label}
                onClick={() => {
                  if (comingSoon) {
                    onComingSoon(label)
                    return
                  }
                  setActiveNav(label)
                  setActiveTab(tab)
                }}
                className={`flex items-center gap-2 border-b-[3px] py-5 text-[14px] font-semibold transition ${
                  isActive
                    ? 'border-[#222222] text-[#222222]'
                    : 'border-transparent text-[#6a6a6a] hover:text-[#222222]'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={icon}
                  alt=""
                  width={36}
                  height={36}
                  className={`h-9 w-9 object-contain transition ${isActive ? 'opacity-100' : 'opacity-90'}`}
                  draggable={false}
                />
                {label}
              </button>
            )
          })}
        </nav>
        <div className="flex items-center gap-2.5 text-sm font-semibold">
          <button
            onClick={onHost}
            className="hidden rounded-full px-4 py-3 transition hover:bg-[#f7f7f7] lg:block"
          >
            {role === 'host' ? 'Host dashboard' : 'Airbnb your home'}
          </button>
          <button
            onClick={onMenu}
            className="hidden rounded-full p-3 hover:bg-[#f7f7f7] sm:block"
            aria-label="Language and currency"
          >
            <Globe2 size={19} />
          </button>
          <button
            onClick={onMenu}
            className="flex items-center gap-2 rounded-full border border-[#dddddd] p-2.5 pl-3 shadow-sm transition hover:shadow-md"
            aria-label="Account menu"
          >
            <Menu size={18} />
            <CircleUserRound size={25} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-[880px] px-5 pb-5 md:hidden">
        <SearchBar compact query={query} setQuery={setQuery} setShowSearchPanel={setShowSearchPanel} />
      </div>
      <div className="mx-auto hidden max-w-[850px] px-5 pb-5 md:block">
        <SearchBar query={query} setQuery={setQuery} setShowSearchPanel={setShowSearchPanel} />
      </div>
    </header>
  )
}

export default Header

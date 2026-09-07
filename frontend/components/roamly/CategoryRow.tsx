'use client'

import type { LucideIcon } from 'lucide-react'
import { CATEGORIES, type CategoryIcon } from '@/lib/data'

interface CategoryRowProps {
  activeCategory: string
  setActiveCategory: (label: string) => void
}

const IconOrEmoji = ({ icon }: { icon: CategoryIcon }) =>
  typeof icon === 'string' ? (
    <span className="text-[22px]">{icon}</span>
  ) : (
    (() => {
      const Icon = icon as LucideIcon
      return <Icon size={22} strokeWidth={1.7} />
    })()
  )

const CategoryRow = ({ activeCategory, setActiveCategory }: CategoryRowProps) => (
  <section className="flex items-center gap-7 overflow-x-auto border-b border-[#eeeeee] py-5 scrollbar-none">
    {CATEGORIES.map(({ label, icon }) => {
      const isActive = activeCategory === label
      return (
        <button
          key={label}
          onClick={() => setActiveCategory(label)}
          className={`group flex min-w-fit flex-col items-center gap-2 border-b-2 pb-2 text-xs font-medium transition ${
            isActive
              ? 'border-[#222222] text-[#222222]'
              : 'border-transparent text-[#717171] hover:text-[#222222]'
          }`}
        >
          <IconOrEmoji icon={icon} />
          <span>{label}</span>
        </button>
      )
    })}
  </section>
)

export default CategoryRow

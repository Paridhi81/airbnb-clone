'use client'

import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface OverlayProps {
  children: ReactNode
  onClose: () => void
  title: string
  wide?: boolean
}

const Overlay = ({ children, onClose, title, wide = false }: OverlayProps) => (
  <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-5">
    <div
      className={`max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl ${
        wide ? 'max-w-[900px]' : 'max-w-[510px]'
      }`}
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={onClose} className="rounded-full p-2 hover:bg-[#f7f7f7]" aria-label="Close">
          <X size={20} />
        </button>
      </div>
      {children}
    </div>
  </div>
)

export default Overlay

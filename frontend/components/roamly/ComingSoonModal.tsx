'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ConciergeBell, PartyPopper, Sparkles, X } from 'lucide-react'

interface ComingSoonModalProps {
  label: string
  onClose: () => void
}

const copyFor = (label: string) => {
  const key = label.toLowerCase()
  if (key.includes('experience')) {
    return {
      title: 'Experiences',
      subtitle: 'Coming soon',
      body: 'Unique activities hosted by locals are almost here. Keep exploring Homes while we finish the polish.',
      Icon: PartyPopper,
      accent: 'from-[#FF385C] to-[#E61E4D]',
      soft: 'bg-[#FFF0F3]',
    }
  }
  if (key.includes('service')) {
    return {
      title: 'Services',
      subtitle: 'Coming soon',
      body: 'Chefs, photographers, and pros on demand are almost ready. Browse Homes for now — we’ll notify you when Services launch.',
      Icon: ConciergeBell,
      accent: 'from-[#FF385C] to-[#D70466]',
      soft: 'bg-[#FFF0F3]',
    }
  }
  return {
    title: label,
    subtitle: 'Coming soon',
    body: 'We’re still polishing this part of the experience. Explore Homes, save favourites, or become a host in the meantime.',
    Icon: Sparkles,
    accent: 'from-[#FF385C] to-[#E61E4D]',
    soft: 'bg-[#FFF0F3]',
  }
}

const ComingSoonModal = ({ label, onClose }: ComingSoonModalProps) => {
  const { title, subtitle, body, Icon, accent, soft } = copyFor(label)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6">
        <motion.button
          type="button"
          aria-label="Dismiss"
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="coming-soon-title"
          className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-t-[28px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:rounded-[28px]"
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        >
          <div className={`relative h-36 bg-gradient-to-br ${accent}`}>
            <div className="absolute -right-8 -top-10 h-40 w-40 rounded-full bg-white/15" />
            <div className="absolute -bottom-6 left-8 h-24 w-24 rounded-full bg-white/10" />
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-white/30"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <motion.div
              className={`absolute bottom-0 left-1/2 flex h-[72px] w-[72px] -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full ${soft} text-[#FF385C] shadow-lg ring-4 ring-white`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 420, damping: 22 }}
            >
              <Icon size={32} strokeWidth={1.7} />
            </motion.div>
          </div>

          <div className="px-8 pb-8 pt-14 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#FF385C]">
              {subtitle}
            </p>
            <h2 id="coming-soon-title" className="mt-2 text-[26px] font-semibold tracking-[-0.4px] text-[#222]">
              {title}
            </h2>
            <p className="mx-auto mt-3 max-w-[320px] text-[15px] leading-6 text-[#717171]">{body}</p>

            <button
              onClick={onClose}
              className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#FF385C] to-[#E61E4D] px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_8px_20px_rgba(255,56,92,0.35)] transition hover:brightness-105 active:scale-[0.99]"
            >
              Back to Homes
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ComingSoonModal

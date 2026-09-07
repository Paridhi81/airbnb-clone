'use client'

import { CalendarDays, HousePlus, KeyRound, MessageCircle, Repeat, ShieldCheck } from 'lucide-react'
import Overlay from './Overlay'
import type { DemoUser, Role } from '@/lib/auth'

interface MenuModalProps {
  user: DemoUser
  onClose: () => void
  onTrips: () => void
  onHost: () => void
  onSwitchRole: (role: Role) => void
  onComingSoon: (label: string) => void
}

const MenuModal = ({ user, onClose, onTrips, onHost, onSwitchRole, onComingSoon }: MenuModalProps) => {
  const isHost = user.role === 'host'
  return (
    <Overlay onClose={onClose} title="Account">
      <div className="overflow-hidden rounded-2xl border border-[#eeeeee]">
        <div className="flex items-center gap-3 bg-[#f7f7f7] p-4">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full font-semibold"
            style={{ backgroundColor: user.color }}
          >
            {user.initials}
          </div>
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-[#717171]">
              {isHost ? 'Host mode' : 'Guest mode'} · Demo account
            </p>
          </div>
        </div>
        <button
          onClick={() => onSwitchRole(isHost ? 'guest' : 'host')}
          className="flex w-full items-center gap-3 border-b border-[#eeeeee] bg-[#fdf1ee] px-4 py-4 text-left text-sm font-semibold hover:bg-[#f9e6e0]"
        >
          <Repeat size={18} /> Switch to {isHost ? 'guest' : 'host'} mode
          <span className="ml-auto text-xs text-[#717171]">
            {isHost ? 'Browse & book stays' : 'List and manage your homes'}
          </span>
        </button>
        <button
          onClick={onTrips}
          className="flex w-full items-center gap-3 border-b border-[#eeeeee] px-4 py-4 text-left text-sm font-semibold hover:bg-[#f7f7f7]"
        >
          <CalendarDays size={18} /> My trips
        </button>
        <button
          onClick={() => onComingSoon('Messaging with hosts')}
          className="flex w-full items-center gap-3 border-b border-[#eeeeee] px-4 py-4 text-left text-sm font-semibold hover:bg-[#f7f7f7]"
        >
          <MessageCircle size={18} /> Messages
          <span className="ml-auto rounded-full bg-[#fdf1ee] px-2 py-1 text-[10px]">Coming soon</span>
        </button>
        <button
          onClick={() => onComingSoon('Identity verification')}
          className="flex w-full items-center gap-3 border-b border-[#eeeeee] px-4 py-4 text-left text-sm font-semibold hover:bg-[#f7f7f7]"
        >
          <ShieldCheck size={18} /> Verify identity
          <span className="ml-auto rounded-full bg-[#fdf1ee] px-2 py-1 text-[10px]">Coming soon</span>
        </button>
        <button
          onClick={onHost}
          className="flex w-full items-center gap-3 border-b border-[#eeeeee] px-4 py-4 text-left text-sm font-semibold hover:bg-[#f7f7f7]"
        >
          <HousePlus size={18} /> {isHost ? 'Open host dashboard' : 'Airbnb your home'}
        </button>
        <button
          onClick={() => onComingSoon('Log in and sign up')}
          className="flex w-full items-center gap-3 px-4 py-4 text-left text-sm font-semibold hover:bg-[#f7f7f7]"
        >
          <KeyRound size={18} /> Log in or sign up
        </button>
      </div>
    </Overlay>
  )
}

export default MenuModal

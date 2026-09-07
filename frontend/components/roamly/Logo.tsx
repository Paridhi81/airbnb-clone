'use client'

interface LogoProps {
  onClick?: () => void
}

const Logo = ({ onClick }: LogoProps) => (
  <button onClick={onClick} className="flex items-center" aria-label="Airbnb home">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/airbnb-logo.png"
      alt="Airbnb"
      width={102}
      height={32}
      className="h-8 w-auto object-contain object-left"
      draggable={false}
    />
  </button>
)

export default Logo

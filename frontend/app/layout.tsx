import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Airbnb — Vacation rentals, cabins, beach houses & more',
  description: 'Find stays worth remembering on Airbnb.',
}

interface RootLayoutProps {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => (
  <html lang="en">
    <body>{children}</body>
  </html>
)

export default RootLayout

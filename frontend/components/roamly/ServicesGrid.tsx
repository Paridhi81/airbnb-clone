'use client'

interface ServicesGridProps {
  onComingSoon?: (label: string) => void
}

const ServicesGrid = (_props: ServicesGridProps) => (
  <section className="flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
    <h1 className="text-[28px] font-semibold tracking-[-0.5px]">Coming Soon</h1>
    <p className="mt-2 max-w-md text-[15px] text-[#717171]">
      Services are on the way. For now, explore Homes to find your next stay.
    </p>
  </section>
)

export default ServicesGrid

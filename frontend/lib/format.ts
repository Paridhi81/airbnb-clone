// Small formatting helpers used across the marketplace UI.

export const formatMoney = (amount: number | string | null | undefined): string =>
  `₹${Number(amount ?? 0).toLocaleString('en-IN')}`

export const nightsBetween = (start: string, end: string): number => {
  if (!start || !end) return 0
  const startMs = new Date(`${start}T00:00:00`).getTime()
  const endMs = new Date(`${end}T00:00:00`).getTime()
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return 0
  const days = Math.ceil((endMs - startMs) / 86_400_000)
  return days > 0 ? days : 0
}

export const prettyDate = (value: string | null | undefined): string => {
  if (!value) return 'Add date'
  const parsed = new Date(`${value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return 'Add date'
  return parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

// Convert snake_case keys returned by the FastAPI backend into camelCase
// keys expected by our TypeScript types. Leaves already-camelCase objects
// untouched. Returns the input typed as T for ergonomic call-sites.
const SNAKE_TO_CAMEL: Record<string, string> = {
  host_initials: 'hostInitials',
  host_color: 'hostColor',
  host_id: 'hostId',
  listing_id: 'listingId',
  listing_title: 'listingTitle',
  listing_image: 'listingImage',
  guest_id: 'guestId',
  guest_name: 'guestName',
  start_date: 'startDate',
  end_date: 'endDate',
}

export const normalizeListing = <T>(raw: T): T => {
  if (!raw || typeof raw !== 'object') return raw
  const source = raw as unknown as Record<string, unknown>
  const out: Record<string, unknown> = { ...source }
  for (const [snake, camel] of Object.entries(SNAKE_TO_CAMEL)) {
    if (snake in out && !(camel in out)) {
      out[camel] = out[snake]
    }
  }
  return out as unknown as T
}


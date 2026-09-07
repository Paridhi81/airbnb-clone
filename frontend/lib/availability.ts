// Blocked-date helpers used by the reservation calendar.

export interface BlockedRange {
  startDate: string // YYYY-MM-DD
  endDate: string   // YYYY-MM-DD (exclusive of check-out)
}

const toISO = (d: Date): string => d.toISOString().slice(0, 10)

export const parseDate = (value: string): Date => new Date(`${value}T00:00:00`)

export const buildBlockedDates = (ranges: BlockedRange[]): Date[] => {
  const dates: Date[] = []
  for (const range of ranges) {
    const start = parseDate(range.startDate)
    const end = parseDate(range.endDate)
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d))
    }
  }
  return dates
}

export const rangeOverlapsBlocked = (
  start: string,
  end: string,
  blocked: BlockedRange[]
): boolean => {
  if (!start || !end) return false
  const s = parseDate(start).getTime()
  const e = parseDate(end).getTime()
  return blocked.some((b) => {
    const bs = parseDate(b.startDate).getTime()
    const be = parseDate(b.endDate).getTime()
    return s < be && e > bs
  })
}

export const nextAvailableDate = (from: Date, blocked: Date[]): Date => {
  const set = new Set(blocked.map((d) => toISO(d)))
  const d = new Date(from)
  while (set.has(toISO(d))) d.setDate(d.getDate() + 1)
  return d
}

export { toISO }

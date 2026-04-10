export function formatTaskDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' })
  const day = d.getDate()
  const month = d.toLocaleDateString('en-US', { month: 'long' })
  const year = d.getFullYear()
  return `${weekday} ${day}, ${month} ${year}`
}

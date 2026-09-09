export function contentDate(
  value: string | null | undefined,
): {dateTime: string; label: string} | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return {
    dateTime: date.toISOString(),
    label: new Intl.DateTimeFormat('en', {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date),
  }
}

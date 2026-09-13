export function contentDate(
  value: string | null | undefined,
  includeDay = false,
): {dateTime: string; label: string} | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return {
    dateTime: date.toISOString(),
    label: new Intl.DateTimeFormat(includeDay ? 'en-US' : 'en', {
      month: 'short',
      day: includeDay ? 'numeric' : undefined,
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date),
  }
}

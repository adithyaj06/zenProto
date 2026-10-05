export const JOURNAL_ENTRIES_KEY = 'zenproto_entries'

export function loadJournalEntries() {
  try {
    const parsed = JSON.parse(localStorage.getItem(JOURNAL_ENTRIES_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    return []
  }
}

export function saveJournalEntries(entries) {
  try {
    localStorage.setItem(JOURNAL_ENTRIES_KEY, JSON.stringify(entries))
  } catch (error) {
    const message = error?.name === 'QuotaExceededError'
      ? 'Browser storage is full. Remove an image or delete old entries, then try again.'
      : 'Browser storage is unavailable. Check your browser privacy settings and try again.'
    throw new Error(message)
  }
}

export function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function getLocalDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getJournalStreak(entries) {
  const entryDates = new Set(
    entries
      .map(entry => new Date(entry.createdAt))
      .filter(date => !Number.isNaN(date.getTime()))
      .map(getLocalDateKey)
  )

  const today = new Date()
  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const yesterday = new Date(currentDate)
  yesterday.setDate(yesterday.getDate() - 1)
  const streakStart = entryDates.has(getLocalDateKey(currentDate)) ? currentDate : yesterday

  if (!entryDates.has(getLocalDateKey(streakStart))) return 0

  let streak = 0
  const date = new Date(streakStart)
  while (entryDates.has(getLocalDateKey(date))) {
    streak += 1
    date.setDate(date.getDate() - 1)
  }

  return streak
}


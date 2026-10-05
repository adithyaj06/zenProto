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

export async function readApiResponse(res) {
  const responseText = await res.text()
  let data = {}

  if (responseText) {
    try {
      data = JSON.parse(responseText)
    } catch (e) {
      throw new Error(`API returned an invalid response (${res.status})`)
    }
  }

  if (!res.ok) {
    if (res.status === 500) {
      throw new Error('Could not reach the API server. Run npm run start:server in a second terminal.')
    }
    throw new Error(data.error || `Request failed (${res.status})`)
  }

  return data
}

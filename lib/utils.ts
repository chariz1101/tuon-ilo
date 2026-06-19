import type { AmenityStatus, LocationType, NoiseLevel } from '@/types'

/**
 * Formats an average rating to one decimal place.
 * Returns "No ratings yet" if there are no reviews.
 */
export function formatAverageRating(
  average: number | null,
  reviewCount: number
): string {
  if (reviewCount === 0 || average === null) return 'No ratings yet'
  return `${average.toFixed(1)} ★ (${reviewCount} ${
    reviewCount === 1 ? 'review' : 'reviews'
  })`
}

/**
 * Returns a star string like "★★★★☆" for a given rating.
 * Rounds to the nearest whole star.
 */
export function ratingToStars(average: number | null): string {
  if (average === null) return '☆☆☆☆☆'
  const rounded = Math.round(average)
  return '★'.repeat(rounded) + '☆'.repeat(5 - rounded)
}

/**
 * Tailwind classes for amenity badges (Wi-Fi / Charging).
 * FREE = green, PAID = amber, NONE = gray.
 */
export function amenityBadgeColor(status: AmenityStatus): string {
  switch (status) {
    case 'FREE':
      return 'bg-green-100 text-green-800 border-green-300'
    case 'PAID':
      return 'bg-amber-100 text-amber-800 border-amber-300'
    case 'NONE':
      return 'bg-gray-100 text-gray-600 border-gray-300'
  }
}

/**
 * Tailwind classes for location type badges.
 * CAFE = orange, STUDY_HUB = blue.
 */
export function locationTypeBadgeColor(type: LocationType): string {
  switch (type) {
    case 'CAFE':
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'STUDY_HUB':
      return 'bg-blue-100 text-blue-800 border-blue-300'
  }
}

/**
 * Tailwind classes for noise level badges.
 * QUIET = blue, MODERATE = yellow, LIVELY = red.
 */
export function noiseLevelBadgeColor(level: NoiseLevel): string {
  switch (level) {
    case 'QUIET':
      return 'bg-sky-100 text-sky-800 border-sky-300'
    case 'MODERATE':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    case 'LIVELY':
      return 'bg-red-100 text-red-800 border-red-300'
  }
}

/**
 * Hex color for the map pin marker, based on location type.
 * Used directly in SVG fill, not Tailwind.
 */
export function pinColor(type: LocationType): string {
  return type === 'CAFE' ? '#f97316' : '#3b82f6' // orange-500 / blue-500
}

/**
 * Formats a "HH:MM:SS" or "HH:MM" time string into "8:00 AM" style.
 */
export function formatTime(time: string | null): string {
  if (!time) return ''
  const [hourStr, minuteStr] = time.split(':')
  const hour = parseInt(hourStr, 10)
  const minute = minuteStr ?? '00'
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${minute} ${period}`
}

/**
 * Returns a human-readable hours string for a location.
 * "Open 24 hours" or "8:00 AM – 10:00 PM".
 */
export function formatHours(
  is24Hours: boolean,
  openingTime: string | null,
  closingTime: string | null
): string {
  if (is24Hours) return 'Open 24 hours'
  if (!openingTime || !closingTime) return 'Hours not listed'
  return `${formatTime(openingTime)} – ${formatTime(closingTime)}`
}

/**
 * Generates (or retrieves) a persistent anonymous session ID
 * stored in localStorage, used to prevent duplicate reviews.
 */
export function getOrCreateSessionId(): string {
  const key = 'tuon_ilo_session_id'
  let sessionId = localStorage.getItem(key)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(key, sessionId)
  }
  return sessionId
}

/**
 * Truncates long text (e.g. review comments in a table) to a max length.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { AmenityStatus, LocationType, NoiseLevel } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

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

export function ratingToStars(average: number | null): string {
  if (average === null) return '☆☆☆☆☆'
  const rounded = Math.round(average)
  return '★'.repeat(rounded) + '☆'.repeat(5 - rounded)
}

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

export function locationTypeBadgeColor(type: LocationType): string {
  switch (type) {
    case 'CAFE':
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'STUDY_HUB':
      return 'bg-blue-100 text-blue-800 border-blue-300'
  }
}

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

export function pinColor(type: LocationType): string {
  return type === 'CAFE' ? '#92400e' : '#7c3aed'
}

export function formatTime(time: string | null): string {
  if (!time) return ''
  const [hourStr, minuteStr] = time.split(':')
  const hour = parseInt(hourStr, 10)
  const minute = minuteStr ?? '00'
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 === 0 ? 12 : hour % 12
  return `${displayHour}:${minute} ${period}`
}

export function formatHours(
  is24Hours: boolean,
  openingTime: string | null,
  closingTime: string | null
): string {
  if (is24Hours) return 'Open 24 hours'
  if (!openingTime || !closingTime) return 'Hours not listed'
  return `${formatTime(openingTime)} – ${formatTime(closingTime)}`
}

export function getOrCreateSessionId(): string {
  const key = 'tuon_ilo_session_id'
  let sessionId = localStorage.getItem(key)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(key, sessionId)
  }
  return sessionId
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}…`
}

/**
 * Converts an ISO timestamp into a relative string like
 * "Just now", "3 hours ago", "2 days ago", "3 weeks ago".
 */
export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)

  if (diffSeconds < 60) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`
  return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`
}
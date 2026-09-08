'use client'

import { useEffect, useState } from 'react'
import { X, Link as LinkIcon, MapPin as MapPinIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import {
  amenityBadgeColor,
  locationTypeBadgeColor,
  noiseLevelBadgeColor,
  formatHours,
  ratingToStars,
  formatAverageRating,
} from '@/lib/utils'
import type { Location } from '@/types'
import ReviewList from '@/components/location/ReviewList'
import ReviewForm from '@/components/location/ReviewForm'

interface LocationCardProps {
  location: Location
  onClose: () => void
}

export default function LocationCard({ location, onClose }: LocationCardProps) {
  const [averageRating, setAverageRating] = useState<number | null>(null)
  const [reviewCount, setReviewCount] = useState(0)
  const [loadingRating, setLoadingRating] = useState(true)

  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    async function fetchRating() {
      setLoadingRating(true)
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('location_id', location.id)

      if (!error && data) {
        setReviewCount(data.length)
        if (data.length > 0) {
          const sum = data.reduce((acc, r) => acc + r.rating, 0)
          setAverageRating(sum / data.length)
        } else {
          setAverageRating(null)
        }
      }
      setLoadingRating(false)
    }

    fetchRating()
  }, [location.id, refreshKey])

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Drag affordance for the mobile bottom sheet */}
      <div className="shrink-0 pt-2 md:hidden">
        <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-200" />
      </div>

      <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-4 py-3 md:px-5">
        <h2 className="min-w-0 break-words text-lg font-semibold leading-tight md:text-xl">
          {location.name}
        </h2>
        <button
          onClick={onClose}
          className="-mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
        {location.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={location.image_url}
            alt={location.name}
            className="h-40 w-full object-cover sm:h-48"
          />
        )}

        <div className="space-y-4 px-4 py-4 md:px-5">
          <div className="flex flex-wrap gap-1.5">
            <Badge className={locationTypeBadgeColor(location.type)}>
              {location.type === 'CAFE' ? 'Cafe' : 'Study Hub'}
            </Badge>
            <Badge className={amenityBadgeColor(location.wifi_status)}>
              Wi-Fi: {location.wifi_status}
            </Badge>
            <Badge className={amenityBadgeColor(location.charging_status)}>
              Charging: {location.charging_status}
            </Badge>
            {location.noise_level && (
              <Badge className={noiseLevelBadgeColor(location.noise_level)}>
                {location.noise_level}
              </Badge>
            )}
          </div>

          {loadingRating ? (
            <p className="text-sm text-slate-400">Loading rating...</p>
          ) : (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-amber-500">{ratingToStars(averageRating)}</span>
              <span className="text-sm text-slate-600">
                {formatAverageRating(averageRating, reviewCount)}
              </span>
            </div>
          )}

          <div className="space-y-1.5 text-sm text-slate-700">
            <p className="break-words">
              🕐{' '}
              {formatHours(
                location.is_24_hours,
                location.opening_time,
                location.closing_time
              )}
            </p>
            {location.pricing_details && (
              <p className="break-words">💰 {location.pricing_details}</p>
            )}
            {location.contact_info && (
              <p className="break-words">📞 {location.contact_info}</p>
            )}
          </div>

          {(location.facebook_url ||
            location.instagram_url ||
            location.gmaps_url) && (
            <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-100 pt-4">
              {location.facebook_url && (
                <ExternalLink href={location.facebook_url} hoverClass="hover:text-blue-600">
                  <LinkIcon className="h-4 w-4" />
                  Facebook
                </ExternalLink>
              )}
              {location.instagram_url && (
                <ExternalLink href={location.instagram_url} hoverClass="hover:text-pink-600">
                  <LinkIcon className="h-4 w-4" />
                  Instagram
                </ExternalLink>
              )}
              {location.gmaps_url && (
                <ExternalLink href={location.gmaps_url} hoverClass="hover:text-red-600">
                  <MapPinIcon className="h-4 w-4" />
                  Directions
                </ExternalLink>
              )}
            </div>
          )}

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <p className="text-sm font-medium">Reviews</p>
            <ReviewList locationId={location.id} refreshKey={refreshKey} />
            <ReviewForm
              locationId={location.id}
              onReviewSubmitted={() => setRefreshKey((k) => k + 1)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function Badge({
  className,
  children,
}: {
  className: string
  children: React.ReactNode
}) {
  return (
    <span
      className={`rounded border px-2 py-0.5 text-xs whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  )
}

function ExternalLink({
  href,
  hoverClass,
  children,
}: {
  href: string
  hoverClass: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-1.5 text-xs text-slate-500 ${hoverClass}`}
    >
      {children}
    </a>
  )
}

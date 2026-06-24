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
    <div className="relative">
      <button
        onClick={onClose}
        className="absolute right-3 top-3 z-10 rounded-full bg-white p-1.5 shadow hover:bg-slate-100"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>

      {location.image_url && (
        <img
          src={location.image_url}
          alt={location.name}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="space-y-4 p-5">
        <div>
          <h2 className="text-xl font-semibold">{location.name}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={`rounded border px-2 py-0.5 text-xs ${locationTypeBadgeColor(
                location.type
              )}`}
            >
              {location.type}
            </span>
            <span
              className={`rounded border px-2 py-0.5 text-xs ${amenityBadgeColor(
                location.wifi_status
              )}`}
            >
              Wi-Fi: {location.wifi_status}
            </span>
            <span
              className={`rounded border px-2 py-0.5 text-xs ${amenityBadgeColor(
                location.charging_status
              )}`}
            >
              Charging: {location.charging_status}
            </span>
            {location.noise_level && (
              <span
                className={`rounded border px-2 py-0.5 text-xs ${noiseLevelBadgeColor(
                  location.noise_level
                )}`}
              >
                {location.noise_level}
              </span>
            )}
          </div>
        </div>

        <div>
          {loadingRating ? (
            <p className="text-sm text-slate-400">Loading rating...</p>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-amber-500">
                {ratingToStars(averageRating)}
              </span>
              <span className="text-sm text-slate-600">
                {formatAverageRating(averageRating, reviewCount)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-1 text-sm text-slate-700">
          <p>🕐 {formatHours(location.is_24_hours, location.opening_time, location.closing_time)}</p>
          {location.pricing_details && <p>💰 {location.pricing_details}</p>}
          {location.contact_info && <p>📞 {location.contact_info}</p>}
        </div>

        {(location.facebook_url || location.instagram_url || location.gmaps_url) && (
          <div className="flex gap-3 border-t pt-4">
            {location.facebook_url && (
              
                <a href={location.facebook_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-600"
              >
                <LinkIcon className="h-4 w-4" />
                Facebook
              </a>
            )}
            {location.instagram_url && (
              
                <a href={location.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-pink-600"
              >
                <LinkIcon className="h-4 w-4" />
                Instagram
              </a>
            )}
            {location.gmaps_url && (
              
                <a href={location.gmaps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600"
              >
                <MapPinIcon className="h-4 w-4" />
                Directions
              </a>
            )}
          </div>
        )}
<div className="space-y-3 border-t pt-4">
  <p className="text-sm font-medium">Reviews</p>
  <ReviewList locationId={location.id} refreshKey={refreshKey} />
  <ReviewForm
    locationId={location.id}
    onReviewSubmitted={() => setRefreshKey((k) => k + 1)}
  />
</div>

      </div>
    </div>
  )
}
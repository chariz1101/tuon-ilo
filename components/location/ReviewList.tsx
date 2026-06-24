'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ratingToStars, formatRelativeDate } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewListProps {
  locationId: string
  // Bumping this number from the parent triggers a refetch
  refreshKey?: number
}

export default function ReviewList({ locationId, refreshKey }: ReviewListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true)
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('location_id', locationId)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setReviews((data ?? []) as Review[])
      }
      setLoading(false)
    }

    fetchReviews()
  }, [locationId, refreshKey])

  if (loading) {
    return <p className="text-sm text-slate-400">Loading reviews...</p>
  }

  if (error) {
    return <p className="text-sm text-red-600">Failed to load reviews.</p>
  }

  if (reviews.length === 0) {
    return (
      <p className="rounded border border-dashed p-4 text-center text-sm text-slate-500">
        No reviews yet. Be the first to leave one!
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <span className="text-amber-500">{ratingToStars(review.rating)}</span>
            <span className="text-xs text-slate-400">
              {formatRelativeDate(review.created_at)}
            </span>
          </div>
          {review.comment && (
            <p className="mt-1.5 text-sm text-slate-700">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  )
}
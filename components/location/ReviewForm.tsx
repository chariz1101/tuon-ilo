'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getOrCreateSessionId } from '@/lib/utils'
import { reviewSchema } from '@/lib/validations'
import { Button } from '@/components/ui/button'

interface ReviewFormProps {
  locationId: string
  onReviewSubmitted: () => void
}

export default function ReviewForm({ locationId, onReviewSubmitted }: ReviewFormProps) {
  const [sessionId, setSessionId] = useState('')
  const [checkingExisting, setCheckingExisting] = useState(true)
  const [alreadyReviewed, setAlreadyReviewed] = useState(false)

  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [comment, setComment] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const id = getOrCreateSessionId()
    setSessionId(id)

    async function checkExistingReview() {
      const { data } = await supabase
        .from('reviews')
        .select('id')
        .eq('location_id', locationId)
        .eq('session_id', id)
        .maybeSingle()

      setAlreadyReviewed(!!data)
      setCheckingExisting(false)
    }

    checkExistingReview()
  }, [locationId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')

    const parsed = reviewSchema.safeParse({
      location_id: locationId,
      rating,
      comment,
      session_id: sessionId,
    })

    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message ?? 'Invalid review')
      return
    }

    setSubmitting(true)

    const { error } = await supabase.from('reviews').insert({
      ...parsed.data,
      comment: parsed.data.comment || null,
    })

    setSubmitting(false)

    if (error) {
      setSubmitError(error.message)
      return
    }

    setSuccess(true)
    setAlreadyReviewed(true)
    onReviewSubmitted()
  }

  if (checkingExisting) {
    return <p className="text-sm text-slate-400">Checking...</p>
  }

  if (success) {
    return (
      <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
        Thanks for your review!
      </p>
    )
  }

  if (alreadyReviewed) {
    return (
      <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
        You&apos;ve already reviewed this place.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4">
      <p className="text-sm font-medium">Leave a review</p>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
          >
            <Star
              className="h-6 w-6"
              fill={(hoveredStar || rating) >= star ? '#f59e0b' : 'none'}
              stroke="#f59e0b"
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={3}
        className="w-full rounded-md border px-3 py-2 text-sm"
      />

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}

      <Button type="submit" disabled={submitting || rating === 0} className="w-full">
        {submitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}
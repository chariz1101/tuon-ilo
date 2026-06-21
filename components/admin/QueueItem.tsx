'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  amenityBadgeColor,
  locationTypeBadgeColor,
  formatHours,
} from '@/lib/utils'
import type { Location } from '@/types'

export default function QueueItem({ location }: { location: Location }) {
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const router = useRouter()

  async function handleApprove() {
    setLoading('approve')
    await fetch('/api/admin/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: location.id }),
    })
    setLoading(null)
    router.refresh()
  }

  async function handleReject() {
    setLoading('reject')
    await fetch('/api/admin/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: location.id }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{location.name}</CardTitle>
          <span
            className={`rounded border px-2 py-0.5 text-xs ${locationTypeBadgeColor(
              location.type
            )}`}
          >
            {location.type}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
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
        </div>

        <div className="text-sm text-slate-600">
          <p>
            📍 {location.latitude}, {location.longitude}
          </p>
          {location.pricing_details && <p>💰 {location.pricing_details}</p>}
          {location.contact_info && <p>📞 {location.contact_info}</p>}
          <p>
            🕐{' '}
            {formatHours(
              location.is_24_hours,
              location.opening_time,
              location.closing_time
            )}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleApprove}
            disabled={loading !== null}
            className="flex-1"
          >
            {loading === 'approve' ? 'Approving...' : 'Approve'}
          </Button>
          <Button
            onClick={handleReject}
            disabled={loading !== null}
            variant="destructive"
            className="flex-1"
          >
            {loading === 'reject' ? 'Rejecting...' : 'Reject'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
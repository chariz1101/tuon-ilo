'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { amenityBadgeColor } from '@/lib/utils'
import type { Location } from '@/types'

export default function ManageTable({
  locations,
}: {
  locations: Location[]
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete(id: string, name: string) {
    const confirmed = window.confirm(
      `Delete "${name}"? This will also remove all its reviews. This cannot be undone.`
    )
    if (!confirmed) return

    setDeletingId(id)
    await fetch('/api/admin/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setDeletingId(null)
    router.refresh()
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Wi-Fi</TableHead>
            <TableHead>Charging</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((location) => (
            <TableRow key={location.id}>
              <TableCell className="font-medium">{location.name}</TableCell>
              <TableCell>{location.type}</TableCell>
              <TableCell>
                <span
                  className={`rounded border px-2 py-0.5 text-xs ${amenityBadgeColor(
                    location.wifi_status
                  )}`}
                >
                  {location.wifi_status}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={`rounded border px-2 py-0.5 text-xs ${amenityBadgeColor(
                    location.charging_status
                  )}`}
                >
                  {location.charging_status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/dashboard/manage/${location.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === location.id}
                    onClick={() => handleDelete(location.id, location.name)}
                  >
                    {deletingId === location.id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
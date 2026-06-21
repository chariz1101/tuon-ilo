import { supabase } from '@/lib/supabase'
import QueueItem from '@/components/admin/QueueItem'
import type { Location } from '@/types'

export const dynamic = 'force-dynamic'

export default async function QueuePage() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('is_approved', false)
    .order('created_at', { ascending: false })

  const pendingLocations = (data ?? []) as Location[]

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-1 text-2xl font-semibold">Pending Queue</h1>
        <p className="mb-8 text-slate-600">
          Review public submissions before they go live on the map.
        </p>

        {error && (
          <p className="text-sm text-red-600">
            Failed to load submissions: {error.message}
          </p>
        )}

        {!error && pendingLocations.length === 0 && (
          <p className="rounded-lg border border-dashed p-8 text-center text-slate-500">
            No pending submissions right now.
          </p>
        )}

        <div className="space-y-4">
          {pendingLocations.map((location) => (
            <QueueItem key={location.id} location={location} />
          ))}
        </div>
      </div>
    </main>
  )
}
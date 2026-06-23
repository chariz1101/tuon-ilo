import { supabase } from '@/lib/supabase'
import ManageTable from '@/components/admin/ManageTable'
import type { Location } from '@/types'

export const dynamic = 'force-dynamic'

export default async function ManagePage() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('is_approved', true)
    .order('name', { ascending: true })

  const liveLocations = (data ?? []) as Location[]

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-1 text-2xl font-semibold">Manage Spots</h1>
        <p className="mb-8 text-slate-600">
          Edit or remove locations that are currently live on the map.
        </p>

        {error && (
          <p className="text-sm text-red-600">
            Failed to load spots: {error.message}
          </p>
        )}

        {!error && liveLocations.length === 0 && (
          <p className="rounded-lg border border-dashed p-8 text-center text-slate-500">
            No live spots yet. Add one to get started.
          </p>
        )}

        {!error && liveLocations.length > 0 && (
          <ManageTable locations={liveLocations} />
        )}
      </div>
    </main>
  )
}
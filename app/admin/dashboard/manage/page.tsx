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
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="mb-1 text-xl font-semibold sm:text-2xl">Manage Spots</h1>
        <p className="mb-6 text-sm text-slate-600 sm:mb-8 sm:text-base">
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
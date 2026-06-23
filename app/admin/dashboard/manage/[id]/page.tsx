import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AddLocationForm from '@/components/admin/AddLocationForm'
import type { Location } from '@/types'

export const dynamic = 'force-dynamic'

export default async function EditSpotPage({
  params,
}: {
  params: { id: string }
}) {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    notFound()
  }

  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-2xl font-semibold">Edit Spot</h1>
        <AddLocationForm existingLocation={data as Location} />
      </div>
    </main>
  )
}
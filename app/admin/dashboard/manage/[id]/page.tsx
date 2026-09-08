import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AddLocationForm from '@/components/admin/AddLocationForm'
import type { Location } from '@/types'

export const dynamic = 'force-dynamic'

export default async function EditSpotPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="mb-6 text-xl font-semibold sm:text-2xl">Edit Spot</h1>
        <AddLocationForm existingLocation={data as Location} />
      </div>
    </main>
  )
}
import AddLocationForm from '@/components/admin/AddLocationForm'

export default function AddSpotPage() {
  return (
    <main className="px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-2xl font-semibold">Add a New Spot</h1>
        <AddLocationForm />
      </div>
    </main>
  )
}
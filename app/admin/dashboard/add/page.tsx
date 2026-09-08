import AddLocationForm from '@/components/admin/AddLocationForm'

export default function AddSpotPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <div>
        <h1 className="mb-6 text-xl font-semibold sm:text-2xl">Add a New Spot</h1>
        <AddLocationForm />
      </div>
    </main>
  )
}
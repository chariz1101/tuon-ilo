import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-1 text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mb-8 text-slate-600">
          Welcome back. Manage Tuon.ILO spots and submissions here.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <Link href="/admin/dashboard/add">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Add Spot</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Add a new location directly — goes live immediately.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/dashboard/queue">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Pending Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Review and approve or reject public submissions.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/dashboard/manage">
            <Card className="transition hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Manage Spots</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Edit or delete spots that are already live on the map.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  )
}
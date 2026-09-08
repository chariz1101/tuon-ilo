import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const SECTIONS = [
  {
    href: '/admin/dashboard/add',
    title: 'Add Spot',
    description: 'Add a new location directly — goes live immediately.',
  },
  {
    href: '/admin/dashboard/queue',
    title: 'Pending Queue',
    description: 'Review and approve or reject public submissions.',
  },
  {
    href: '/admin/dashboard/manage',
    title: 'Manage Spots',
    description: 'Edit or delete spots that are already live on the map.',
  },
]

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <h1 className="mb-1 text-xl font-semibold sm:text-2xl">Admin Dashboard</h1>
      <p className="mb-6 text-sm text-slate-600 sm:mb-8 sm:text-base">
        Welcome back. Manage Tuon.ILO spots and submissions here.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className="block">
            <Card className="h-full transition hover:border-slate-300 hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{section.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}

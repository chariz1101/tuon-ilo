import Link from 'next/link'

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white px-6 py-3">
        <div className="mx-auto flex max-w-3xl items-center gap-6">
          <Link href="/admin/dashboard" className="font-semibold">
            Tuon.ILO Admin
          </Link>
          <div className="flex gap-4 text-sm text-slate-600">
            <Link href="/admin/dashboard/add" className="hover:text-slate-900">
              Add Spot
            </Link>
            <Link href="/admin/dashboard/queue" className="hover:text-slate-900">
              Queue
            </Link>
            <Link href="/admin/dashboard/manage" className="hover:text-slate-900">
              Manage
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
import Link from 'next/link'

const NAV_LINKS = [
  { href: '/admin/dashboard/add', label: 'Add Spot' },
  { href: '/admin/dashboard/queue', label: 'Queue' },
  { href: '/admin/dashboard/manage', label: 'Manage' },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
          <Link href="/admin/dashboard" className="font-semibold">
            Tuon.ILO <span className="font-normal text-slate-400">Admin</span>
          </Link>
          <nav className="-mx-1 flex gap-1 overflow-x-auto text-sm">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </div>
  )
}

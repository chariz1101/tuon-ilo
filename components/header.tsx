import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "About Me", href: "/about" },
];

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-100 bg-[#FDFBF8]">
      <div className="mx-auto max-w-[1000px] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-[14px] font-semibold text-zinc-900 tracking-tight hover:text-emerald-700 transition-colors duration-200">
          charchives
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[13px] font-medium text-zinc-500 hover:text-zinc-900 transition-colors duration-200"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
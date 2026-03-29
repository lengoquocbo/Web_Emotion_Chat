import { LogIn } from 'lucide-react'
import { Link } from 'react-router-dom'

const navLinks = [
  { href: '#features', label: 'Features' },
  { href: '#experience', label: 'Experience' },
  { href: '#community', label: 'Community' },
  { href: '#about', label: 'About' },
]

export default function LandingHeader() {
  return (
    <div className="fixed left-0 top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-sm font-bold text-white shadow-md">
            E
          </div>
          <div>
            <div className="font-semibold">Emotion AI</div>
            <div className="text-xs text-slate-500">Modern Experience Platform</div>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-slate-900">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
          <Link
            to="/register"
            className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Register
          </Link>
        </div>
      </header>
    </div>
  )
}

import { NavLink } from 'react-router-dom'
import {
  BarChart2,
  Bot,
  ChevronRight,
  CircleHelp,
  Home,
  MessageCircleMore,
  Shield,
  Sparkles,
  User,
  Users,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Home', path: '/home', icon: Home },
  { label: 'AI Support', path: '/ai', icon: Bot },
  { label: 'Groups', path: '/groups', icon: Users },
  { label: 'Friends', path: '/friends', icon: MessageCircleMore },
  { label: 'Analytics', path: '/analytics', icon: BarChart2 },
  { label: 'Profile', path: '/profile', icon: User },
]

const Sidebar = () => (
  <aside className="flex w-full flex-col gap-6 rounded-[2rem] bg-white/92 p-5 shadow-[0_24px_55px_rgba(15,23,42,0.08)] lg:h-full lg:w-[250px] lg:p-6">
    <div>
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
          <Sparkles className="size-5" />
        </div>
        <div>
          <h1 className="text-[1.7rem] font-semibold tracking-tight text-sky-800">Sanctuary</h1>
          <p className="text-sm text-slate-400">Your Digital Sanctuary</p>
        </div>
      </div>
    </div>

    <nav className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
      {navItems.map(({ label, path, icon: Icon }) => (
        <NavLink key={path} to={path} className="shrink-0 lg:w-full">
          {({ isActive }) => (
            <Button
              variant="ghost"
              className={`h-12 w-full justify-start gap-3 rounded-2xl px-4 text-sm transition ${
                isActive
                  ? 'bg-slate-100 text-sky-800 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.12)]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <Icon className={`size-4 ${isActive ? 'text-sky-700' : 'text-slate-400'}`} />
              <span>{label}</span>
            </Button>
          )}
        </NavLink>
      ))}
    </nav>

    <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,#3f79aa_0%,#2f6797_100%)] p-5 text-white shadow-[0_18px_36px_rgba(47,103,151,0.35)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Daily Ritual</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight">Daily Check-in</h2>
      <p className="mt-2 text-sm leading-6 text-white/75">
        Pause for one minute and log how your heart feels today.
      </p>
      <Button className="mt-5 h-11 w-full rounded-full bg-white text-sky-800 hover:bg-sky-50">
        Start Check-in
        <ChevronRight className="size-4" />
      </Button>
    </div>

    <div className="mt-auto flex flex-col gap-2 pt-2">
      <button className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-50 hover:text-slate-600">
        <Shield className="size-4" />
        <span>Privacy</span>
      </button>
      <button className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-50 hover:text-slate-600">
        <CircleHelp className="size-4" />
        <span>Help</span>
      </button>
    </div>
  </aside>
)

export default Sidebar

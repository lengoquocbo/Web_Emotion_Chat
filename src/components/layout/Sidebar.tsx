import { NavLink } from 'react-router-dom'
import {
  BarChart2,
  Bot,
  Bell,
  ChevronRight,
  Home,
  LogOut,
  MessageCircleMore,
  Sparkles,
  User,
  Users,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/auth/useAuth'
import { LogoutService } from '@/services/authService'

const navItems = [
  { label: 'Home', path: '/home', icon: Home },
  { label: 'AI Support', path: '/ai', icon: Bot },
  { label: 'Groups', path: '/groups', icon: Users },
  { label: 'Friends', path: '/friends', icon: MessageCircleMore },
  { label: 'Analytics', path: '/analytics', icon: BarChart2 },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Profile', path: '/profile', icon: User },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    try {
      await LogoutService()
    } catch {
      // ignore logout transport errors and clear local auth state
    } finally {
      logout()
      navigate('/login', { replace: true })
    }
  }

  return (
    <aside className="flex w-full flex-col gap-6 rounded-[2rem] bg-white/92 p-5 shadow-[0_24px_55px_rgba(15,23,42,0.08)] lg:h-screen lg:w-[250px] lg:shrink-0 lg:overflow-hidden lg:p-6">
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

      <nav className="app-scrollbar flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
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
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="size-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

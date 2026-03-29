import { Bell, Settings } from 'lucide-react'

export default function ProfileHeader() {
  return (
    <header className="rounded-[2rem] bg-white/90 px-6 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Personal Space</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-800">Your Profile</h1>
          <p className="mt-2 max-w-2xl text-base leading-7 text-slate-500">
            A calm place to review your progress, update preferences, and manage how Sanctuary supports you.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex size-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:text-slate-700">
            <Bell className="size-4" />
          </button>
          <button className="flex size-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:text-slate-700">
            <Settings className="size-4" />
          </button>
        </div>
      </div>
    </header>
  )
}

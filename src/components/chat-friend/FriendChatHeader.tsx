import { Bell, Phone, Settings, Video } from 'lucide-react'

import { quickActions } from './chat-friend-data'

export default function FriendChatHeader() {
  return (
    <header className="rounded-[2rem] bg-white/90 px-6 py-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-100 via-rose-50 to-orange-100 text-base font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            LN
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Linh Nguyen</h1>
            <div className="mt-1 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-slate-400">
              <span className="size-2 rounded-full bg-emerald-500" />
              Active now
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {quickActions.map((action) => (
            <button
              key={action}
              className="rounded-full bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200"
            >
              {action}
            </button>
          ))}
          <button className="flex size-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:text-slate-700">
            <Phone className="size-4" />
          </button>
          <button className="flex size-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:text-slate-700">
            <Video className="size-4" />
          </button>
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

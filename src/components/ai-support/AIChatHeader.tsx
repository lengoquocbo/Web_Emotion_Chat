import { Bell, Settings } from 'lucide-react'

export default function AIChatHeader() {
  return (
    <header className="rounded-[2rem] bg-white/90 px-6 py-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-sky-200 text-sky-800 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]">
            <div className="flex size-9 items-center justify-center rounded-full bg-sky-700 text-white">
              <Settings className="size-4" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-800">AI Companion</h1>
            <div className="mt-1 flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-slate-400">
              <span className="size-2 rounded-full bg-emerald-500" />
              Online &amp; Listening
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 md:justify-end">
          <button className="flex size-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:text-slate-700">
            <Bell className="size-4" />
          </button>
          <button className="flex size-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:text-slate-700">
            <Settings className="size-4" />
          </button>
          <div className="flex items-center gap-3 rounded-full border border-sky-200 bg-white px-1.5 py-1.5 shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
            <div className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 via-amber-50 to-sky-100 text-sm font-semibold text-slate-700">
              AN
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

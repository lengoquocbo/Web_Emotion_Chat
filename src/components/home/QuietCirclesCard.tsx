import { Plus } from 'lucide-react'

import { circles } from './home-data'

export default function QuietCirclesCard() {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Quiet Circles
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-800">Find a safe space today</h3>
        </div>
        <button className="flex size-12 items-center justify-center rounded-full bg-sky-700 text-white shadow-[0_12px_24px_rgba(3,105,161,0.2)] transition hover:bg-sky-800">
          <Plus className="size-5" />
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {circles.map((circle) => (
          <button
            key={circle.name}
            className="flex w-full items-center gap-3 rounded-2xl px-1 py-1 text-left transition hover:bg-slate-50"
          >
            <div
              className={`flex size-11 items-center justify-center rounded-full text-sm font-semibold ${circle.tone}`}
            >
              {circle.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-800">{circle.name}</p>
              <p className="text-xs text-slate-400">{circle.stats}</p>
            </div>
            <span className="text-lg text-slate-300">{'>'}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

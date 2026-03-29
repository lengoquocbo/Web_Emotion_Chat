import { weeklyGrowth } from './home-data'

export default function WeeklyGrowthCard() {
  return (
    <section className="rounded-[2rem] bg-slate-50 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Your Weekly Growth
      </p>
      <div className="mt-6 flex h-28 items-end gap-2">
        {weeklyGrowth.map((height, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t-full ${index === 3 ? 'bg-sky-700' : 'bg-slate-300'}`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Current Streak</p>
          <p className="mt-1 text-xs leading-6 text-slate-400">
            You&apos;re doing better than 85% of users this week. Keep up the calm momentum!
          </p>
        </div>
        <p className="text-3xl font-semibold tracking-tight text-sky-700">4 Days</p>
      </div>
    </section>
  )
}

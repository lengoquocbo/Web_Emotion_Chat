import { weeklyStats } from './profile-data'

export default function ProfileStatsGrid() {
  return (
    <section className="grid grid-cols-2 gap-4 min-w-0">
      {weeklyStats.map((stat) => (
        <article
          key={stat.label}
          className="min-h-[150px] rounded-[1.75rem] bg-white p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] ring-1 ring-slate-100"
        >
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ring-1 ${stat.tone}`}>
            {stat.label}
          </span>
          <p className="mt-8 text-4xl font-semibold tracking-tight text-slate-800">{stat.value}</p>
        </article>
      ))}
    </section>
  )
}

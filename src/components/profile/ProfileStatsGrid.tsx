import { weeklyStats } from './profile-data'

export default function ProfileStatsGrid() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {weeklyStats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-[1.75rem] bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
        >
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${stat.tone}`}>
            {stat.label}
          </span>
          <p className="mt-5 text-4xl font-semibold tracking-tight text-slate-800">{stat.value}</p>
        </article>
      ))}
    </section>
  )
}

import { Brain, Leaf, Plus } from 'lucide-react'

import { groupTopics } from './groups-data'

const icons = [Leaf, Brain, Plus]

export default function GroupTopicBar() {
  return (
    <section className="flex flex-col gap-4 rounded-[2rem] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-6 py-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)]">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-sm font-medium uppercase tracking-[0.24em] text-slate-400">Focusing On:</div>
        <div className="flex flex-wrap gap-3">
          {groupTopics.map((topic, index) => {
            const Icon = icons[index]

            return (
              <button
                key={topic.label}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-lg shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 ${topic.tone}`}
              >
                <Icon className="size-4" />
                {topic.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex justify-center">
        <span className="rounded-full bg-slate-100 px-6 py-3 text-base text-slate-500">
          Session started: Finding peace in the present moment
        </span>
      </div>
    </section>
  )
}

import QuietCirclesCard from './QuietCirclesCard'
import { storyTags } from './home-data'
import WeeklyGrowthCard from './WeeklyGrowthCard'

export default function HomeRightPanel() {
  return (
    <aside className="space-y-5">
      <WeeklyGrowthCard />
      <QuietCirclesCard />

      <div className="flex flex-wrap gap-2">
        {storyTags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-fuchsia-100 px-4 py-2 text-sm font-medium text-fuchsia-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </aside>
  )
}

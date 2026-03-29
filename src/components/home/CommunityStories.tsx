import StoryCard from './StoryCard'
import { stories } from './home-data'

export default function CommunityStories() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-800">Community Stories</h2>
          <p className="mt-1 text-sm text-slate-500">
            Gentle reflections from people growing one day at a time.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-full bg-slate-100 p-1">
          <button className="rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition hover:text-slate-700">
            Recent
          </button>
          <button className="rounded-full bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm">
            Popular
          </button>
        </div>
      </div>

      {stories.map((story) => (
        <StoryCard key={story.author} story={story} />
      ))}
    </div>
  )
}

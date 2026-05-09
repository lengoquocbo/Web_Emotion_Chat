import { Bookmark, Heart, MessageSquare, MoreHorizontal, Share2 } from 'lucide-react'

import thienImage from '@/assets/img/thien.jpg'

type Story = {
  author: string
  initials: string
  meta: string
  avatarTone: string
  avatarUrl?: string | null
  content?: string
  quote?: string
  image?: boolean
  likes: number
  comments: number
  saved?: boolean
  liked?: boolean
  shared?: boolean
}

type StoryCardProps = {
  story: Story
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <article className="rounded-[2rem] bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex size-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${story.avatarTone} text-sm font-semibold text-slate-700`}
          >
            {story.avatarUrl ? (
              <img src={story.avatarUrl} alt={story.author} className="size-full object-cover" />
            ) : (
              story.initials
            )}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{story.author}</h3>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{story.meta}</p>
          </div>
        </div>
        <button className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      {story.content ? (
        <div className="mt-5 space-y-4 text-slate-600">
          <p className="text-lg leading-8">{story.content}</p>
          {story.image ? (
            <div className="overflow-hidden rounded-[1.75rem]">
              <img
                src={thienImage}
                alt="Meditation by the lake"
                className="h-[320px] w-full object-cover object-center"
              />
            </div>
          ) : null}
        </div>
      ) : (
        <blockquote className="mt-5 border-l-4 border-emerald-300 pl-4 text-lg italic leading-8 text-slate-600">
          {story.quote}
        </blockquote>
      )}

      <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-5">
          <div className={`flex items-center gap-2 ${story.liked ? 'text-emerald-600' : ''}`}>
            <Heart className={`size-4 ${story.liked ? 'fill-current' : ''}`} />
            <span>{story.likes}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="size-4" />
            <span>{story.comments}</span>
          </div>
        </div>
        {story.shared ? <Share2 className="size-4" /> : <Bookmark className="size-4" />}
      </div>
    </article>
  )
}

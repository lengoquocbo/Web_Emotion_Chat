import { Heart, MessageSquare, PenSquare } from 'lucide-react'

import { myStories } from './profile-data'

export default function ProfileMyStories() {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">My Story</p>
          <h3 className="mt-2 text-3xl font-semibold tracking-tight text-slate-800">
            Những bài đăng của bạn
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Một nơi để nhìn lại những điều bạn đã chia sẻ với cộng đồng.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-full bg-sky-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-900">
          <PenSquare className="size-4" />
          Viết bài mới
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {myStories.map((story) => (
          <article
            key={story.id}
            className="rounded-[1.75rem] bg-slate-50 px-5 py-5 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.7)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${story.tone}`}>
                  {story.category}
                </span>
                <h4 className="mt-3 text-2xl font-semibold tracking-tight text-slate-800">
                  {story.title}
                </h4>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">{story.excerpt}</p>
              </div>
              <span className="text-sm text-slate-400">{story.time}</span>
            </div>

            <div className="mt-5 flex items-center gap-5 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Heart className="size-4" />
                <span>{story.likes}</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4" />
                <span>{story.comments}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

import { Heart, Sparkles } from 'lucide-react'

import { friendMessages } from './chat-friend-data'

export default function FriendConversation() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(180deg,#f7fbff_0%,#fbfdff_100%)] px-5 py-6 shadow-[0_18px_48px_rgba(15,23,42,0.05)] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute right-0 top-0 h-48 w-48 rounded-full bg-sky-100/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-56 w-56 rounded-full bg-fuchsia-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-4xl space-y-8">
        <div className="flex justify-center">
          <span className="rounded-full bg-white/80 px-5 py-2 text-sm text-slate-400 shadow-sm">Today</span>
        </div>

        {friendMessages.map((message) => {
          const isSelf = message.role === 'self'

          return (
            <div key={message.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[min(100%,720px)] ${isSelf ? 'items-end' : 'items-start'} flex flex-col`}>
                <div
                  className={`rounded-[2rem] px-6 py-5 text-[1.04rem] leading-8 shadow-[0_18px_42px_rgba(15,23,42,0.06)] ${
                    isSelf
                      ? 'bg-sky-800 text-white'
                      : 'bg-white text-slate-700'
                  }`}
                >
                  {message.text}
                </div>
                <span className={`mt-2 px-2 text-sm text-slate-400 ${isSelf ? 'text-right' : 'text-left'}`}>
                  {message.time}
                </span>
              </div>
            </div>
          )
        })}

        <div className="rounded-[1.75rem] bg-white/85 px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-600">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Gentle Nudge</p>
              <p className="mt-1 text-sm leading-7 text-slate-500">
                You both tend to feel calmer after short grounding prompts. Want to save this moment as a comfort ritual?
              </p>
            </div>
            <button className="ml-auto flex size-10 items-center justify-center rounded-full bg-slate-100 text-rose-500 transition hover:bg-rose-50">
              <Heart className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

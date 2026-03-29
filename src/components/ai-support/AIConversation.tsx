import { Sparkles, Wind } from 'lucide-react'

import { chatMessages } from './ai-support-data'

type MessageRole = 'assistant' | 'user'

function MessageBubble({
  role,
  text,
  time,
}: {
  role: MessageRole
  text: string
  time: string
}) {
  const isAssistant = role === 'assistant'

  return (
    <div className={`flex items-center gap-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant ? (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-500 shadow-[0_10px_24px_rgba(217,70,239,0.16)]">
          <Sparkles className="size-4" />
        </div>
      ) : null}

      <div
        className={`max-w-[min(100%,760px)] rounded-[2rem] px-7 py-7 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${
          isAssistant
            ? 'bg-white text-slate-800'
            : 'bg-sky-100/75 text-sky-900 ring-1 ring-sky-200/80'
        }`}
      >
        <p className="text-[1.08rem] leading-9">{text}</p>
        <p className={`mt-3 text-sm ${isAssistant ? 'text-slate-400' : 'text-sky-700/65'}`}>{time}</p>
      </div>
    </div>
  )
}

export default function AIConversation() {
  return (
    <section className="relative overflow-hidden rounded-[2.25rem] bg-[linear-gradient(180deg,#eef6ff_0%,#f7fbff_30%,#fcfdff_100%)] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(191,219,254,0.55),transparent_60%)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl space-y-8">
        <div className="flex justify-center">
          <span className="rounded-full bg-white/70 px-6 py-2 text-sm font-medium text-slate-500 shadow-sm">
            Today
          </span>
        </div>

        <div className="space-y-10">
          {chatMessages.map((message) => (
            <MessageBubble
              key={message.id}
              role={message.role}
              text={message.text}
              time={message.time}
            />
          ))}
        </div>

        <div className="flex justify-center pt-6">
          <button className="group flex h-40 w-40 flex-col items-center justify-center rounded-full border border-slate-100 bg-white text-sky-800 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_54px_rgba(15,23,42,0.12)]">
            <Wind className="size-7 transition group-hover:scale-110" />
            <span className="mt-3 text-sm font-semibold uppercase tracking-[0.2em]">Breathe</span>
          </button>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { Sparkles } from 'lucide-react'

import type { AIMessage } from './ai-support-data'

function MessageBubble({ message }: { message: AIMessage }) {
  const isAssistant = message.role === 'assistant'

  return (
    <div className={`flex items-end gap-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant ? (
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-500 shadow-[0_10px_24px_rgba(217,70,239,0.16)]">
          <Sparkles className="size-4" />
        </div>
      ) : null}

      <div
        className={`max-w-[min(100%,760px)] rounded-[2rem] px-6 py-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${
          isAssistant
            ? 'bg-white text-slate-800'
            : 'bg-sky-100/75 text-sky-900 ring-1 ring-sky-200/80'
        }`}
      >
        <p className="text-base leading-8 md:text-[1.05rem]">{message.text}</p>
        <p className={`mt-3 text-sm ${isAssistant ? 'text-slate-400' : 'text-sky-700/65'}`}>
          {message.time}
        </p>
      </div>
    </div>
  )
}

type AIConversationProps = {
  messages: AIMessage[]
}

export default function AIConversation({ messages }: AIConversationProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  return (
    <section className="relative overflow-hidden rounded-[2.25rem]  px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(191,219,254,0.55),transparent_60%)]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-white/70 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl space-y-8">
        <div className="flex justify-center">
          <span className="rounded-full bg-white/70 px-6 py-2 text-sm font-medium text-slate-500 shadow-sm">
            Guided check-in session
          </span>
        </div>

        <div className="space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        <div ref={bottomRef} />
      </div>
    </section>
  )
}

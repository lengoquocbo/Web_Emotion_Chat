import { useMemo, useState } from 'react'
import { MessageSquarePlus, Search, Sparkles } from 'lucide-react'

import { checkInStepLabels, type AIThread } from './ai-support-data'

type AIChatSidebarProps = {
  threads: AIThread[]
  activeThreadId: string | null
  onNewChat: () => void
  onSelectThread: (threadId: string) => void
}

export default function AIChatSidebar({
  threads,
  activeThreadId,
  onNewChat,
  onSelectThread,
}: AIChatSidebarProps) {
  const [query, setQuery] = useState('')

  const filteredThreads = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return threads
    }

    return threads.filter((thread) => {
      const haystack = `${thread.title} ${thread.preview}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [query, threads])

  return (
    <aside className="flex min-h-0 flex-col rounded-[2rem] bg-[#ffffff] p-5 text-blue-900 shadow-[0_24px_55px_rgba(15,23,42,0.18)]">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-sky-200">
          <Sparkles className="size-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-900/45">AI Support</p>
          <h2 className="text-xl font-semibold tracking-tight">Phien check-in</h2>
        </div>
      </div>

      <button
        onClick={onNewChat}
        className="mt-6 flex h-12 items-center justify-center gap-2 rounded-2xl bg-white/10 text-sm font-medium text-blue-900 transition hover:bg-white/15"
      >
        <MessageSquarePlus className="size-4" />
        Phien moi
      </button>

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-blue-900/35" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tim phien..."
          className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-blue-900 outline-none placeholder:text-blue-900/35"
        />
      </div>

      <div className="mt-6 flex-1 overflow-y-auto pr-1">
        {threads.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 px-4 py-5 text-sm leading-6 text-blue-900/60">
            Chua co phien nao. Khi ban bat dau check-in, lich su cac phien se hien o day.
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-white/5 px-4 py-5 text-sm leading-6 text-blue-900/60">
            Khong tim thay phien phu hop voi tu khoa hien tai.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredThreads.map((thread) => {
              const isActive = thread.id === activeThreadId

              return (
                <button
                  key={thread.id}
                  onClick={() => onSelectThread(thread.id)}
                  className={`w-full rounded-[1.5rem] px-4 py-4 text-left transition ${
                    isActive
                      ? 'bg-white text-blue-900 shadow-[0_14px_24px_rgba(15,23,42,0.18)]'
                      : 'bg-white/5 text-blue-900 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-blue-900">{thread.title}</p>
                      <p
                        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                          isActive ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {checkInStepLabels[thread.stage === 'idle' ? 'emotion' : thread.stage]}
                      </p>
                    </div>
                    <span className={`shrink-0 text-xs ${isActive ? 'text-blue-700' : 'text-blue-900/45'}`}>
                      {thread.updatedAt}
                    </span>
                  </div>
                  <p className={`mt-2 truncate text-sm ${isActive ? 'text-blue-800' : 'text-blue-900/60'}`}>
                    {thread.preview}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}

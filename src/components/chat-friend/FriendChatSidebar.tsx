import { Search } from 'lucide-react'

import { friendThreads } from './chat-friend-data'

export default function FriendChatSidebar() {
  return (
    <aside className="rounded-[2rem] bg-white/92 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Private Chats</p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-800">Friends</h2>
      </div>

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search a friend..."
          className="h-12 w-full rounded-full bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="mt-6 space-y-3">
        {friendThreads.map((thread) => (
          <button
            key={thread.name}
            className={`flex w-full items-center gap-3 rounded-[1.5rem] px-4 py-4 text-left transition ${
              thread.active ? 'bg-sky-50 shadow-[inset_0_0_0_1px_rgba(186,230,253,0.8)]' : 'hover:bg-slate-50'
            }`}
          >
            <div
              className={`flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${thread.tone} text-sm font-semibold text-slate-700`}
            >
              {thread.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate font-semibold text-slate-800">{thread.name}</p>
                <span className="text-xs text-slate-400">{thread.time}</span>
              </div>
              <p className="mt-1 truncate text-sm text-slate-500">{thread.preview}</p>
            </div>
            {thread.unread ? (
              <span className="flex size-6 items-center justify-center rounded-full bg-sky-700 text-xs font-semibold text-white">
                {thread.unread}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </aside>
  )
}

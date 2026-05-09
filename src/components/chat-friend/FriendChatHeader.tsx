import { Info } from 'lucide-react'

import { usePresence } from '@/hooks/chat/usePresence'
import type { UserSummaryDto } from '@/types/friendship'

interface FriendChatHeaderProps {
  friend: UserSummaryDto | null
  onOpenProfile: () => void
}

function buildInitials(friend: UserSummaryDto | null) {
  const base = friend?.displayName || friend?.username || 'FR'
  return base
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
}

export default function FriendChatHeader({
  friend,
  onOpenProfile,
}: FriendChatHeaderProps) {
  const { isOnline } = usePresence()
  const online = friend ? isOnline(friend.id) : false

  return (
    <header className="rounded-[1.6rem] bg-white/90 px-4 py-3 shadow-[0_14px_36px_rgba(15,23,42,0.06)] backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-fuchsia-100 via-rose-50 to-orange-100 text-xs font-semibold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
            {friend?.avatarUrl ? (
              <img
                src={friend.avatarUrl}
                alt={friend.displayName || friend.username}
                className="size-full object-cover"
              />
            ) : (
              buildInitials(friend)
            )}
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-slate-800">
              {friend?.displayName || friend?.username || 'Choose a friend'}
            </h1>
            <div className="mt-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
              <span className={`size-2 rounded-full ${online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              {friend ? (online ? 'Active now' : 'Offline') : 'No conversation selected'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenProfile}
          disabled={!friend}
          className="flex size-9 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_8px_18px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Info className="size-4" />
        </button>
      </div>
    </header>
  )
}

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/hooks/auth/useAuth'
import { friendshipService } from '@/services/friendshipService'
import type { FriendshipDto } from '@/types/friendship'

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function getFriendUser(friendship: FriendshipDto, currentUserId?: string) {
  if (!currentUserId) return friendship.addressee
  return friendship.requester.id === currentUserId ? friendship.addressee : friendship.requester
}

export default function ProfileFriendsCard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [friends, setFriends] = useState<FriendshipDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadFriends = async () => {
      setLoading(true)
      setError(null)

      const result = await friendshipService.GetFriends()

      if (!result.success) {
        setError(result.message ?? 'Unable to load friends.')
        setLoading(false)
        return
      }

      setFriends(result.data ?? [])
      setLoading(false)
    }

    void loadFriends()
  }, [])

  const items = useMemo(
    () =>
      friends.map((friendship) => {
        const person = getFriendUser(friendship, user?.id)
        return {
          id: friendship.id,
          userId: person.id,
          name: person.displayName || person.username,
          handle: person.email,
        }
      }),
    [friends, user?.id],
  )

  return (
    <section className="min-w-0 rounded-[2rem] bg-white p-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-5">
      <div className="flex items-center gap-5 border-b border-slate-100 px-2 pb-3 text-sm">
        <div className="relative pb-1 font-medium text-slate-800">
          All Friend
          <span className="absolute -bottom-3 left-0 h-0.5 w-full rounded-full bg-amber-400" />
        </div>
      </div>

      <div className="app-scrollbar mt-4 space-y-3 pr-1 xl:max-h-[min(56vh,680px)] xl:overflow-y-auto">
        {loading ? (
          <div className="rounded-[1rem] bg-slate-50 px-4 py-4 text-sm text-slate-500">
            Loading friends...
          </div>
        ) : error ? (
          <div className="rounded-[1rem] bg-rose-50 px-4 py-4 text-sm text-rose-700">{error}</div>
        ) : items.length === 0 ? (
          <div className="rounded-[1rem] bg-slate-50 px-4 py-4 text-sm text-slate-500">
            No friends yet.
          </div>
        ) : (
          items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => navigate(`/people/${item.userId}`)}
              className="flex w-full items-center gap-3 rounded-[1rem] bg-[linear-gradient(135deg,rgba(255,247,237,0.7),rgba(255,255,255,0.95))] px-3 py-3 text-left shadow-[inset_0_0_0_1px_rgba(254,215,170,0.35)] transition hover:bg-slate-50"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${
                  index % 3 === 0
                    ? 'from-sky-200 via-cyan-100 to-blue-50'
                    : index % 3 === 1
                      ? 'from-emerald-200 via-teal-100 to-lime-50'
                      : 'from-fuchsia-200 via-rose-100 to-orange-50'
                } text-xs font-semibold text-slate-700`}
              >
                {initials(item.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-700">{item.name}</p>
                <p className="truncate text-[11px] text-slate-400">{item.handle}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  )
}

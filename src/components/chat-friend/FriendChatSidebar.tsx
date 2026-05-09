import { useEffect, useMemo, useState } from 'react'
import { Search, UserPlus2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/hooks/auth/useAuth'
import { usePresence } from '@/hooks/chat/usePresence'
import { searchUsers } from '@/services/authService'
import { friendshipService } from '@/services/friendshipService'
import type { FriendshipDto, UserSummaryDto } from '@/types/friendship'

type FriendTab = 'friends' | 'discover' | 'requests'

interface FriendChatSidebarProps {
  activeFriendId?: string | null
  onOpenDirectRoom: (friend: UserSummaryDto) => Promise<void> | void
}

function getCounterparty(friendship: FriendshipDto, currentUserId?: string) {
  if (!currentUserId) return friendship.addressee
  return friendship.requester.id === currentUserId ? friendship.addressee : friendship.requester
}

function formatRelativeTime(dateText: string) {
  const date = new Date(dateText)
  const diffMs = Date.now() - date.getTime()

  if (Number.isNaN(diffMs)) return 'Recently'

  const minutes = Math.max(1, Math.floor(diffMs / 60000))
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function FriendChatSidebar({
  activeFriendId,
  onOpenDirectRoom,
}: FriendChatSidebarProps) {
  const { user } = useAuth()
  const { isOnline } = usePresence()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<FriendTab>('friends')
  const [query, setQuery] = useState('')
  const [friends, setFriends] = useState<FriendshipDto[]>([])
  const [incomingRequests, setIncomingRequests] = useState<FriendshipDto[]>([])
  const [discoverResults, setDiscoverResults] = useState<UserSummaryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [discoverLoading, setDiscoverLoading] = useState(false)
  const [requestActionId, setRequestActionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [discoverError, setDiscoverError] = useState<string | null>(null)

  const loadSidebarData = async () => {
    setLoading(true)
    setError(null)

    const [friendsResult, requestsResult] = await Promise.all([
      friendshipService.GetFriends(),
      friendshipService.GetIncomingRequests(),
    ])

    if (!friendsResult.success || !requestsResult.success) {
      setError(friendsResult.message ?? requestsResult.message ?? 'Unable to load friends right now.')
      setLoading(false)
      return
    }

    setFriends(friendsResult.data ?? [])
    setIncomingRequests(requestsResult.data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    void loadSidebarData()
  }, [])

  useEffect(() => {
    if (activeTab !== 'discover') return

    const normalized = query.trim()

    if (normalized.length < 2) {
      setDiscoverResults([])
      setDiscoverError(null)
      setDiscoverLoading(false)
      return
    }

    let cancelled = false
    setDiscoverLoading(true)
    setDiscoverError(null)

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const users = await searchUsers(normalized, 12)

          if (cancelled) return

          setDiscoverResults(
            users
              .filter((item) => item.id !== user?.id)
              .map((item) => ({
                id: item.id,
                username: item.username,
                email: item.email,
                displayName: item.displayName || item.username,
                avatarUrl: item.avatarUrl ?? null,
              })),
          )
        } catch {
          if (cancelled) return
          setDiscoverResults([])
          setDiscoverError('Unable to search people right now.')
        } finally {
          if (!cancelled) {
            setDiscoverLoading(false)
          }
        }
      })()
    }, 300)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
    }
  }, [activeTab, query, user?.id])

  const filteredFriends = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return friends.filter((friendship) => {
      const person = getCounterparty(friendship, user?.id)
      const haystack = `${person.displayName} ${person.username} ${person.email}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [friends, query, user?.id])

  const filteredRequests = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return incomingRequests.filter((friendship) => {
      const person = friendship.requester
      const haystack = `${person.displayName} ${person.username} ${person.email}`.toLowerCase()
      return haystack.includes(normalized)
    })
  }, [incomingRequests, query])

  const filteredDiscover = useMemo(() => discoverResults, [discoverResults])

  return (
    <aside className="flex h-full min-h-0 flex-col rounded-[2rem] bg-white/60 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] ring-1 ring-white/70">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-800">Friends</h2>

        <div className="mt-4 flex items-center gap-4 border-b border-slate-100 pb-3 text-sm">
          {([
            ['friends', 'Friends'],
            ['discover', 'Discover'],
            ['requests', 'Requests'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`relative pb-1 font-medium transition ${
                activeTab === value ? 'text-sky-800' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {label}
              {activeTab === value ? (
                <span className="absolute -bottom-3 left-0 h-0.5 w-full rounded-full bg-sky-500" />
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={
            activeTab === 'discover' ? 'Search new people...' : activeTab === 'requests' ? 'Search requests...' : 'Search people or friends...'
          }
          className="h-12 w-full rounded-full bg-slate-50 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="app-scrollbar mt-6 min-h-0 flex-1 overflow-y-auto pr-1">
        {loading ? (
          <div className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-500">Loading friends...</div>
        ) : error ? (
          <div className="rounded-[1.5rem] bg-rose-50 px-4 py-5 text-sm text-rose-700">{error}</div>
        ) : activeTab === 'friends' ? (
          <div className="space-y-2.5">
            {filteredFriends.length === 0 ? (
              <div className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-500">No friends to show yet.</div>
            ) : (
              filteredFriends.map((friendship) => {
                const person = getCounterparty(friendship, user?.id)
                const active = person.id === activeFriendId

                return (
                  <button
                    key={friendship.id}
                    onClick={() => void onOpenDirectRoom(person)}
                    className={`flex w-full items-center gap-3 rounded-[1.25rem] px-4 py-3 text-left transition ${
                      active ? 'bg-sky-50 shadow-[inset_0_0_0_1px_rgba(186,230,253,0.85)]' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative">
                      <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-fuchsia-100 via-rose-50 to-orange-100 text-xs font-semibold text-slate-700">
                        {person.avatarUrl ? (
                          <img
                            src={person.avatarUrl}
                            alt={person.displayName || person.username}
                            className="size-full object-cover"
                          />
                        ) : (
                          (person.displayName || person.username)
                            .split(' ')
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join('')
                        )}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white ${
                          isOnline(person.id) ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-800">{person.displayName || person.username}</p>
                        <span className="text-[11px] text-slate-400">{formatRelativeTime(friendship.respondedAt ?? friendship.requestedAt)}</span>
                      </div>
                      <p className={`mt-1 truncate text-xs ${isOnline(person.id) ? 'text-emerald-500' : 'text-slate-500'}`}>
                        {isOnline(person.id) ? 'Online now' : person.email}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        ) : activeTab === 'discover' ? (
          <div className="space-y-2.5">
            {discoverLoading ? (
              <div className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-500">Searching people...</div>
            ) : discoverError ? (
              <div className="rounded-[1.5rem] bg-rose-50 px-4 py-5 text-sm text-rose-700">{discoverError}</div>
            ) : query.trim().length < 2 ? (
              <div className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-500">Type at least 2 characters to search new people.</div>
            ) : filteredDiscover.length === 0 ? (
              <div className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-500">No matching people found.</div>
            ) : (
              filteredDiscover.map((item) => {
                const displayName = item.displayName || item.username
                const initials = displayName
                  .split(' ')
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join('')

                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(`/people/${item.id}`)}
                    className="w-full rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(248,250,252,0.96),rgba(255,255,255,0.98))] px-4 py-3 text-left shadow-[inset_0_0_0_1px_rgba(226,232,240,0.75)] transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-sky-100 via-cyan-50 to-emerald-100 text-xs font-semibold text-slate-700">
                        {item.avatarUrl ? (
                          <img
                            src={item.avatarUrl}
                            alt={displayName}
                            className="size-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
                        <p className="mt-1 truncate text-xs text-slate-500">@{item.username}</p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1.5 text-[11px] font-medium text-sky-800">
                        <UserPlus2 className="size-3.5" />
                        View
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredRequests.length === 0 ? (
              <div className="rounded-[1.5rem] bg-slate-50 px-4 py-5 text-sm text-slate-500">No incoming requests right now.</div>
            ) : (
              filteredRequests.map((friendship) => (
                <article
                  key={friendship.id}
                  className="rounded-[1.25rem] bg-[linear-gradient(135deg,rgba(236,253,245,0.85),rgba(255,255,255,0.98))] px-4 py-3 shadow-[inset_0_0_0_1px_rgba(167,243,208,0.75)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-100 via-teal-50 to-cyan-100 text-xs font-semibold text-slate-700">
                      {friendship.requester.avatarUrl ? (
                        <img
                          src={friendship.requester.avatarUrl}
                          alt={friendship.requester.displayName || friendship.requester.username}
                          className="size-full object-cover"
                        />
                      ) : (
                        (friendship.requester.displayName || friendship.requester.username)
                          .split(' ')
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join('')
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {friendship.requester.displayName || friendship.requester.username}
                        </p>
                        <span className="text-[11px] text-slate-400">{formatRelativeTime(friendship.requestedAt)}</span>
                      </div>
                      <p className="mt-1 truncate text-xs text-slate-500">{friendship.requester.email}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={async () => {
                        setRequestActionId(friendship.id)
                        const acceptResult = await friendshipService.AcceptFriendRequest(friendship.id)

                        if (acceptResult.success) {
                          await loadSidebarData()
                          setActiveTab('friends')
                          await onOpenDirectRoom(friendship.requester)
                        }

                        setRequestActionId(null)
                      }}
                      className="rounded-full bg-emerald-100 px-3.5 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-200"
                    >
                      {requestActionId === friendship.id ? 'Working...' : 'Accept'}
                    </button>
                    <button
                      onClick={async () => {
                        setRequestActionId(friendship.id)
                        await friendshipService.Reject(friendship.id)
                        await loadSidebarData()
                        setRequestActionId(null)
                      }}
                      className="rounded-full bg-white px-3.5 py-1.5 text-xs font-medium text-slate-500 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.9)] transition hover:bg-slate-50 hover:text-slate-700"
                    >
                      Ignore
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

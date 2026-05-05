import { useEffect, useMemo, useState } from 'react'
import { Bell, CheckCheck, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { notificationService } from '@/services/notificationService'
import type { NotificationDto, NotificationType } from '@/types/notification'

type ReadFilter = 'all' | 'unread'
type TypeFilter = 'all' | NotificationType

const typeOptions: Array<{ value: TypeFilter; label: string }> = [
  { value: 'all', label: 'All Types' },
  { value: 'FriendRequestReceived', label: 'Friend Requests' },
  { value: 'FriendRequestAccepted', label: 'Accepted' },
  { value: 'AchievementUnlocked', label: 'Achievements' },
  { value: 'RoomReady', label: 'Room Ready' },
  { value: 'MessageReceived', label: 'Messages' },
]

function formatNotificationTime(createdAt: string) {
  const createdDate = new Date(createdAt)
  const diffMs = Date.now() - createdDate.getTime()

  if (Number.isNaN(diffMs)) return 'Recently'

  const minutes = Math.max(1, Math.floor(diffMs / 60000))
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return createdDate.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  })
}

function formatNotificationType(type: NotificationType) {
  switch (type) {
    case 'FriendRequestReceived':
      return 'Friend Request'
    case 'FriendRequestAccepted':
      return 'Friend Accepted'
    case 'AchievementUnlocked':
      return 'Achievement'
    case 'RoomReady':
      return 'Room Ready'
    case 'MessageReceived':
      return 'Message'
    default:
      return type
  }
}

function getNotificationToneClass(type: NotificationType) {
  switch (type) {
    case 'FriendRequestReceived':
      return 'bg-emerald-100 text-emerald-800'
    case 'FriendRequestAccepted':
      return 'bg-fuchsia-100 text-fuchsia-800'
    case 'AchievementUnlocked':
      return 'bg-amber-100 text-amber-800'
    case 'RoomReady':
      return 'bg-sky-100 text-sky-800'
    case 'MessageReceived':
      return 'bg-indigo-100 text-indigo-800'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readFilter, setReadFilter] = useState<ReadFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [markingId, setMarkingId] = useState<string | null>(null)
  const [markingAll, setMarkingAll] = useState(false)

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true)
      setError(null)

      const result =
        typeFilter === 'all'
          ? await notificationService.GetMyNotification(0, 30)
          : await notificationService.GetByType(typeFilter, 0, 30)

      if (!result.success || !result.data) {
        setError(result.message ?? 'Unable to load notifications right now.')
        setNotifications([])
        setLoading(false)
        return
      }

      setNotifications(result.data)
      setLoading(false)
    }

    void loadNotifications()
  }, [typeFilter])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications],
  )

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesRead = readFilter === 'all' ? true : !notification.isRead
      const matchesType = typeFilter === 'all' ? true : notification.Type === typeFilter
      return matchesRead && matchesType
    })
  }, [notifications, readFilter, typeFilter])

  const markNotificationAsRead = async (notification: NotificationDto) => {
    if (notification.isRead || markingId === notification.Id) return

    setMarkingId(notification.Id)
    setNotifications((current) =>
      current.map((item) =>
        item.Id === notification.Id
          ? {
              ...item,
              isRead: true,
              readAt: item.readAt ?? new Date().toISOString(),
            }
          : item,
      ),
    )

    const result = await notificationService.MarkAsRead(notification.Id)

    if (!result.success) {
      setNotifications((current) =>
        current.map((item) =>
          item.Id === notification.Id
            ? {
                ...item,
                isRead: notification.isRead,
                readAt: notification.readAt ?? null,
              }
            : item,
        ),
      )
    }

    setMarkingId(null)
  }

  const handleNotificationClick = async (notification: NotificationDto) => {
    await markNotificationAsRead(notification)
  }

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || markingAll) return

    setMarkingAll(true)
    const result = await notificationService.MarkAllAsRead()

    if (result.success) {
      setNotifications((current) =>
        current.map((item) => ({
          ...item,
          isRead: true,
          readAt: item.readAt ?? new Date().toISOString(),
        })),
      )
    }

    setMarkingAll(false)
  }

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <section className="rounded-[2rem] bg-white/95 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-full bg-sky-100 text-sky-700 shadow-[inset_0_0_0_1px_rgba(125,211,252,0.35)]">
              <Bell className="size-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Notification Center</p>
              <h1 className="mt-1 text-4xl font-semibold tracking-tight text-slate-800">Stay close to what matters</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review new messages, friendship activity, and gentle product updates in one calm place.
              </p>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(239,246,255,0.95))] px-5 py-4 shadow-[inset_0_0_0_1px_rgba(186,230,253,0.55)]">
            <div className="flex items-center gap-3 text-emerald-700">
              <Sparkles className="size-4" />
              <span className="text-sm font-medium">All updates arrive here quietly and stay easy to scan.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-5 shadow-[0_18px_48px_rgba(15,23,42,0.08)] ring-1 ring-slate-100 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {([
                ['all', 'All'],
                ['unread', 'Unread'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setReadFilter(value)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    readFilter === value
                      ? 'bg-sky-100 text-sky-800 shadow-[inset_0_0_0_1px_rgba(125,211,252,0.55)]'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <Button
              onClick={() => void handleMarkAllAsRead()}
              disabled={unreadCount === 0 || markingAll}
              variant="outline"
              className="h-10 rounded-full border-slate-200 px-4 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
            >
              <CheckCheck className="size-4" />
              {markingAll ? 'Working...' : `Mark all as read${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {typeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTypeFilter(option.value)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                  typeFilter === option.value
                    ? 'bg-slate-800 text-white'
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">Loading notifications...</div>
        ) : error ? (
          <div className="mt-5 rounded-[1.5rem] bg-rose-50 px-5 py-4 text-sm text-rose-700">{error}</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <Bell className="size-5" />
            </div>
            <p className="mt-4 text-base font-medium text-slate-700">No notifications in this view yet.</p>
            <p className="mt-2 text-sm text-slate-500">When new activity arrives, it will show up here.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-2.5">
            {filteredNotifications.map((notification) => {
              const toneClassName = getNotificationToneClass(notification.Type)

              return (
                <article
                  key={notification.Id}
                  onClick={() => void handleNotificationClick(notification)}
                  className={`cursor-pointer rounded-[1.35rem] px-4 py-3.5 transition shadow-[inset_0_0_0_1px_rgba(226,232,240,0.75)] ${
                    notification.isRead
                      ? 'bg-[linear-gradient(135deg,rgba(248,250,252,0.9),rgba(255,255,255,0.98))] hover:bg-slate-50/80'
                      : 'bg-[linear-gradient(135deg,rgba(226,232,240,0.92),rgba(241,245,249,0.98))] shadow-[inset_0_0_0_1px_rgba(148,163,184,0.35)]'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${toneClassName}`}>
                              {formatNotificationType(notification.Type)}
                            </span>
                            {!notification.isRead ? (
                              <span className="inline-flex size-2 rounded-full bg-sky-500" />
                            ) : null}
                          </div>

                          <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-slate-800">
                            {notification.title}
                          </h3>
                        </div>

                        <span className="shrink-0 text-[11px] font-medium text-slate-400">
                          {formatNotificationTime(notification.createdAt)}
                        </span>
                      </div>

                      {notification.body ? (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-500">
                          {notification.body}
                        </p>
                      ) : null}

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {!notification.isRead ? (
                          <span className="text-[11px] font-medium text-slate-400">
                            {markingId === notification.Id ? 'Marking as read...' : 'Tap card to mark as read'}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

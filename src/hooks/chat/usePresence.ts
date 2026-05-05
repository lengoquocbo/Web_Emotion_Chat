import { useEffect, useCallback, useSyncExternalStore } from 'react'
import { HubConnection } from '@microsoft/signalr'
import { createHubConnection, startConnection, stopConnection } from '@/services/signalRService'
import { PresenceEvents } from '@/types/Signalr.events'
import type { OnlineUser } from '@/types/Chat'

// ─────────────────────────────────────────────────────────────────────────────
// Singleton store — dùng chung cho toàn app, không tạo lại khi re-render
// ─────────────────────────────────────────────────────────────────────────────

let onlineUsers: Set<string> = new Set()
let presenceConn: HubConnection | null = null
let started = false

const subscribers = new Set<() => void>()

function notifyAll() {
  onlineUsers = new Set(onlineUsers) // reference mới → React nhận ra thay đổi
  subscribers.forEach(fn => fn())
}

function subscribe(fn: () => void) {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

function getSnapshot(): Set<string> {
  return onlineUsers
}

// ─────────────────────────────────────────────────────────────────────────────
// Khởi động connection — idempotent, chỉ tạo 1 lần
// ─────────────────────────────────────────────────────────────────────────────

function ensurePresenceConnection() {
  if (started) return
  started = true

  const conn = createHubConnection('/hubs/presence')
  presenceConn = conn

  // Lắng nghe realtime events
  conn.on(PresenceEvents.UserOnline, (payload: OnlineUser) => {
    onlineUsers.add(payload.userId)
    notifyAll()
  })

  conn.on(PresenceEvents.UserOffline, (payload: OnlineUser) => {
    onlineUsers.delete(payload.userId)
    notifyAll()
  })

  // Reset khi mất kết nối
  conn.onclose(() => {
    started = false
    presenceConn = null
    onlineUsers = new Set()
    notifyAll()
  })

  startConnection(conn)
    .then(async () => {
      // Fetch initial state ngay sau khi connect —
      // vì user đã online trước đó không emit UserOnline lại
      try {
        const userIds = await conn.invoke<string[]>('GetOnlineUsers')
        userIds?.forEach(id => onlineUsers.add(id))
        notifyAll()
      } catch (err) {
        console.error('[usePresence] GetOnlineUsers failed:', err)
      }
    })
    .catch(err => {
      console.error('[usePresence] startConnection failed:', err)
      started = false
      presenceConn = null
    })
}

// ─────────────────────────────────────────────────────────────────────────────
// Stop — gọi khi logout, TRƯỚC khi xoá cookie
// Server nhận OnDisconnectedAsync → xoá Redis → broadcast UserOffline
// ─────────────────────────────────────────────────────────────────────────────

export async function stopPresenceConnection(): Promise<void> {
  if (!presenceConn) return
  await stopConnection(presenceConn)
  presenceConn = null
  started = false
  onlineUsers = new Set()
  notifyAll()
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

interface UsePresenceReturn {
  onlineUsers: Set<string>
  isOnline: (userId: string) => boolean
}

export function usePresence(): UsePresenceReturn {
  useEffect(() => {
    ensurePresenceConnection()
  }, [])

  const currentOnlineUsers = useSyncExternalStore(subscribe, getSnapshot)

  const isOnline = useCallback(
    (userId: string) => currentOnlineUsers.has(userId),
    [currentOnlineUsers],
  )

  return { onlineUsers: currentOnlineUsers, isOnline }
}
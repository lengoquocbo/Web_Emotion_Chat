import { useEffect, useState, useCallback } from 'react'
import { useSignalR } from './Usesignalr'
import { PresenceEvents } from '@/types/Signalr.events'
import type { OnlineUser } from '@/types/Chat'

interface UsePresenceReturn {
  onlineUsers: Set<string>   // set userId đang online
  status: ReturnType<typeof useSignalR>['status']
  isOnline: (userId: string) => boolean
}

export function usePresence(): UsePresenceReturn {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())
  const { connection, status } = useSignalR('/hubs/presence')

  useEffect(() => {
    if (!connection) return

    const handleOnline = (payload: OnlineUser) => {
      setOnlineUsers(prev => new Set(prev).add(payload.userId))
    }

    const handleOffline = (payload: OnlineUser) => {
      setOnlineUsers(prev => {
        const next = new Set(prev)
        next.delete(payload.userId)
        return next
      })
    }

    connection.on(PresenceEvents.UserOnline, handleOnline)
    connection.on(PresenceEvents.UserOffline, handleOffline)

    return () => {
      connection.off(PresenceEvents.UserOnline, handleOnline)
      connection.off(PresenceEvents.UserOffline, handleOffline)
    }
  }, [connection])

  const isOnline = useCallback((userId: string) => onlineUsers.has(userId), [onlineUsers])

  return { onlineUsers, status, isOnline }
}
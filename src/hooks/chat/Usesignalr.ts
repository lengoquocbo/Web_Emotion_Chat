import { useEffect, useRef, useState, useCallback } from 'react'
import { HubConnection, HubConnectionState } from '@microsoft/signalr'
import { createHubConnection, startConnection, stopConnection } from '@/services/signalRService'

type HubPath = '/hubs/chat' | '/hubs/presence'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'

interface UseSignalRReturn {
  connection: HubConnection | null
  status: ConnectionStatus
  connect: () => Promise<void>
  disconnect: () => Promise<void>
}

export function useSignalR(hubPath: HubPath, enabled = true): UseSignalRReturn {
  // ← Dùng useState thay vì chỉ useRef
  // → khi connection được tạo xong, component re-render và nhận connection mới
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const [status, setStatus] = useState<ConnectionStatus>('disconnected')

  // ref để giữ instance mà không trigger re-render thừa
  const connectionRef = useRef<HubConnection | null>(null)

  const connect = useCallback(async () => {
    if (connectionRef.current?.state === HubConnectionState.Connected) return

    const conn = connectionRef.current ?? createHubConnection(hubPath)
    connectionRef.current = conn

    conn.onreconnecting(() => setStatus('reconnecting'))
    conn.onreconnected(() => setStatus('connected'))
    conn.onclose(() => {
      setStatus('disconnected')
      setConnection(null)
      connectionRef.current = null
    })

    setStatus('connecting')

    try {
      await startConnection(conn)
      setStatus('connected')
      setConnection(conn)  // ← trigger re-render, giờ connection không còn null
    } catch {
      setStatus('error')
      setConnection(null)
    }
  }, [hubPath])

  const disconnect = useCallback(async () => {
    if (!connectionRef.current) return
    await stopConnection(connectionRef.current)
    connectionRef.current = null
    setConnection(null)
    setStatus('disconnected')
  }, [])

  useEffect(() => {
    if (!enabled) return
    connect()
    return () => {
      if (connectionRef.current) {
        stopConnection(connectionRef.current)
        connectionRef.current = null
      }
    }
  }, [enabled]) // eslint-disable-line react-hooks/exhaustive-deps

  return { connection, status, connect, disconnect }
}
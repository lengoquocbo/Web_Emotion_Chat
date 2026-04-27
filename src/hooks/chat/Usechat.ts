import { useEffect, useRef, useCallback, useSyncExternalStore, useState } from 'react'
import { HubConnectionState } from '@microsoft/signalr'
import { useSignalR } from './Usesignalr'
import { invokeHub } from '@/services/signalRService'
import { getMessagesByRoom } from '@/services/Messageservice'
import { messageCacheStore } from '@/stores/messageCacheStore'
import { ChatEvents, ChatMethods } from '@/types/Signalr.events'
import type { Message, SendMessageRequest } from '@/types/Chat'

interface UseChatOptions {
  roomId: string
  pageSize?: number
}

interface UseChatReturn {
  messages: Message[]
  isLoading: boolean
  isLoadingMore: boolean
  isSending: boolean
  hasMore: boolean
  status: ReturnType<typeof useSignalR>['status']
  sendMessage: (content: string, messageType?: Message['messageType']) => Promise<void>
  loadMore: () => Promise<void>
}

export function useChat({ roomId, pageSize = 30 }: UseChatOptions): UseChatReturn {
  const [isLoading, setIsLoading]         = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isSending, setIsSending]         = useState(false)

  const roomIdRef = useRef(roomId)
  roomIdRef.current = roomId

  // ── Cache → re-render tự động khi store thay đổi ─────────────────────────
  const cacheEntry = useSyncExternalStore(
    useCallback((notify) => messageCacheStore.subscribe(roomId, notify), [roomId]),
    () => messageCacheStore.get(roomId),
  )

  const messages   = cacheEntry?.messages   ?? []
  const hasMore    = cacheEntry?.hasMore    ?? true
  const pageNumber = cacheEntry?.pageNumber ?? 1

  const { connection, status } = useSignalR('/hubs/chat')

  // ── Load lịch sử — chỉ gọi API khi cache MISS ────────────────────────────
  useEffect(() => {
    if (!roomId) return
    if (messageCacheStore.has(roomId)) {
      console.log('[useChat] cache HIT, skip API', roomId)
      return
    }

    const load = async () => {
      setIsLoading(true)
      try {
        console.log('[useChat] loading messages for room', roomId)
        const result = await getMessagesByRoom(roomId, 1, pageSize)
        console.log('[useChat] loaded', result.items?.length, 'messages, total:', result.totalCount)

        const sorted = [...(result.items ?? [])].reverse()
        const more   = result.totalCount > pageSize
        messageCacheStore.init(roomId, sorted, more)
      } catch (err) {
        console.error('[useChat] loadInitial failed:', err)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [roomId, pageSize])

  // ── Join SignalR room khi connection sẵn sàng ─────────────────────────────
  useEffect(() => {
    if (!connection || connection.state !== HubConnectionState.Connected) {
      console.log('[useChat] skip join — connection not ready, state:', connection?.state ?? 'null')
      return
    }

    console.log('[useChat] joining room', roomId)
    let joined = false

    invokeHub(connection, ChatMethods.JoinRoom, roomId)
      .then(() => {
        joined = true
        console.log('[useChat] joined room', roomId)
      })
      .catch(err => console.error('[useChat] JoinRoom failed:', err))

    return () => {
      if (joined) {
        console.log('[useChat] leaving room', roomId)
        invokeHub(connection, ChatMethods.LeaveRoom, roomId).catch(() => {})
      }
    }
  }, [connection, roomId, status])

  // ── Lắng nghe ReceiveMessage → append cache ───────────────────────────────
  useEffect(() => {
    if (!connection) {
      console.log('[useChat] no connection, skip ReceiveMessage listener')
      return
    }

    console.log('[useChat] registering ReceiveMessage listener')

    const handleReceive = (message: Message) => {
      console.log('[useChat] ReceiveMessage:', message.content, 'roomId:', message.roomId)
      messageCacheStore.append(message.roomId, message)
    }

    connection.on(ChatEvents.ReceiveMessage, handleReceive)
    return () => {
      console.log('[useChat] removing ReceiveMessage listener')
      connection.off(ChatEvents.ReceiveMessage, handleReceive)
    }
  }, [connection])

  // ── Load thêm (scroll lên) ────────────────────────────────────────────────
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return
    const nextPage = pageNumber + 1
    setIsLoadingMore(true)
    try {
      const result = await getMessagesByRoom(roomId, nextPage, pageSize)
      const sorted = [...(result.items ?? [])].reverse()
      messageCacheStore.prepend(roomId, sorted, nextPage, result.items.length === pageSize)
    } catch (err) {
      console.error('[useChat] loadMore failed:', err)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMore, pageNumber, roomId, pageSize])

  // ── Gửi tin nhắn ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (content: string, messageType: Message['messageType'] = 'Text') => {
      const trimmed = content.trim()
      if (!trimmed || isSending || !connection) {
        console.warn('[useChat] sendMessage blocked — isSending:', isSending, 'connection:', connection?.state)
        return
      }

      const request: SendMessageRequest = { roomId, content: trimmed, messageType }
      setIsSending(true)
      try {
        console.log('[useChat] sending message to room', roomId)
        await invokeHub(connection, ChatMethods.SendMessage, request)
        console.log('[useChat] message sent, waiting for ReceiveMessage broadcast...')
      } catch (err) {
        console.error('[useChat] SendMessage failed:', err)
        throw err
      } finally {
        setIsSending(false)
      }
    },
    [connection, roomId, isSending],
  )

  return { messages, isLoading, isLoadingMore, isSending, hasMore, status, sendMessage, loadMore }
}
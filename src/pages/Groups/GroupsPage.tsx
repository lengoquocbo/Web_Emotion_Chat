import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { getMyRooms } from '@/services/roomService'
import { useChat } from '@/hooks/chat/Usechat'
import { useSignalR } from '@/hooks/chat/Usesignalr'
import { invokeHub } from '@/services/signalRService'
import { toastStore } from '@/stores/toastStore'
import { ChatEvents, ChatMethods } from '@/types/Signalr.events'
import type { Room, Message } from '@/types/Chat'
import GroupComposer from '@/components/groups/GroupComposer'
import GroupHeader from '@/components/groups/GroupHeader'
import GroupMembersPanel from '@/components/groups/GroupMembersPanel'
import GroupThread from '@/components/groups/GroupThread'
import RoomSidebar from '@/components/groups/RoomSider'
import ToastContainer from '@/components/ui/ToastContainer'

export default function GroupsPage() {
  const [rooms, setRooms]           = useState<Room[]>([])
  const [activeRoom, setActiveRoom] = useState<Room | null>(null)
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const [error, setError]           = useState<string | null>(null)

  const activeRoomIdRef = useRef<string | null>(null)
  const roomsRef        = useRef<Room[]>([])
  activeRoomIdRef.current = activeRoom?.id ?? null
  roomsRef.current        = rooms

  const chat = useChat({ roomId: activeRoom?.id ?? '' })
  const { connection } = useSignalR('/hubs/chat')

  // ── Fetch rooms ────────────────────────────────────────────────────────────
  useEffect(() => {
    getMyRooms('Matching')
      .then(data => {
        setRooms(data)
        if (data.length > 0) setActiveRoom(data[0])
      })
      .catch(err => setError(err?.response?.data?.message ?? 'Không thể tải nhóm'))
      .finally(() => setIsLoadingRooms(false))
  }, [])

  // ── Join tất cả rooms để nhận toast từ mọi room ───────────────────────────
  useEffect(() => {
    if (!connection || rooms.length === 0) return
    rooms.forEach(room => {
      invokeHub(connection, ChatMethods.JoinRoom, room.id).catch(() => {})
    })
  }, [connection, rooms])

  // ── Toast khi nhận tin từ room không active ────────────────────────────────
  useEffect(() => {
    if (!connection) return

    const handleReceive = (message: Message) => {
      if (message.roomId === activeRoomIdRef.current) return
      const room = roomsRef.current.find(r => r.id === message.roomId)
      if (!room) return

      toastStore.add({
        roomId:     message.roomId,
        roomName:   room.name ?? `Room #${room.id.slice(0, 6)}`,
        senderName: message.senderDisplayName || message.senderUsername,
        content:    message.content,
      })
    }

    connection.on(ChatEvents.ReceiveMessage, handleReceive)
    return () => connection.off(ChatEvents.ReceiveMessage, handleReceive)
  }, [connection])

  const handleToastRoomSelect = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    if (room) setActiveRoom(room)
  }

  // ── States ─────────────────────────────────────────────────────────────────
  if (isLoadingRooms) return (
    <section className="flex h-screen items-center justify-center">
      <Loader2 className="size-7 animate-spin text-slate-300" />
    </section>
  )

  if (error) return (
    <section className="flex h-screen items-center justify-center">
      <p className="text-rose-400">{error}</p>
    </section>
  )

  if (!activeRoom) return (
    <section className="flex h-screen items-center justify-center">
      <p className="text-slate-400">Bạn chưa tham gia nhóm nào.</p>
    </section>
  )

  return (
    <section className="flex h-screen gap-4 overflow-hidden">

      {/* ── Cột 1: Room sidebar ── */}
      <RoomSidebar
        rooms={rooms}
        activeRoomId={activeRoom.id}
        onSelectRoom={setActiveRoom}
      />

      {/* ── Cột 2: Chat area ── */}
      <div className="min-w-0 flex-1 flex flex-col gap-4">
        <div className="shrink-0">
          <GroupHeader
            room={activeRoom}
            rooms={rooms}
            onSelectRoom={setActiveRoom}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <GroupThread
            roomId={activeRoom.id}
            messages={chat.messages}
            isLoading={chat.isLoading}
            isLoadingMore={chat.isLoadingMore}
            hasMore={chat.hasMore}
            onLoadMore={chat.loadMore}
          />
        </div>

        <div className="shrink-0">
          <GroupComposer
            onSend={chat.sendMessage}
            isSending={chat.isSending}
            status={chat.status}
          />
        </div>
      </div>

      {/* ── Cột 3: Members panel ── */}
      <div className="app-scrollbar w-64 shrink-0 overflow-y-auto">
        <GroupMembersPanel room={activeRoom} />
      </div>

      <ToastContainer onRoomSelect={handleToastRoomSelect} />
    </section>
  )
}

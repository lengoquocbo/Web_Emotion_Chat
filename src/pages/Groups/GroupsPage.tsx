import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getMyRooms, updateRoomName } from '@/services/roomService'
import { ReflectionService } from '@/services/reflectionService'
import { useChat } from '@/hooks/chat/Usechat'
import { useSignalR } from '@/hooks/chat/Usesignalr'
import { useAuth } from '@/hooks/auth/useAuth'
import { invokeHub } from '@/services/signalRService'
import { toastStore } from '@/stores/toastStore'
import { ChatEvents, ChatMethods } from '@/types/Signalr.events'
import type { Message, Room, RoomMember } from '@/types/Chat'
import type { ReflectionDto } from '@/types/reflection'
import GroupComposer from '@/components/groups/GroupComposer'
import GroupHeader from '@/components/groups/GroupHeader'
import GroupMembersPanel from '@/components/groups/GroupMembersPanel'
import GroupReflectionPanel from '@/components/groups/GroupReflectionPanel'
import GroupRenameRoomDialog from '@/components/groups/GroupRenameRoomDialog'
import GroupThread from '@/components/groups/GroupThread'
import RoomSidebar from '@/components/groups/RoomSider'
import ToastContainer from '@/components/ui/ToastContainer'

export default function GroupsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [rooms, setRooms] = useState<Room[]>([])
  const [activeRoom, setActiveRoom] = useState<Room | null>(null)
  const [isLoadingRooms, setIsLoadingRooms] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReflectionOpen, setIsReflectionOpen] = useState(false)
  const [activeReflection, setActiveReflection] = useState<ReflectionDto | null>(null)
  const [isMembersOpen, setIsMembersOpen] = useState(false)
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [isSavingRoomName, setIsSavingRoomName] = useState(false)
  const [renameError, setRenameError] = useState<string | null>(null)

  const activeRoomIdRef = useRef<string | null>(null)
  const roomsRef = useRef<Room[]>([])
  activeRoomIdRef.current = activeRoom?.id ?? null
  roomsRef.current = rooms

  const chat = useChat({ roomId: activeRoom?.id ?? '' })
  const { connection } = useSignalR('/hubs/chat')

  useEffect(() => {
    getMyRooms('Matching')
      .then((data) => {
        setRooms(data)
        if (data.length > 0) setActiveRoom(data[0])
      })
      .catch((err) => setError(err?.response?.data?.message ?? 'Không thể tải nhóm'))
      .finally(() => setIsLoadingRooms(false))
  }, [])

  useEffect(() => {
    if (!activeRoom?.id) {
      setActiveReflection(null)
      return
    }

    let cancelled = false

    const loadReflection = async () => {
      const result = await ReflectionService.GetMineByRoomId(activeRoom.id)

      if (cancelled) return

      if (!result.success || !result.data) {
        setActiveReflection(null)
        return
      }

      setActiveReflection(result.data)
    }

    void loadReflection()

    return () => {
      cancelled = true
    }
  }, [activeRoom?.id])

  useEffect(() => {
    if (!connection || rooms.length === 0) return
    rooms.forEach((room) => {
      invokeHub(connection, ChatMethods.JoinRoom, room.id).catch(() => {})
    })
  }, [connection, rooms])

  useEffect(() => {
    if (!connection) return

    const handleReceive = (message: Message) => {
      if (message.roomId === activeRoomIdRef.current) return
      const room = roomsRef.current.find((item) => item.id === message.roomId)
      if (!room) return

      toastStore.add({
        roomId: message.roomId,
        roomName: room.name ?? `Room #${room.id.slice(0, 6)}`,
        senderName: message.senderDisplayName || message.senderUsername,
        content: message.content,
      })
    }

    connection.on(ChatEvents.ReceiveMessage, handleReceive)
    return () => connection.off(ChatEvents.ReceiveMessage, handleReceive)
  }, [connection])

  const handleToastRoomSelect = (roomId: string) => {
    const nextRoom = rooms.find((item) => item.id === roomId)
    if (!nextRoom) return

    setIsReflectionOpen(false)
    setIsMembersOpen(false)
    setIsRenameOpen(false)
    setActiveRoom(nextRoom)
  }

  const handleSelectRoom = (room: Room) => {
    setIsReflectionOpen(false)
    setIsMembersOpen(false)
    setIsRenameOpen(false)
    setActiveRoom(room)
  }

  const handleSelectMember = (member: RoomMember) => {
    setIsMembersOpen(false)

    if (member.userId === user?.id) {
      navigate('/profile')
      return
    }

    navigate(`/people/${member.userId}`)
  }

  const handleRenameRoom = async (nextName: string) => {
    if (!activeRoom) return

    setIsSavingRoomName(true)
    setRenameError(null)

    const result = await updateRoomName(activeRoom.id, nextName)

    if (!result.success || !result.data) {
      setRenameError(result.message ?? 'Không thể cập nhật tên nhóm lúc này.')
      setIsSavingRoomName(false)
      return
    }

    const updatedRoom = result.data
    setRooms((prev) => prev.map((room) => (room.id === updatedRoom.id ? updatedRoom : room)))
    setActiveRoom(updatedRoom)
    setIsSavingRoomName(false)
    setIsRenameOpen(false)
  }

  if (isLoadingRooms) {
    return (
      <section className="flex h-screen items-center justify-center">
        <Loader2 className="size-7 animate-spin text-slate-300" />
      </section>
    )
  }

  if (error) {
    return (
      <section className="flex h-screen items-center justify-center">
        <p className="text-rose-400">{error}</p>
      </section>
    )
  }

  if (!activeRoom) {
    return (
      <section className="flex h-screen items-center justify-center">
        <p className="text-slate-400">Bạn chưa tham gia nhóm nào.</p>
      </section>
    )
  }

  return (
    <section className="relative grid h-screen gap-4 overflow-hidden lg:grid-cols-[minmax(0,1fr)_320px]">
      

      <div className="flex min-w-0 flex-col gap-4">
        <div className="shrink-0">
          <GroupHeader
            room={activeRoom}
            rooms={rooms}
            onSelectRoom={handleSelectRoom}
            onOpenReflection={() => setIsReflectionOpen(true)}
            hasReflection={!!activeReflection}
            onOpenMembers={() => setIsMembersOpen(true)}
            onOpenRename={() => {
              setRenameError(null)
              setIsRenameOpen(true)
            }}
          />
        </div>

        {isReflectionOpen && (
          <div className="shrink-0">
            <GroupReflectionPanel
              room={activeRoom}
              initialReflection={activeReflection}
              onClose={() => setIsReflectionOpen(false)}
              onSaved={(reflection) => {
                setActiveReflection(reflection)
                setIsReflectionOpen(false)
              }}
            />
          </div>
        )}

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

      <GroupRenameRoomDialog
        currentName={activeRoom.name ?? ''}
        isOpen={isRenameOpen}
        isSaving={isSavingRoomName}
        error={renameError}
        onClose={() => {
          if (isSavingRoomName) return
          setRenameError(null)
          setIsRenameOpen(false)
        }}
        onSubmit={handleRenameRoom}
      />

      <GroupMembersPanel
        room={activeRoom}
        isOpen={isMembersOpen}
        onClose={() => setIsMembersOpen(false)}
        onSelectMember={handleSelectMember}
      />

      <RoomSidebar
        rooms={rooms}
        activeRoomId={activeRoom.id}
        onSelectRoom={handleSelectRoom}
      />

      <ToastContainer onRoomSelect={handleToastRoomSelect} />
    </section>
  )
}

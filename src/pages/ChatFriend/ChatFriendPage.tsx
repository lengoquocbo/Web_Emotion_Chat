import { useMemo, useState } from 'react'
import { MessageSquareMore } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import FriendChatComposer from '@/components/chat-friend/FriendChatComposer'
import FriendChatHeader from '@/components/chat-friend/FriendChatHeader'
import FriendChatSidebar from '@/components/chat-friend/FriendChatSidebar'
import FriendConversation from '@/components/chat-friend/FriendConversation'
import { useChat } from '@/hooks/chat/Usechat'
import { getOrCreateDirectRoom } from '@/services/roomService'
import type { Room } from '@/types/Chat'
import type { UserSummaryDto } from '@/types/friendship'

const ChatFriendPage = () => {
  const navigate = useNavigate()
  const [activeFriend, setActiveFriend] = useState<UserSummaryDto | null>(null)
  const [activeRoom, setActiveRoom] = useState<Room | null>(null)
  const [roomLoading, setRoomLoading] = useState(false)
  const [roomError, setRoomError] = useState<string | null>(null)

  const roomId = activeRoom?.id ?? ''

  const {
    messages,
    isLoading,
    isLoadingMore,
    isSending,
    hasMore,
    status,
    sendMessage,
    loadMore,
  } = useChat({ roomId, pageSize: 30 })

  const showEmptyState = useMemo(
    () => !activeFriend && !roomLoading && !roomError,
    [activeFriend, roomError, roomLoading],
  )

  const handleOpenDirectRoom = async (friend: UserSummaryDto) => {
    setActiveFriend(friend)
    setRoomLoading(true)
    setRoomError(null)

    const result = await getOrCreateDirectRoom(friend.id)

    if (!result.success || !result.data) {
      setActiveRoom(null)
      setRoomError(result.message ?? 'Unable to open this conversation right now.')
      setRoomLoading(false)
      return
    }

    setActiveRoom(result.data)
    setRoomLoading(false)
  }

  return (
    <section className="h-full min-h-0 overflow-hidden">
      <div className="grid h-full min-h-0 xl:grid-cols-[minmax(0,1fr)_350px]">
        <main className="flex h-full min-h-0 flex-col overflow-hidden rounded-[2rem] bg-white/92 p-5">
          <div className="shrink-0">
            <FriendChatHeader
              friend={activeFriend}
              onOpenProfile={() => {
                if (activeFriend) {
                  navigate(`/people/${activeFriend.id}`)
                }
              }}
            />
          </div>

          <div className="mt-3 min-h-0 flex-1 overflow-hidden rounded-[1.6rem] bg-white/92">
            {showEmptyState ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 rounded-[1.6rem] bg-[linear-gradient(180deg,#f8fbff_0%,#fbfdff_100%)] text-center">
                <div className="flex size-14 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                  <MessageSquareMore className="size-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-700">Choose a friend to start chatting</p>
                  <p className="mt-1 text-sm text-slate-400">Your direct conversation will open here.</p>
                </div>
              </div>
            ) : roomError ? (
              <div className="flex h-full items-center justify-center rounded-[1.6rem] bg-rose-50 px-6 text-center text-sm text-rose-700">
                {roomError}
              </div>
            ) : (
              <FriendConversation
                roomId={roomId}
                messages={messages}
                isLoading={roomLoading || isLoading}
                isLoadingMore={isLoadingMore}
                hasMore={hasMore}
                onLoadMore={loadMore}
              />
            )}
          </div>

          <div className="mt-4 shrink-0">
            <FriendChatComposer
              onSend={sendMessage}
              isSending={isSending}
              status={status}
              disabled={!activeRoom || roomLoading}
            />
          </div>
        </main>

        <FriendChatSidebar
          activeFriendId={activeFriend?.id}
          onOpenDirectRoom={handleOpenDirectRoom}
        />
      </div>
    </section>
  )
}

export default ChatFriendPage

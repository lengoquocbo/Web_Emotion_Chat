import { useEffect, useRef } from 'react'
import { CheckCheck, Loader2 } from 'lucide-react'

import { useAuth } from '@/hooks/auth/useAuth'
import type { Message } from '@/types/Chat'

interface FriendConversationProps {
  roomId: string
  messages: Message[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export default function FriendConversation({
  roomId,
  messages,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
}: FriendConversationProps) {
  const { user } = useAuth()
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const prevScrollHeight = useRef(0)

  const currentUserId: string | undefined =
    (user as any)?.id ?? (user as any)?.userId ?? (user as any)?.Id

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [roomId])

  useEffect(() => {
    const el = containerRef.current
    if (!el || isLoadingMore) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    if (nearBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoadingMore])

  useEffect(() => {
    const el = containerRef.current
    if (!el || isLoadingMore) return
    const diff = el.scrollHeight - prevScrollHeight.current
    if (diff > 0) el.scrollTop += diff
  }, [messages.length, isLoadingMore])

  const handleScroll = () => {
    const el = containerRef.current
    if (!el || isLoadingMore || !hasMore) return
    if (el.scrollTop < 80) {
      prevScrollHeight.current = el.scrollHeight
      onLoadMore()
    }
  }

  if (isLoading) {
    return (
      <section className="flex h-full items-center justify-center rounded-[1.6rem] bg-white">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-sm">Loading conversation...</p>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      onScroll={handleScroll}
      className="app-scrollbar h-full overflow-y-auto rounded-[1.6rem] bg-[linear-gradient(180deg,#f8fbff_0%,#fbfdff_100%)] px-4 py-5"
    >
      {isLoadingMore ? (
        <div className="mb-4 flex justify-center">
          <Loader2 className="size-4 animate-spin text-slate-300" />
        </div>
      ) : null}

      {!hasMore && messages.length > 0 ? (
        <p className="mb-6 text-center text-[11px] text-slate-300">Start of conversation</p>
      ) : null}

      <div className="mx-auto max-w-3xl space-y-3.5">
        {messages.length === 0 ? (
          <p className="py-20 text-center text-sm text-slate-400">
            No messages yet. Start with a calm hello.
          </p>
        ) : (
          messages.map((message) => {
            const isSelf = !!currentUserId && message.senderId === currentUserId

            return (
              <div key={message.id} className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[min(72%,560px)] ${isSelf ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div
                    className={`rounded-[1.3rem] px-4 py-2.5 text-sm leading-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${
                      isSelf
                        ? 'rounded-br-md bg-sky-800 text-white'
                        : 'rounded-bl-md bg-white text-slate-700'
                    }`}
                  >
                    {message.content}
                  </div>
                  <div className={`mt-1 flex items-center gap-1.5 px-1 text-[11px] text-slate-400 ${isSelf ? 'justify-end' : 'justify-start'}`}>
                    <span>{formatTime(message.createdAt)}</span>
                    {isSelf ? <CheckCheck className="size-3.5 text-sky-600" /> : null}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div ref={bottomRef} />
    </section>
  )
}

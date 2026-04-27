import { useEffect, useRef, useCallback } from 'react'
import { CheckCheck, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/auth/useAuth'
import type { Message } from '@/types/Chat'

interface GroupThreadProps {
  roomId: string          // ← cần để scroll bottom khi switch room
  messages: Message[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

export default function GroupThread({
  roomId,
  messages,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
}: GroupThreadProps) {
  const { user } = useAuth()
  const containerRef     = useRef<HTMLDivElement>(null)
  const bottomRef        = useRef<HTMLDivElement>(null)
  const prevScrollHeight = useRef(0)

  const currentUserId: string | undefined =
    (user as any)?.id ?? (user as any)?.userId ?? (user as any)?.Id

  // ── Khi switch room → scroll xuống bottom ngay lập tức (không smooth) ──────
  // Đảm bảo tin nhắn mới nhất luôn hiện dù cache đã có sẵn
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [roomId])

  // ── Khi có tin mới đến → scroll xuống nếu đang gần bottom ─────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el || isLoadingMore) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    if (nearBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoadingMore])

  // ── Giữ scroll position khi prepend tin cũ (load more) ────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el || isLoadingMore) return
    const diff = el.scrollHeight - prevScrollHeight.current
    if (diff > 0) el.scrollTop += diff
  }, [messages.length, isLoadingMore])

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el || isLoadingMore || !hasMore) return
    if (el.scrollTop < 80) {
      prevScrollHeight.current = el.scrollHeight
      onLoadMore()
    }
  }, [isLoadingMore, hasMore, onLoadMore])

  if (isLoading) return (
    <section className="flex h-full items-center justify-center rounded-[2rem] bg-white">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Loader2 className="size-8 animate-spin" />
        <p className="text-sm">Đang tải tin nhắn...</p>
      </div>
    </section>
  )

  return (
    <section
      ref={containerRef}
      onScroll={handleScroll}
      className="h-full overflow-y-auto rounded-[2rem] bg-white px-4 py-6 sm:px-6"
    >
      {isLoadingMore && (
        <div className="mb-6 flex justify-center">
          <Loader2 className="size-5 animate-spin text-slate-300" />
        </div>
      )}

      {!hasMore && messages.length > 0 && (
        <p className="mb-8 text-center text-xs text-slate-300">Đây là tin nhắn đầu tiên</p>
      )}

      <div className="mx-auto max-w-4xl space-y-6">
        {messages.length === 0 ? (
          <p className="py-20 text-center text-slate-400">
            Chưa có tin nhắn nào. Hãy bắt đầu! 🌱
          </p>
        ) : (
          messages.map((msg, idx) => {
            const isSelf    = !!currentUserId && msg.senderId === currentUserId
            const isDeleted = !!msg.deletedAt
            const name      = msg.senderDisplayName || msg.senderUsername || 'User'
            const initials  = name.slice(0, 2).toUpperCase()

            const prevMsg       = idx > 0 ? messages[idx - 1] : null
            const isSameSender  = prevMsg?.senderId === msg.senderId
            const nextMsg       = idx < messages.length - 1 ? messages[idx + 1] : null
            const isLastInGroup = nextMsg?.senderId !== msg.senderId

            return (
              <div key={msg.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}>

                {!isSelf && !isSameSender && (
                  <p className="mb-1.5 pl-14 text-sm font-semibold text-slate-500">{name}</p>
                )}

                <div className={`flex items-end gap-3 max-w-[min(75%,820px)] ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>
                  {!isSelf && (
                    isLastInGroup ? (
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-100 via-pink-50 to-sky-100 text-xs font-semibold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                        {initials}
                      </div>
                    ) : (
                      <div className="size-10 shrink-0" />
                    )
                  )}

                  <div className={`rounded-[1.5rem] px-5 py-3.5 text-base leading-7 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ${
                    isDeleted
                      ? 'bg-slate-50 italic text-slate-400'
                      : isSelf
                        ? 'bg-sky-800 text-white rounded-br-md'
                        : 'bg-slate-50 text-slate-700 rounded-bl-md'
                  }`}>
                    {msg.content}
                    {msg.editedAt && !isDeleted && (
                      <span className="ml-2 text-xs opacity-50">(đã chỉnh sửa)</span>
                    )}
                  </div>
                </div>

                {isLastInGroup && (
                  <div className={`mt-1 flex items-center gap-1.5 text-xs text-slate-400 ${isSelf ? 'pr-2' : 'pl-14'}`}>
                    <span>{formatTime(msg.createdAt)}</span>
                    {isSelf && <CheckCheck className="size-3.5 text-sky-600" />}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      <div ref={bottomRef} />
    </section>
  )
}
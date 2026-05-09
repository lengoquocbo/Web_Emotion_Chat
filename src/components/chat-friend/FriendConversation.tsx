import { useEffect, useRef, useState } from 'react'
import { CheckCheck, Download, FileText, Loader2, X, ZoomIn } from 'lucide-react'

import { useAuth } from '@/hooks/auth/useAuth'
import { formatFileSize } from '@/services/Uploadservice'
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

function downloadFile(url: string, fileName: string) {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

function ImageLightbox({
  src,
  alt,
  fileName,
  onClose,
}: {
  src: string
  alt: string
  fileName: string
  onClose: () => void
}) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between rounded-t-2xl bg-black/60 px-4 py-2">
          <span className="max-w-[60vw] truncate text-sm text-white/80">{fileName}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadFile(src, fileName)}
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <Download className="size-4" />
            </button>
            <button
              onClick={onClose}
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] max-w-[90vw] rounded-b-2xl object-contain"
        />
      </div>
    </div>
  )
}

function ImageBubble({ message, isSelf }: { message: Message; isSelf: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <>
      <div
        className={`overflow-hidden rounded-[1.3rem] shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${
          isSelf ? 'rounded-br-md' : 'rounded-bl-md'
        }`}
      >
        {hasError ? (
          <div className="bg-slate-100 px-6 py-5 text-xs text-slate-400">Không tải được ảnh</div>
        ) : (
          <div
            className="group relative cursor-zoom-in"
            onClick={() => setIsOpen(true)}
            title="Nhấn để phóng to"
          >
            <img
              src={message.fileUrl ?? ''}
              alt={message.fileName ?? 'Ảnh'}
              className="block max-h-60 max-w-[280px] object-cover transition-opacity duration-300 group-hover:opacity-90"
              loading="lazy"
              onError={() => setHasError(true)}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="rounded-full bg-black/40 p-2">
                <ZoomIn className="size-4 text-white" />
              </div>
            </div>
          </div>
        )}

        {message.fileUrl ? (
          <button
            type="button"
            onClick={() => downloadFile(message.fileUrl!, message.fileName ?? 'image')}
            className={`flex w-full items-center justify-center gap-2 py-2 text-[11px] font-medium transition ${
              isSelf
                ? 'bg-sky-700 text-sky-100 hover:bg-sky-600'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Download className="size-3.5" />
            Tải ảnh
          </button>
        ) : null}
      </div>

      {isOpen && message.fileUrl ? (
        <ImageLightbox
          src={message.fileUrl}
          alt={message.fileName ?? 'Ảnh'}
          fileName={message.fileName ?? 'image'}
          onClose={() => setIsOpen(false)}
        />
      ) : null}
    </>
  )
}

function FileBubble({ message, isSelf }: { message: Message; isSelf: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 rounded-[1.3rem] px-4 py-3 shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${
        isSelf ? 'rounded-br-md bg-sky-800 text-white' : 'rounded-bl-md bg-white text-slate-700'
      }`}
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
          isSelf ? 'bg-sky-700' : 'bg-slate-100'
        }`}
      >
        <FileText className={`size-4 ${isSelf ? 'text-sky-100' : 'text-sky-700'}`} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold">{message.fileName ?? 'Tệp'}</p>
        {message.fileSize != null ? (
          <p className={`text-[11px] ${isSelf ? 'text-sky-200/80' : 'text-slate-400'}`}>
            {formatFileSize(message.fileSize)}
          </p>
        ) : null}
      </div>

      {message.fileUrl ? (
        <button
          type="button"
          onClick={() => downloadFile(message.fileUrl!, message.fileName ?? 'file')}
          className={`flex size-8 shrink-0 items-center justify-center rounded-full transition ${
            isSelf
              ? 'bg-sky-700 text-sky-100 hover:bg-sky-600'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          <Download className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}

function TextBubble({ message, isSelf }: { message: Message; isSelf: boolean }) {
  return (
    <div
      className={`rounded-[1.3rem] px-4 py-2.5 text-sm leading-6 shadow-[0_8px_24px_rgba(15,23,42,0.05)] ${
        isSelf ? 'rounded-br-md bg-sky-800 text-white' : 'rounded-bl-md bg-white text-slate-700'
      }`}
    >
      {message.content}
    </div>
  )
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
                  {message.messageType === 'Image' ? (
                    <ImageBubble message={message} isSelf={isSelf} />
                  ) : message.messageType === 'File' ? (
                    <FileBubble message={message} isSelf={isSelf} />
                  ) : (
                    <TextBubble message={message} isSelf={isSelf} />
                  )}

                  <div
                    className={`mt-1 flex items-center gap-1.5 px-1 text-[11px] text-slate-400 ${
                      isSelf ? 'justify-end' : 'justify-start'
                    }`}
                  >
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

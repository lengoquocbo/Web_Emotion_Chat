import { useEffect, useRef, useCallback, useState } from 'react'
import { CheckCheck, Loader2, Download, FileText, ImageIcon, X, ZoomIn } from 'lucide-react'
import { useAuth } from '@/hooks/auth/useAuth'
import { formatFileSize } from '@/services/Uploadservice'
import type { Message } from '@/types/Chat'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface GroupThreadProps {
  /** roomId cần thiết để scroll xuống bottom khi switch room */
  roomId: string
  messages: Message[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Tải file về máy bằng thẻ <a> với thuộc tính download.
 *
 * BUG FIX: Không dùng fetch() vì sẽ bị CORS block khi backend và frontend
 * chạy khác port. Thay vào đó dùng <a href={url} download> trực tiếp —
 * browser tự xử lý credential (cookie) và tải file mà không cần preflight.
 */
function downloadFile(url: string, fileName: string): void {
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName   // gợi ý tên file cho browser
  anchor.rel = 'noopener'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
}

// ─────────────────────────────────────────────────────────────────────────────
// Lightbox — overlay phóng to ảnh toàn màn hình
// ─────────────────────────────────────────────────────────────────────────────

interface LightboxProps {
  src: string
  alt: string
  fileName: string
  onClose: () => void
}

function Lightbox({ src, alt, fileName, onClose }: LightboxProps) {
  // Đóng khi nhấn Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    /* Overlay tối — click ra ngoài để đóng */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Container ảnh — ngăn click lan ra overlay */}
      <div
        className="relative flex max-h-[90vh] max-w-[90vw] flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Toolbar trên ảnh */}
        <div className="flex items-center justify-between rounded-t-2xl bg-black/60 px-4 py-2">
          <span className="max-w-[60vw] truncate text-sm text-white/80">{fileName}</span>
          <div className="flex items-center gap-2">
            {/* Nút download từ lightbox */}
            <button
              onClick={() => downloadFile(src, fileName)}
              title="Tải ảnh"
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <Download className="size-4" />
            </button>
            {/* Nút đóng */}
            <button
              onClick={onClose}
              title="Đóng (Esc)"
              className="flex size-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Ảnh full size */}
        <img
          src={src}
          alt={alt}
          className="max-h-[80vh] max-w-[90vw] rounded-b-2xl object-contain"
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components cho từng loại nội dung
// ─────────────────────────────────────────────────────────────────────────────

/** Render bubble ảnh — thumbnail click để phóng to, nút download */
function ImageBubble({ msg, isSelf }: { msg: Message; isSelf: boolean }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [imgError, setImgError]         = useState(false)

  return (
    <>
      <div className={`overflow-hidden rounded-[1.5rem] shadow-[0_8px_24px_rgba(15,23,42,0.10)] ${
        isSelf ? 'rounded-br-md' : 'rounded-bl-md'
      }`}>
        {imgError ? (
          /* Fallback khi ảnh không load được */
          <div className="flex flex-col items-center gap-2 bg-slate-100 px-8 py-6 text-slate-400">
            <ImageIcon className="size-8" />
            <span className="text-sm">Không tải được ảnh</span>
          </div>
        ) : (
          /* Thumbnail — bọc trong div relative để đặt icon zoom */
          <div
            className="group relative cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
            title="Nhấn để phóng to"
          >
            <img
              src={msg.fileUrl!}
              alt={msg.fileName ?? 'Ảnh'}
              loading="lazy"
              className="block max-h-72 max-w-xs object-cover transition-opacity duration-300 group-hover:opacity-90"
              onError={() => setImgError(true)}
            />
            {/* Icon zoom hiện khi hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <div className="rounded-full bg-black/40 p-2">
                <ZoomIn className="size-5 text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Nút download ảnh nằm dưới thumbnail */}
        {msg.fileUrl && (
          <button
            onClick={() => downloadFile(msg.fileUrl!, msg.fileName ?? 'image')}
            className={`flex w-full items-center justify-center gap-2 py-2 text-xs font-medium transition ${
              isSelf
                ? 'bg-sky-700 text-sky-100 hover:bg-sky-600'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <Download className="size-3.5" />
            Tải ảnh
          </button>
        )}
      </div>

      {/* Lightbox overlay */}
      {lightboxOpen && msg.fileUrl && (
        <Lightbox
          src={msg.fileUrl}
          alt={msg.fileName ?? 'Ảnh'}
          fileName={msg.fileName ?? 'image'}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  )
}

/** Render bubble file tài liệu — hiện icon + tên file + nút download */
function FileBubble({ msg, isSelf }: { msg: Message; isSelf: boolean }) {
  return (
    <div className={`flex items-center gap-3 rounded-[1.5rem] px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.06)] ${
      isSelf
        ? 'bg-sky-800 text-white rounded-br-md'
        : 'bg-slate-50 text-slate-700 rounded-bl-md'
    }`}>
      {/* Icon file */}
      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
        isSelf ? 'bg-sky-700' : 'bg-slate-100'
      }`}>
        <FileText className={`size-6 ${isSelf ? 'text-sky-200' : 'text-sky-700'}`} />
      </div>

      {/* Tên file + kích thước */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{msg.fileName ?? 'File'}</p>
        {msg.fileSize != null && (
          <p className={`text-xs ${isSelf ? 'text-sky-300' : 'text-slate-400'}`}>
            {formatFileSize(msg.fileSize)}
          </p>
        )}
      </div>

      {/* Nút download — dùng downloadFile() đã fix CORS */}
      {msg.fileUrl && (
        <button
          onClick={() => downloadFile(msg.fileUrl!, msg.fileName ?? 'file')}
          title="Tải file"
          className={`flex size-9 shrink-0 items-center justify-center rounded-full transition ${
            isSelf
              ? 'bg-sky-700 text-sky-100 hover:bg-sky-600'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
        >
          <Download className="size-4" />
        </button>
      )}
    </div>
  )
}

/** Render bubble text thông thường */
function TextBubble({ msg, isSelf }: { msg: Message; isSelf: boolean }) {
  const isDeleted = !!msg.deletedAt

  return (
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
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

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

  // Lấy userId của người dùng hiện tại — hỗ trợ nhiều shape khác nhau
  const currentUserId: string | undefined =
    (user as any)?.id ?? (user as any)?.userId ?? (user as any)?.Id

  // ── Khi switch room → scroll xuống bottom ngay lập tức ──────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' })
  }, [roomId])

  // ── Khi có tin mới → scroll xuống nếu đang gần bottom ───────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el || isLoadingMore) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120
    if (nearBottom) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoadingMore])

  // ── Giữ scroll position khi prepend tin cũ (load more) ──────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el || isLoadingMore) return
    const diff = el.scrollHeight - prevScrollHeight.current
    if (diff > 0) el.scrollTop += diff
  }, [messages.length, isLoadingMore])

  // ── Trigger load more khi scroll lên gần top ────────────────────────────
  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el || isLoadingMore || !hasMore) return
    if (el.scrollTop < 80) {
      prevScrollHeight.current = el.scrollHeight
      onLoadMore()
    }
  }, [isLoadingMore, hasMore, onLoadMore])

  // ── Loading state ────────────────────────────────────────────────────────
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
      {/* Spinner khi load more (scroll lên) */}
      {isLoadingMore && (
        <div className="mb-6 flex justify-center">
          <Loader2 className="size-5 animate-spin text-slate-300" />
        </div>
      )}

      {/* Marker khi đã load hết lịch sử */}
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

                {/* Tên người gửi — chỉ hiện ở tin đầu của nhóm */}
                {!isSelf && !isSameSender && (
                  <p className="mb-1.5 pl-14 text-sm font-semibold text-slate-500">{name}</p>
                )}

                <div className={`flex items-end gap-3 max-w-[min(75%,820px)] ${isSelf ? 'flex-row-reverse' : 'flex-row'}`}>

                  {/* Avatar — chỉ hiện ở tin cuối của nhóm */}
                  {!isSelf && (
                    isLastInGroup ? (
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-100 via-pink-50 to-sky-100 text-xs font-semibold text-slate-700 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                        {initials}
                      </div>
                    ) : (
                      // Placeholder giữ alignment khi không có avatar
                      <div className="size-10 shrink-0" />
                    )
                  )}

                  {/* ── Nội dung bubble theo messageType ── */}
                  {isDeleted ? (
                    // Tin đã xoá — luôn hiện dạng text mờ
                    <TextBubble msg={msg} isSelf={isSelf} />
                  ) : msg.messageType === 'Image' ? (
                    <ImageBubble msg={msg} isSelf={isSelf} />
                  ) : msg.messageType === 'File' ? (
                    <FileBubble msg={msg} isSelf={isSelf} />
                  ) : (
                    <TextBubble msg={msg} isSelf={isSelf} />
                  )}
                </div>

                {/* Timestamp + double tick — chỉ hiện ở tin cuối nhóm */}
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

      {/* Anchor để scroll xuống bottom */}
      <div ref={bottomRef} />
    </section>
  )
}
import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { Paperclip, ImageIcon, Send, Loader2, X, FileText, AlertCircle } from 'lucide-react'
import { uploadImage, uploadFile, isImageFile, isDocumentFile, formatFileSize } from '@/services/Uploadservice'
import type { ConnectionStatus } from '@/hooks/chat/Usesignalr'
import type { Message } from '@/types/Chat'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface GroupComposerProps {
  /** Hàm gửi tin nhắn — nhận content, messageType, và metadata file tuỳ chọn */
  onSend: (
    content: string,
    messageType?: Message['messageType'],
    fileMeta?: { fileUrl: string; fileName: string; fileSize: number }
  ) => Promise<void>
  isSending: boolean
  status: ConnectionStatus
}

/** Trạng thái preview file đang chờ gửi */
interface PendingFile {
  file: File
  /** URL tạm để preview ảnh (chỉ dùng với image) */
  localPreviewUrl: string | null
  /** Loại: 'image' | 'file' */
  kind: 'image' | 'file'
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB
const MAX_FILE_SIZE  = 20 * 1024 * 1024 // 20 MB

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export default function GroupComposer({ onSend, isSending, status }: GroupComposerProps) {
  const [text, setText]               = useState('')
  const [pending, setPending]         = useState<PendingFile | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const inputRef     = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef  = useRef<HTMLInputElement>(null)

  const isDisconnected = status === 'disconnected' || status === 'error'
  const isBusy         = isSending || isUploading

  // ── Xử lý chọn file từ input ───────────────────────────────────────────────
  const handleFileSelected = useCallback(
    (selectedFile: File, kind: 'image' | 'file') => {
      setUploadError(null)

      // Validate size
      const maxSize = kind === 'image' ? MAX_IMAGE_SIZE : MAX_FILE_SIZE
      if (selectedFile.size > maxSize) {
        setUploadError(`File quá lớn. Tối đa ${maxSize / 1024 / 1024}MB.`)
        return
      }

      // Tạo preview URL cho ảnh (object URL — không cần upload ngay)
      const localPreviewUrl = kind === 'image' ? URL.createObjectURL(selectedFile) : null

      setPending({ file: selectedFile, localPreviewUrl, kind })
    },
    [],
  )

  // ── Xoá file đang pending ──────────────────────────────────────────────────
  const handleClearPending = useCallback(() => {
    if (pending?.localPreviewUrl) {
      URL.revokeObjectURL(pending.localPreviewUrl) // giải phóng bộ nhớ
    }
    setPending(null)
    setUploadError(null)
  }, [pending])

  // ── Gửi tin nhắn (text hoặc file) ─────────────────────────────────────────
  const handleSend = useCallback(async () => {
    if (isBusy || isDisconnected) return
    if (!text.trim() && !pending) return

    try {
      if (pending) {
        // ── Có file: upload trước, rồi gửi message với fileUrl ────────────
        setIsUploading(true)
        const uploadFn = pending.kind === 'image' ? uploadImage : uploadFile
        const dto = await uploadFn(pending.file)

        const messageType: Message['messageType'] =
          pending.kind === 'image' ? 'Image' : 'File'

        // Content = tên file (fallback cho client cũ không render ảnh)
        const content = text.trim() || dto.fileName

        await onSend(content, messageType, {
          fileUrl:  dto.url,
          fileName: dto.fileName,
          fileSize: dto.fileSize,
        })

        // Dọn dẹp sau khi gửi thành công
        handleClearPending()
        setText('')
      } else {
        // ── Chỉ có text ────────────────────────────────────────────────────
        if (!text.trim()) return
        await onSend(text.trim(), 'Text')
        setText('')
      }

      inputRef.current?.focus()
    } catch (err) {
      console.error('[GroupComposer] send failed:', err)
      setUploadError('Gửi thất bại. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
    }
  }, [isBusy, isDisconnected, text, pending, onSend, handleClearPending])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section className="mx-auto max-w-4xl">

      {/* ── Banner kết nối ── */}
      {(isDisconnected || status === 'reconnecting') && (
        <p className={`mb-2 text-center text-sm ${isDisconnected ? 'text-rose-400' : 'text-amber-400'}`}>
          {isDisconnected ? 'Mất kết nối — đang thử lại...' : 'Đang kết nối lại...'}
        </p>
      )}

      {/* ── Upload error ── */}
      {uploadError && (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-sm text-rose-600">
          <AlertCircle className="size-4 shrink-0" />
          <span>{uploadError}</span>
          <button
            onClick={() => setUploadError(null)}
            className="ml-auto text-rose-400 hover:text-rose-600"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* ── Preview file đang chờ gửi ── */}
      {pending && (
        <div className="mb-3 flex items-center gap-3 rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3">
          {pending.kind === 'image' && pending.localPreviewUrl ? (
            /* Preview ảnh — hiển thị ngay từ local object URL */
            <img
              src={pending.localPreviewUrl}
              alt={pending.file.name}
              className="h-20 w-20 rounded-xl object-cover shadow-sm"
            />
          ) : (
            /* Icon cho file tài liệu */
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sky-100">
              <FileText className="size-6 text-sky-700" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700">{pending.file.name}</p>
            <p className="text-xs text-slate-400">{formatFileSize(pending.file.size)}</p>
          </div>

          {/* Nút xoá pending file */}
          <button
            onClick={handleClearPending}
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-rose-100 hover:text-rose-500"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {/* ── Composer bar chính ── */}
      <div className="flex items-center gap-3 mb-6 rounded-full bg-white px-4 py-3">
        <div className="flex min-h-[76px] flex-1 items-center gap-4 rounded-full bg-white px-6 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">

          {/* ── Nút upload ảnh ── */}
          <button
            type="button"
            title="Gửi ảnh"
            disabled={isBusy || isDisconnected || !!pending}
            onClick={() => imageInputRef.current?.click()}
            className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-fuchsia-50 hover:text-fuchsia-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ImageIcon className="size-5" />
          </button>

          {/* ── Nút upload file ── */}
          <button
            type="button"
            title="Gửi file"
            disabled={isBusy || isDisconnected || !!pending}
            onClick={() => fileInputRef.current?.click()}
            className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-sky-50 hover:text-sky-600 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Paperclip className="size-5" />
          </button>

          {/* ── Text input ── */}
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isDisconnected
                ? 'Đang mất kết nối...'
                : pending
                  ? 'Thêm chú thích (tuỳ chọn)...'
                  : 'Share a reflection or a breath...'
            }
            disabled={isDisconnected || isBusy}
            className="flex-1 bg-transparent text-xl text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
        </div>

        {/* ── Nút gửi ── */}
        <button
          onClick={handleSend}
          disabled={(!text.trim() && !pending) || isBusy || isDisconnected}
          className="flex size-[72px] items-center justify-center rounded-full bg-sky-800 text-white shadow-[0_18px_40px_rgba(3,105,161,0.28)] transition hover:-translate-y-1 hover:bg-sky-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isBusy
            ? <Loader2 className="size-6 animate-spin" />
            : <Send className="size-7 fill-current" />
          }
        </button>
      </div>

      {/* ── Hidden file inputs ── */}
      <input
        ref={imageInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f && isImageFile(f)) handleFileSelected(f, 'image')
          e.target.value = '' // reset để chọn lại cùng file
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.zip"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0]
          if (f && isDocumentFile(f)) handleFileSelected(f, 'file')
          e.target.value = ''
        }}
      />
    </section>
  )
}
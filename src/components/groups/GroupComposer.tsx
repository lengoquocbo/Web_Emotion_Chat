import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { Paperclip, ImageIcon, Send, Loader2, X, FileText, AlertCircle } from 'lucide-react'
import {
  uploadImage,
  uploadFile,
  isImageFile,
  isDocumentFile,
  formatFileSize,
} from '@/services/Uploadservice'
import type { ConnectionStatus } from '@/hooks/chat/Usesignalr'
import type { Message } from '@/types/Chat'

interface GroupComposerProps {
  onSend: (
    content: string,
    messageType?: Message['messageType'],
    fileMeta?: { fileUrl: string; fileName: string; fileSize: number }
  ) => Promise<void>
  isSending: boolean
  status: ConnectionStatus
}

interface PendingFile {
  file: File
  localPreviewUrl: string | null
  kind: 'image' | 'file'
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_FILE_SIZE = 20 * 1024 * 1024

export default function GroupComposer({ onSend, isSending, status }: GroupComposerProps) {
  const [text, setText] = useState('')
  const [pending, setPending] = useState<PendingFile | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isDisconnected = status === 'disconnected' || status === 'error'
  const isBusy = isSending || isUploading

  const handleFileSelected = useCallback((selectedFile: File, kind: 'image' | 'file') => {
    setUploadError(null)

    const maxSize = kind === 'image' ? MAX_IMAGE_SIZE : MAX_FILE_SIZE
    if (selectedFile.size > maxSize) {
      setUploadError(`File quá lớn. Tối đa ${maxSize / 1024 / 1024}MB.`)
      return
    }

    const localPreviewUrl = kind === 'image' ? URL.createObjectURL(selectedFile) : null
    setPending({ file: selectedFile, localPreviewUrl, kind })
  }, [])

  const handleClearPending = useCallback(() => {
    if (pending?.localPreviewUrl) {
      URL.revokeObjectURL(pending.localPreviewUrl)
    }
    setPending(null)
    setUploadError(null)
  }, [pending])

  const handleSend = useCallback(async () => {
    if (isBusy || isDisconnected) return
    if (!text.trim() && !pending) return

    try {
      if (pending) {
        setIsUploading(true)
        const uploadFn = pending.kind === 'image' ? uploadImage : uploadFile
        const dto = await uploadFn(pending.file)
        const messageType: Message['messageType'] = pending.kind === 'image' ? 'Image' : 'File'
        const content = text.trim() || dto.fileName

        await onSend(content, messageType, {
          fileUrl: dto.url,
          fileName: dto.fileName,
          fileSize: dto.fileSize,
        })

        handleClearPending()
        setText('')
      } else {
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
  }, [handleClearPending, isBusy, isDisconnected, onSend, pending, text])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <section className="mx-auto max-w-4xl">
      {(isDisconnected || status === 'reconnecting') && (
        <p className={`mb-2 text-center text-sm ${isDisconnected ? 'text-rose-400' : 'text-amber-400'}`}>
          {isDisconnected ? 'Mất kết nối, đang thử lại...' : 'Đang kết nối lại...'}
        </p>
      )}

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

      {pending && (
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          {pending.kind === 'image' && pending.localPreviewUrl ? (
            <img
              src={pending.localPreviewUrl}
              alt={pending.file.name}
              className="h-16 w-16 rounded-xl object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100">
              <FileText className="size-5 text-sky-700" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-700">{pending.file.name}</p>
            <p className="text-xs text-slate-400">{formatFileSize(pending.file.size)}</p>
          </div>

          <button
            onClick={handleClearPending}
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-rose-100 hover:text-rose-500"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <div className="mb-4 flex items-center gap-2 rounded-full bg-white px-2 py-2">
        <div className="flex min-h-[58px] flex-1 items-center gap-3 rounded-full bg-white px-4 py-3 shadow-[0_14px_34px_rgba(15,23,42,0.10)]">
          <button
            type="button"
            title="Gửi ảnh"
            disabled={isBusy || isDisconnected || !!pending}
            onClick={() => imageInputRef.current?.click()}
            className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-fuchsia-50 hover:text-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ImageIcon className="size-4" />
          </button>

          <button
            type="button"
            title="Gửi file"
            disabled={isBusy || isDisconnected || !!pending}
            onClick={() => fileInputRef.current?.click()}
            className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-sky-50 hover:text-sky-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Paperclip className="size-4" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isDisconnected
                ? 'Đang mất kết nối...'
                : pending
                  ? 'Thêm chú thích (tuỳ chọn)...'
                  : 'Chia sẻ một dòng cảm xúc...'
            }
            disabled={isDisconnected || isBusy}
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={(!text.trim() && !pending) || isBusy || isDisconnected}
          className="flex size-12 items-center justify-center rounded-full bg-sky-800 text-white shadow-[0_14px_28px_rgba(3,105,161,0.28)] transition hover:-translate-y-0.5 hover:bg-sky-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isBusy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4 fill-current" />
          )}
        </button>
      </div>

      <input
        ref={imageInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f && isImageFile(f)) handleFileSelected(f, 'image')
          e.target.value = ''
        }}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.txt,.zip"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f && isDocumentFile(f)) handleFileSelected(f, 'file')
          e.target.value = ''
        }}
      />
    </section>
  )
}

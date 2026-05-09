import { useCallback, useRef, useState } from 'react'
import { AlertCircle, FileText, Loader2, Plus, Send, X } from 'lucide-react'

import type { ConnectionStatus } from '@/hooks/chat/Usesignalr'
import {
  formatFileSize,
  isDocumentFile,
  isImageFile,
  uploadFile,
  uploadImage,
} from '@/services/Uploadservice'
import type { Message } from '@/types/Chat'

interface FriendChatComposerProps {
  onSend: (
    content: string,
    messageType?: Message['messageType'],
    fileMeta?: { fileUrl: string; fileName: string; fileSize: number }
  ) => Promise<void>
  isSending: boolean
  status: ConnectionStatus
  disabled?: boolean
}

interface PendingFile {
  file: File
  localPreviewUrl: string | null
  kind: 'image' | 'file'
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const MAX_FILE_SIZE = 20 * 1024 * 1024

export default function FriendChatComposer({
  onSend,
  isSending,
  status,
  disabled = false,
}: FriendChatComposerProps) {
  const [text, setText] = useState('')
  const [pending, setPending] = useState<PendingFile | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isDisconnected = status === 'disconnected' || status === 'error'
  const blocked = disabled || isDisconnected || isSending || isUploading

  const handleFileSelected = useCallback((selectedFile: File, kind: 'image' | 'file') => {
    setUploadError(null)

    const maxSize = kind === 'image' ? MAX_IMAGE_SIZE : MAX_FILE_SIZE
    if (selectedFile.size > maxSize) {
      setUploadError(`Tệp quá lớn. Tối đa ${maxSize / 1024 / 1024}MB.`)
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

  const handleSend = async () => {
    if ((!text.trim() && !pending) || blocked) return

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
        await onSend(text.trim(), 'Text')
        setText('')
      }

      inputRef.current?.focus()
    } catch {
      setUploadError('Không thể gửi tệp lúc này. Vui lòng thử lại.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      {uploadError ? (
        <div className="mb-2 flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-600">
          <AlertCircle className="size-4 shrink-0" />
          <span>{uploadError}</span>
          <button
            type="button"
            onClick={() => setUploadError(null)}
            className="ml-auto text-rose-400 transition hover:text-rose-600"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      {pending ? (
        <div className="mb-2 flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2.5">
          {pending.kind === 'image' && pending.localPreviewUrl ? (
            <img
              src={pending.localPreviewUrl}
              alt={pending.file.name}
              className="h-12 w-12 rounded-xl object-cover shadow-sm"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100">
              <FileText className="size-4 text-sky-700" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-700">{pending.file.name}</p>
            <p className="text-[11px] text-slate-400">{formatFileSize(pending.file.size)}</p>
          </div>

          <button
            type="button"
            onClick={handleClearPending}
            className="flex size-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-rose-100 hover:text-rose-500"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <div className="flex min-h-[54px] flex-1 items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
          <button
            type="button"
            disabled={blocked || !!pending}
            onClick={() => fileInputRef.current?.click()}
            className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            title="Gửi tệp hoặc ảnh"
          >
            <Plus className="size-4" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void handleSend()
              }
            }}
            placeholder={
              disabled
                ? 'Chọn bạn để bắt đầu trò chuyện...'
                : isDisconnected
                  ? 'Đang kết nối lại...'
                  : pending
                    ? 'Thêm chú thích (tuỳ chọn)...'
                    : 'Gửi một lời nhắn nhẹ nhàng...'
            }
            disabled={blocked}
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
        </div>

        <button
          onClick={() => void handleSend()}
          disabled={(!text.trim() && !pending) || blocked}
          className="flex size-12 items-center justify-center rounded-full bg-sky-800 text-white shadow-[0_14px_28px_rgba(3,105,161,0.24)] transition hover:-translate-y-0.5 hover:bg-sky-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSending || isUploading ? (
            <Loader2 className="size-4.5 animate-spin" />
          ) : (
            <Send className="size-4.5 fill-current" />
          )}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.docx,.txt,.zip"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (!file) return
          if (isImageFile(file)) handleFileSelected(file, 'image')
          else if (isDocumentFile(file)) handleFileSelected(file, 'file')
          else setUploadError('Định dạng tệp chưa được hỗ trợ.')
          event.target.value = ''
        }}
      />
    </section>
  )
}

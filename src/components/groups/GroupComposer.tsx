import { useState, useRef, useCallback, KeyboardEvent } from 'react'
import { Plus, Send, Loader2 } from 'lucide-react'
import type { ConnectionStatus } from '@/hooks/chat/Usesignalr'
import type { Message } from '@/types/Chat'

interface GroupComposerProps {
  onSend: (content: string, messageType?: Message['messageType']) => Promise<void>
  isSending: boolean
  status: ConnectionStatus
}

export default function GroupComposer({ onSend, isSending, status }: GroupComposerProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const isDisconnected = status === 'disconnected' || status === 'error'

  const handleSend = useCallback(async () => {
    if (!text.trim() || isSending || isDisconnected) return
    try {
      await onSend(text)
      setText('')
      inputRef.current?.focus()
    } catch { /* lỗi đã log trong useChat */ }
  }, [text, isSending, isDisconnected, onSend])

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
          {isDisconnected ? 'Mất kết nối — đang thử lại...' : 'Đang kết nối lại...'}
        </p>
      )}

      <div className="flex items-center gap-3 mb-6 rounded-full bg-white px-4 py-3">
        <div className="flex min-h-[76px] flex-1 items-center gap-4 rounded-full bg-white px-6 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
          <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700">
            <Plus className="size-5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDisconnected ? 'Đang mất kết nối...' : 'Share a reflection or a breath...'}
            disabled={isDisconnected || isSending}
            className="flex-1 bg-transparent text-xl text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
        </div>

        <button
          onClick={handleSend}
          disabled={!text.trim() || isSending || isDisconnected}
          className="flex size-[72px] items-center justify-center rounded-full bg-sky-800 text-white shadow-[0_18px_40px_rgba(3,105,161,0.28)] transition hover:-translate-y-1 hover:bg-sky-900 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSending ? <Loader2 className="size-6 animate-spin" /> : <Send className="size-7 fill-current" />}
        </button>
      </div>
    </section>
  )
}
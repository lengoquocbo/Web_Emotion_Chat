import { useRef, useState } from 'react'
import { Loader2, Plus, Send } from 'lucide-react'

import type { ConnectionStatus } from '@/hooks/chat/Usesignalr'
import type { Message } from '@/types/Chat'

interface FriendChatComposerProps {
  onSend: (content: string, messageType?: Message['messageType']) => Promise<void>
  isSending: boolean
  status: ConnectionStatus
  disabled?: boolean
}

export default function FriendChatComposer({
  onSend,
  isSending,
  status,
  disabled = false,
}: FriendChatComposerProps) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const isDisconnected = status === 'disconnected' || status === 'error'
  const blocked = disabled || isDisconnected || isSending

  const handleSend = async () => {
    if (!text.trim() || blocked) return

    try {
      await onSend(text)
      setText('')
      inputRef.current?.focus()
    } catch {
      // send errors are already handled upstream
    }
  }

  return (
    <section className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="flex min-h-[54px] flex-1 items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
          <button className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700">
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
            placeholder={disabled ? 'Select a friend to start chatting...' : isDisconnected ? 'Reconnecting...' : 'Send a calm message...'}
            disabled={blocked}
            className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-50"
          />
        </div>

        <button
          onClick={() => void handleSend()}
          disabled={!text.trim() || blocked}
          className="flex size-12 items-center justify-center rounded-full bg-sky-800 text-white shadow-[0_14px_28px_rgba(3,105,161,0.24)] transition hover:-translate-y-0.5 hover:bg-sky-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSending ? <Loader2 className="size-4.5 animate-spin" /> : <Send className="size-4.5 fill-current" />}
        </button>
      </div>
    </section>
  )
}

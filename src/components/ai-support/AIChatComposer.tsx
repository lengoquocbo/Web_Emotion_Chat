import { FormEvent, useEffect, useRef, useState } from 'react'
import { LoaderCircle, Send, Sparkles } from 'lucide-react'

type AIChatComposerProps = {
  onSend: (message: string) => void
  placeholder?: string
  suggestions?: string[]
  disabled?: boolean
  isBusy?: boolean
  multiline?: boolean
}

export default function AIChatComposer({
  onSend,
  placeholder = 'Mô tả cảm xúc hiện tại của bạn...',
  suggestions = [],
  disabled = false,
  isBusy = false,
  multiline = false,
}: AIChatComposerProps) {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (disabled) {
      setMessage('')
    }
  }, [disabled])

  useEffect(() => {
    if (!disabled && !isBusy) {
      inputRef.current?.focus()
    }
  }, [disabled, isBusy])

  const canSend = !disabled && !isBusy && message.trim().length > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextMessage = message.trim()

    if (!nextMessage) {
      return
    }

    onSend(nextMessage)
    setMessage('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      {suggestions.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={disabled || isBusy}
              onClick={() => setMessage(suggestion)}
              className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-medium text-slate-600 shadow-[0_8px_18px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:bg-sky-50 hover:text-sky-800 disabled:cursor-not-allowed disabled:opacity-50 md:text-xs"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <form className="flex items-center gap-3" onSubmit={handleSubmit}>
        <div className="flex min-h-[54px] flex-1 items-center gap-3 rounded-full bg-white px-4 py-2.5 shadow-[0_14px_36px_rgba(15,23,42,0.08)]">
          <div className="flex size-8 items-center justify-center rounded-full bg-sky-50 text-sky-700">
            {isBusy ? <LoaderCircle className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          </div>

          {multiline ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={placeholder}
              disabled={disabled || isBusy}
              rows={3}
              className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent text-sm leading-6 text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          ) : (
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={placeholder}
              disabled={disabled || isBusy}
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className={`flex size-12 items-center justify-center rounded-full text-white shadow-[0_14px_28px_rgba(3,105,161,0.24)] transition ${
            canSend
              ? 'bg-sky-800 hover:-translate-y-1 hover:bg-sky-900'
              : 'cursor-not-allowed bg-slate-300 shadow-none'
          }`}
        >
          <Send className="size-4.5 fill-current" />
        </button>
      </form>
    </section>
  )
}

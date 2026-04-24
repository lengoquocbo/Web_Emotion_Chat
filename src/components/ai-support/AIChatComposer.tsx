import { FormEvent, useEffect, useState } from 'react'
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
  placeholder = 'Share what is on your mind...',
  suggestions = [],
  disabled = false,
  isBusy = false,
  multiline = false,
}: AIChatComposerProps) {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (disabled) {
      setMessage('')
    }
  }, [disabled])

  const canSend = !disabled && !isBusy && message.trim().length > 0

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextMessage = message.trim()

    if (!nextMessage) {
      return
    }

    onSend(nextMessage)
    setMessage('')
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      {suggestions.length > 0 ? (
        <div className="mb-4 flex flex-wrap gap-3">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={disabled || isBusy}
              onClick={() => setMessage(suggestion)}
              className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:bg-sky-50 hover:text-sky-800 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <form className="flex items-center gap-3" onSubmit={handleSubmit}>
        <div className="flex min-h-[68px] flex-1 items-center gap-4 rounded-[2rem] bg-white px-6 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
          <div className="flex size-10 items-center justify-center rounded-full bg-sky-50 text-sky-700">
            {isBusy ? <LoaderCircle className="size-5 animate-spin" /> : <Sparkles className="size-5" />}
          </div>

          {multiline ? (
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={placeholder}
              disabled={disabled || isBusy}
              rows={3}
              className="max-h-36 min-h-[52px] flex-1 resize-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed md:text-base"
            />
          ) : (
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={placeholder}
              disabled={disabled || isBusy}
              className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed md:text-base"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className={`flex size-[64px] items-center justify-center rounded-full text-white shadow-[0_18px_40px_rgba(3,105,161,0.28)] transition ${
            canSend
              ? 'bg-sky-800 hover:-translate-y-1 hover:bg-sky-900'
              : 'cursor-not-allowed bg-slate-300 shadow-none'
          }`}
        >
          <Send className="size-6 fill-current" />
        </button>
      </form>
    </section>
  )
}

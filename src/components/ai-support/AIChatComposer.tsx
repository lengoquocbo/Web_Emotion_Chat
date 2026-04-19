import { FormEvent, useState } from 'react'
import { Plus, Send, Smile } from 'lucide-react'

type AIChatComposerProps = {
  onSend: (message: string) => void
  placeholder?: string
}

export default function AIChatComposer({
  onSend,
  placeholder = 'Hỏi AI Support bất kỳ điều gì...',
}: AIChatComposerProps) {
  const [message, setMessage] = useState('')

  const canSend = message.trim().length > 0

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
      <form className="flex items-center gap-3" onSubmit={handleSubmit}>
        <div className="flex min-h-[76px] flex-1 items-center gap-4 rounded-full bg-white px-6 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <Plus className="size-5" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-lg text-slate-700 outline-none placeholder:text-slate-400 md:text-xl"
          />

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <Smile className="size-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className={`flex size-[72px] items-center justify-center rounded-full text-white shadow-[0_18px_40px_rgba(3,105,161,0.28)] transition ${
            canSend
              ? 'bg-sky-800 hover:-translate-y-1 hover:bg-sky-900'
              : 'cursor-not-allowed bg-slate-300 shadow-none'
          }`}
        >
          <Send className="size-7 fill-current" />
        </button>
      </form>
    </section>
  )
}

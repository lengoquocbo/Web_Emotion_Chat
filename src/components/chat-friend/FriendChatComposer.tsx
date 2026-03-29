import { ImagePlus, Mic, Plus, Send, Smile } from 'lucide-react'

export default function FriendChatComposer() {
  return (
    <section className="mx-auto max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="flex min-h-[76px] flex-1 items-center gap-3 rounded-full bg-white px-5 py-4 shadow-[0_18px_50px_rgba(15,23,42,0.10)]">
          <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700">
            <Plus className="size-5" />
          </button>
          <button className="flex size-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <ImagePlus className="size-5" />
          </button>
          <input
            type="text"
            placeholder="Send a calm message..."
            className="flex-1 bg-transparent text-xl text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button className="flex size-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <Smile className="size-5" />
          </button>
          <button className="flex size-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <Mic className="size-5" />
          </button>
        </div>

        <button className="flex size-[72px] items-center justify-center rounded-full bg-sky-800 text-white shadow-[0_18px_40px_rgba(3,105,161,0.28)] transition hover:-translate-y-1 hover:bg-sky-900">
          <Send className="size-7 fill-current" />
        </button>
      </div>
    </section>
  )
}

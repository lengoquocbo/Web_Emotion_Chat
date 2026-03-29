import { quickPrompts } from './ai-support-data'

export default function AIChatSuggestions() {
  return (
    <section className="flex flex-wrap justify-center gap-4 px-2">
      {quickPrompts.map((prompt) => (
        <button
          key={prompt.label}
          className={`rounded-full px-6 py-3 text-base shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 ${
            prompt.active
              ? 'bg-fuchsia-200/70 text-fuchsia-900'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {prompt.label}
        </button>
      ))}
    </section>
  )
}

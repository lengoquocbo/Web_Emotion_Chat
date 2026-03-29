import AIChatComposer from '@/components/ai-support/AIChatComposer'
import AIChatHeader from '@/components/ai-support/AIChatHeader'
import AIChatSuggestions from '@/components/ai-support/AIChatSuggestions'
import AIConversation from '@/components/ai-support/AIConversation'

const AISupportPage = () => {
  return (
    <section className="h-screen overflow-hidden flex flex-col bg-[#f7fbff]">
      <header className="shrink-0 px-6 pt-4">
        <AIChatHeader />
      </header>

      <main className="flex-1 min-h-0 overflow-hidden px-6">
        <div className="h-full overflow-y-auto">
          <div className="mx-auto max-w-5xl py-6 space-y-6">
            <AIConversation />
          </div>
        </div>
      </main>

      <footer className="shrink-0 px-6 pb-4">
                    <AIChatSuggestions />
        <AIChatComposer />
      </footer>
    </section>
  )
}

export default AISupportPage
import { useEffect, useMemo, useState } from 'react'
import { MessageSquareText } from 'lucide-react'

import AIChatComposer from '@/components/ai-support/AIChatComposer'
import AIChatHeader from '@/components/ai-support/AIChatHeader'
import AIChatSidebar from '@/components/ai-support/AIChatSidebar'
import AIChatSuggestions from '@/components/ai-support/AIChatSuggestions'
import AIConversation from '@/components/ai-support/AIConversation'
import type { AIMessage, AIThread } from '@/components/ai-support/ai-support-data'

const STORAGE_KEY = 'ai-support-threads'
const ACTIVE_THREAD_KEY = 'ai-support-active-thread'

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
})

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const createThreadTitle = (message: string) => {
  const normalized = message.replace(/\s+/g, ' ').trim()
  return normalized.length > 40 ? `${normalized.slice(0, 40)}...` : normalized
}

const formatCurrentTime = () => timeFormatter.format(new Date())

const readStoredThreads = () => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const rawThreads = window.localStorage.getItem(STORAGE_KEY)

    if (!rawThreads) {
      return []
    }

    const parsedThreads = JSON.parse(rawThreads)
    return Array.isArray(parsedThreads) ? (parsedThreads as AIThread[]) : []
  } catch {
    return []
  }
}

const readStoredActiveThreadId = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(ACTIVE_THREAD_KEY)
}

const createSupportReply = (message: string): AIMessage => {
  const summary = message.length > 72 ? `${message.slice(0, 72)}...` : message

  return {
    id: createId('message'),
    role: 'assistant',
    time: formatCurrentTime(),
    text: `Mình đã nhận được yêu cầu của bạn: "${summary}". Bạn muốn mình hỗ trợ theo hướng lắng nghe, phân tích vấn đề hay gợi ý bước tiếp theo?`,
  }
}

const AISupportPage = () => {
  const [threads, setThreads] = useState<AIThread[]>(readStoredThreads)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(readStoredActiveThreadId)

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads],
  )

  const hasConversation = Boolean(activeThread?.messages.length)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
  }, [threads])

  useEffect(() => {
    if (!activeThreadId) {
      window.localStorage.removeItem(ACTIVE_THREAD_KEY)
      return
    }

    window.localStorage.setItem(ACTIVE_THREAD_KEY, activeThreadId)
  }, [activeThreadId])

  useEffect(() => {
    if (!activeThreadId) {
      return
    }

    const hasActiveThread = threads.some((thread) => thread.id === activeThreadId)

    if (!hasActiveThread) {
      setActiveThreadId(null)
    }
  }, [activeThreadId, threads])

  const handleSendMessage = (message: string) => {
    const content = message.trim()

    if (!content) {
      return
    }

    const userMessage: AIMessage = {
      id: createId('message'),
      role: 'user',
      time: formatCurrentTime(),
      text: content,
    }

    const assistantMessage = createSupportReply(content)

    if (!activeThreadId) {
      const nextThreadId = createId('thread')
      const nextThread: AIThread = {
        id: nextThreadId,
        title: createThreadTitle(content),
        preview: content,
        updatedAt: assistantMessage.time,
        messages: [userMessage, assistantMessage],
      }

      setThreads((previousThreads) => [nextThread, ...previousThreads])
      setActiveThreadId(nextThreadId)
      return
    }

    setThreads((previousThreads) => {
      const updatedThreads = previousThreads.map((thread) =>
        thread.id === activeThreadId
          ? {
              ...thread,
              preview: content,
              updatedAt: assistantMessage.time,
              messages: [...thread.messages, userMessage, assistantMessage],
            }
          : thread,
      )

      const currentThread = updatedThreads.find((thread) => thread.id === activeThreadId)

      if (!currentThread) {
        return previousThreads
      }

      return [currentThread, ...updatedThreads.filter((thread) => thread.id !== activeThreadId)]
    })
  }

  const handleNewChat = () => {
    setActiveThreadId(null)
  }

  return (
    <section className="h-full min-h-0 overflow-hidden">
      <div className="grid h-full min-h-0 gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <AIChatSidebar
          threads={threads}
          activeThreadId={activeThreadId}
          onNewChat={handleNewChat}
          onSelectThread={setActiveThreadId}
        />

        <div className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] bg-[#f7fbff] p-4 shadow-[0_24px_55px_rgba(15,23,42,0.08)]">
          <header className="shrink-0">
            <AIChatHeader />
          </header>

          <main className="min-h-0 flex-1 overflow-hidden pt-4">
            {hasConversation && activeThread ? (
              <div className="h-full overflow-y-auto pr-1">
                <div className="mx-auto max-w-5xl pb-4">
                  <AIConversation messages={activeThread.messages} />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center overflow-y-auto px-4">
                <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-white text-sky-700 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                    <MessageSquareText className="size-7" />
                  </div>

                  <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-800 md:text-4xl">
                    {threads.length > 0 ? 'Bắt đầu một đoạn chat mới' : 'AI Support có thể giúp gì cho bạn?'}
                  </h2>

                  <p className="mt-3 text-base leading-7 text-slate-500 md:text-lg">
                    {threads.length > 0
                      ? 'Chọn một cuộc trò chuyện trong lịch sử hoặc gửi yêu cầu mới để mở conversation.'
                      : 'Khi bạn gửi tin nhắn đầu tiên, conversation sẽ hiện ra và được lưu vào lịch sử ở thanh bên trái.'}
                  </p>

                  <div className="mt-8">
                    <AIChatSuggestions onSelect={handleSendMessage} />
                  </div>

                  <div className="mt-10 w-full">
                    <AIChatComposer
                      onSend={handleSendMessage}
                      placeholder="Mô tả điều bạn đang cần AI Support hỗ trợ..."
                    />
                  </div>
                </div>
              </div>
            )}
          </main>

          {hasConversation ? (
            <footer className="shrink-0 pt-4">
              <AIChatComposer
                onSend={handleSendMessage}
                placeholder="Nhắn tiếp trong cuộc trò chuyện này..."
              />
            </footer>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default AISupportPage

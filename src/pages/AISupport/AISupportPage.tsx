import { useEffect, useMemo, useState } from 'react'

import AIChatComposer from '@/components/ai-support/AIChatComposer'
import AIChatHeader from '@/components/ai-support/AIChatHeader'
import AIChatSidebar from '@/components/ai-support/AIChatSidebar'
import AIConversation from '@/components/ai-support/AIConversation'
import AICheckInWelcome from '@/components/ai-support/AICheckInWelcome'
import AIProgressSteps from '@/components/ai-support/AIProgressSteps'
import AISummaryCard from '@/components/ai-support/AISummaryCard'
import type {
  AIMessage,
  AISummary,
  AIThread,
  CheckInStage,
} from '@/components/ai-support/ai-support-data'
import {
  confirmCheckInSummary,
  rewriteCheckInSummary,
  startCheckIn,
  submitCheckInAnswer,
} from '@/services/aiSupportService'

const STORAGE_KEY = 'ai-support-threads-v2'
const LEGACY_STORAGE_KEY = 'ai-support-threads'
const ACTIVE_THREAD_KEY = 'ai-support-active-thread-v2'

const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
})

const stagePlaceholders: Record<CheckInStage, string> = {
  idle: '',
  emotion: 'Mo ta cam xuc hien tai cua ban...',
  issue: 'Dieu gi dang lam ban nang long nhat luc nay...',
  deepdive: 'Ke them dieu ban nghi la quan trong nhat...',
  summary: '',
  completed: '',
}

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const formatCurrentTime = () => timeFormatter.format(new Date())

const createThreadTitle = (text: string) => {
  const normalized = text.replace(/\s+/g, ' ').trim()
  return normalized.length > 40 ? `${normalized.slice(0, 40)}...` : normalized
}

const createAssistantMessage = (text: string): AIMessage => ({
  id: createId('message'),
  role: 'assistant',
  time: formatCurrentTime(),
  text,
  kind: 'question',
})

const createUserMessage = (text: string): AIMessage => ({
  id: createId('message'),
  role: 'user',
  time: formatCurrentTime(),
  text,
  kind: 'answer',
})

const createStatusMessage = (text: string): AIMessage => ({
  id: createId('message'),
  role: 'assistant',
  time: formatCurrentTime(),
  text,
  kind: 'status',
})

const isValidStoredThread = (value: unknown): value is AIThread =>
  typeof value === 'object' &&
  value !== null &&
  'id' in value &&
  'messages' in value &&
  'stage' in value

const readStoredThreads = () => {
  if (typeof window === 'undefined') {
    return [] as AIThread[]
  }

  const sources = [STORAGE_KEY, LEGACY_STORAGE_KEY]

  for (const storageKey of sources) {
    try {
      const rawThreads = window.localStorage.getItem(storageKey)

      if (!rawThreads) {
        continue
      }

      const parsedThreads = JSON.parse(rawThreads)

      if (!Array.isArray(parsedThreads)) {
        continue
      }

      return parsedThreads
        .filter(isValidStoredThread)
        .map((thread) => ({
          ...thread,
          summary: thread.summary ?? null,
          answers: thread.answers ?? {},
          suggestions: thread.suggestions ?? [],
          canRewrite: thread.canRewrite ?? true,
        }))
    } catch {
      return []
    }
  }

  return []
}

const readStoredActiveThreadId = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return window.localStorage.getItem(ACTIVE_THREAD_KEY)
}

const createDraftThread = (): AIThread => ({
  id: createId('thread'),
  title: 'New guided check-in',
  preview: 'Ready to begin',
  updatedAt: formatCurrentTime(),
  stage: 'idle',
  messages: [],
  summary: null,
  answers: {},
  suggestions: [],
  canRewrite: false,
})

const isAnswerStage = (stage: CheckInStage): stage is 'emotion' | 'issue' | 'deepdive' =>
  stage === 'emotion' || stage === 'issue' || stage === 'deepdive'

const updateThreadCollection = (
  previousThreads: AIThread[],
  threadId: string,
  updater: (thread: AIThread) => AIThread,
) => {
  const updatedThreads = previousThreads.map((thread) =>
    thread.id === threadId ? updater(thread) : thread,
  )

  const currentThread = updatedThreads.find((thread) => thread.id === threadId)

  if (!currentThread) {
    return previousThreads
  }

  return [currentThread, ...updatedThreads.filter((thread) => thread.id !== threadId)]
}

const buildSummaryPreview = (summary: AISummary) => summary.narrative

const AISupportPage = () => {
  const [threads, setThreads] = useState<AIThread[]>(readStoredThreads)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(readStoredActiveThreadId)
  const [isBusy, setIsBusy] = useState(false)

  const activeThread = useMemo(
    () => threads.find((thread) => thread.id === activeThreadId) ?? null,
    [activeThreadId, threads],
  )

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
    if (threads.length === 0) {
      const draftThread = createDraftThread()
      setThreads([draftThread])
      setActiveThreadId(draftThread.id)
      return
    }

    if (!activeThreadId) {
      setActiveThreadId(threads[0]?.id ?? null)
      return
    }

    const hasActiveThread = threads.some((thread) => thread.id === activeThreadId)

    if (!hasActiveThread) {
      setActiveThreadId(threads[0]?.id ?? null)
    }
  }, [activeThreadId, threads])

  const updateActiveThread = (updater: (thread: AIThread) => AIThread) => {
    if (!activeThreadId) {
      return
    }

    setThreads((previousThreads) => updateThreadCollection(previousThreads, activeThreadId, updater))
  }

  const handleNewChat = () => {
    const draftThread = createDraftThread()
    setThreads((previousThreads) => [draftThread, ...previousThreads])
    setActiveThreadId(draftThread.id)
  }

  const handleStartCheckIn = async () => {
    if (!activeThread) {
      return
    }

    setIsBusy(true)

    try {
      const response = await startCheckIn()
      const assistantMessage = createAssistantMessage(response.question)

      updateActiveThread((thread) => ({
        ...thread,
        title: 'Check-in session',
        preview: response.question,
        updatedAt: assistantMessage.time,
        stage: response.nextStage,
        messages: [assistantMessage],
        suggestions: response.suggestions,
        summary: null,
        answers: {},
        canRewrite: false,
      }))
    } finally {
      setIsBusy(false)
    }
  }

  const handleSendMessage = async (message: string) => {
    if (!activeThread || !isAnswerStage(activeThread.stage)) {
      return
    }

    const currentStage = activeThread.stage
    const userMessage = createUserMessage(message)

    updateActiveThread((thread) => ({
      ...thread,
      title: thread.messages.length === 0 ? createThreadTitle(message) : thread.title,
      preview: message,
      updatedAt: userMessage.time,
      messages: [...thread.messages, userMessage],
      answers: {
        ...thread.answers,
        [currentStage]: message,
      },
      suggestions: [],
    }))

    setIsBusy(true)

    try {
      const response = await submitCheckInAnswer({
        stage: currentStage,
        answers: {
          ...activeThread.answers,
          [currentStage]: message,
        },
      })

      if (response.summary) {
        const summary = response.summary

        updateActiveThread((thread) => ({
          ...thread,
          stage: response.nextStage,
          summary,
          preview: buildSummaryPreview(summary),
          updatedAt: formatCurrentTime(),
          suggestions: [],
          canRewrite: true,
        }))
        return
      }

      if (!response.question) {
        return
      }

      const assistantMessage = createAssistantMessage(response.question)

      updateActiveThread((thread) => ({
        ...thread,
        stage: response.nextStage,
        preview: response.question ?? thread.preview,
        updatedAt: assistantMessage.time,
        messages: [...thread.messages, assistantMessage],
        suggestions: response.suggestions,
      }))
    } finally {
      setIsBusy(false)
    }
  }

  const handleRewriteSummary = async () => {
    if (!activeThread?.summary) {
      return
    }

    setIsBusy(true)

    try {
      const rewrittenSummary = await rewriteCheckInSummary({
        emotion: activeThread.summary.emotion,
        issue: activeThread.summary.issue,
        deepdive: activeThread.summary.deepdive,
      })

      updateActiveThread((thread) => ({
        ...thread,
        summary: rewrittenSummary,
        preview: buildSummaryPreview(rewrittenSummary),
        updatedAt: formatCurrentTime(),
      }))
    } finally {
      setIsBusy(false)
    }
  }

  const handleConfirmSummary = async () => {
    if (!activeThread?.summary) {
      return
    }

    setIsBusy(true)

    try {
      await confirmCheckInSummary()
      const statusMessage = createStatusMessage(
        'Summary da duoc xac nhan. Ban co the bat dau mot phien moi bat cu luc nao.',
      )

      updateActiveThread((thread) => ({
        ...thread,
        stage: 'completed',
        canRewrite: false,
        preview: 'Completed check-in',
        updatedAt: statusMessage.time,
        messages: [...thread.messages, statusMessage],
      }))
    } finally {
      setIsBusy(false)
    }
  }

  if (!activeThread) {
    return null
  }

  const hasConversation = activeThread.messages.length > 0
  const showWelcome = activeThread.stage === 'idle' && !hasConversation
  const showComposer = isAnswerStage(activeThread.stage)

  return (
    <section className="min-h-0 overflow-hidden lg:h-[calc(100vh-1rem)] lg:max-h-[calc(100vh-1rem)]">
      <div className="grid min-h-0 gap-4 lg:h-full lg:grid-cols-[320px_minmax(0,1fr)]">
        <AIChatSidebar
          threads={threads}
          activeThreadId={activeThreadId}
          onNewChat={handleNewChat}
          onSelectThread={setActiveThreadId}
        />

        <div className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] bg-[#f7fbff] p-4 shadow-[0_24px_55px_rgba(15,23,42,0.08)]">
          <header className="shrink-0">
            <AIChatHeader stage={activeThread.stage} isBusy={isBusy} />
          </header>

          <div className="shrink-0 pt-4">
            <AIProgressSteps stage={activeThread.stage} />
          </div>

          <main className="min-h-0 flex-1 overflow-hidden pt-4">
            {showWelcome ? (
              <div className="app-scrollbar flex h-full items-center justify-center overflow-y-auto px-4">
                <AICheckInWelcome isStarting={isBusy} onStart={handleStartCheckIn} />
              </div>
            ) : (
              <div className="app-scrollbar h-full overflow-y-auto pr-1">
                <div className="mx-auto max-w-5xl space-y-4 pb-4">
                  {hasConversation ? <AIConversation messages={activeThread.messages} /> : null}

                  {activeThread.summary ? (
                    <AISummaryCard
                      summary={activeThread.summary}
                      isBusy={isBusy}
                      canRewrite={activeThread.canRewrite}
                      onConfirm={handleConfirmSummary}
                      onRewrite={handleRewriteSummary}
                    />
                  ) : null}
                </div>
              </div>
            )}
          </main>

          {showComposer ? (
            <footer className="shrink-0 pt-4">
              <AIChatComposer
                onSend={handleSendMessage}
                placeholder={stagePlaceholders[activeThread.stage]}
                suggestions={activeThread.suggestions}
                disabled={false}
                isBusy={isBusy}
                multiline={activeThread.stage === 'deepdive'}
              />
            </footer>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default AISupportPage

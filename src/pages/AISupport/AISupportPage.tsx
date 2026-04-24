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
  CheckInStage,
} from '@/components/ai-support/ai-support-data'
import { useCheckIn } from '@/hooks/chat/useCheckIn'
import { CheckInStatus, CheckInStep, type CheckInSessionDto } from '@/types/checkIn'

const DRAFT_THREAD_ID = 'draft-check-in'

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

const createStatusMessage = (text: string): AIMessage => ({
  id: createId('message'),
  role: 'assistant',
  time: formatCurrentTime(),
  text,
  kind: 'status',
})

const mapStepToStage = (
  step: CheckInStep | null | undefined,
  status: CheckInStatus | null | undefined,
): CheckInStage => {
  if (status === CheckInStatus.Completed || step === CheckInStep.Completed) {
    return 'completed'
  }

  if (
    status === CheckInStatus.AwaitingConfirmation ||
    step === CheckInStep.AwaitingConfirmation ||
    step === CheckInStep.SummaryGenerated
  ) {
    return 'summary'
  }

  if (step === CheckInStep.Step1Emotion) {
    return 'emotion'
  }

  if (step === CheckInStep.Step2MainIssue) {
    return 'issue'
  }

  if (step === CheckInStep.Step3DeepDive) {
    return 'deepdive'
  }

  return 'idle'
}

const mapSummaryToCard = (summary: string | null | undefined): AISummary | null => {
  if (!summary) {
    return null
  }

  return {
    emotion: 'Captured in summary',
    issue: 'Captured in summary',
    deepdive: 'Captured in summary',
    narrative: summary,
  }
}

const formatSessionTimestamp = (session: CheckInSessionDto) => {
  const rawValue = session.updatedAt ?? session.completedAt ?? session.createdAt

  if (!rawValue) {
    return formatCurrentTime()
  }

  const date = new Date(rawValue)

  if (Number.isNaN(date.getTime())) {
    return rawValue
  }

  return timeFormatter.format(date)
}

const getSafeSessionId = (session: CheckInSessionDto) => {
  const rawValue = session.sessionId ?? session.id

  if (typeof rawValue === 'string' && rawValue.trim().length > 0) {
    return rawValue
  }

  const fallbackSource =
    session.createdAt ??
    session.updatedAt ??
    session.completedAt ??
    session.cancelledAt ??
    session.currentStep ??
    'unknown'

  return `unknown-session-${String(fallbackSource).replace(/\s+/g, '-').toLowerCase()}`
}

const buildSessionTitle = (session: CheckInSessionDto) => {
  const summary = session.confirmedSummary ?? session.editedSummary ?? session.generatedSummary

  if (typeof summary === 'string' && summary.trim().length > 0) {
    return summary.length > 40 ? `${summary.slice(0, 40)}...` : summary
  }

  return `Check-in mới`
}

const buildSessionPreview = (session: CheckInSessionDto) => {
  if (typeof session.confirmedSummary === 'string' && session.confirmedSummary.trim().length > 0) {
    return session.confirmedSummary
  }

  if (typeof session.editedSummary === 'string' && session.editedSummary.trim().length > 0) {
    return session.editedSummary
  }

  if (typeof session.generatedSummary === 'string' && session.generatedSummary.trim().length > 0) {
    return session.generatedSummary
  }

  if (typeof session.currentQuestion === 'string' && session.currentQuestion.trim().length > 0) {
    return session.currentQuestion
  }

  return session.currentStep ?? 'Session in progress'
}

const buildMessagesFromSession = (session: CheckInSessionDto | null): AIMessage[] => {
  if (!session) {
    return []
  }

  const messages: AIMessage[] = []
  const timeLabel = formatSessionTimestamp(session)
  let index = 0

  const pushAssistant = (text?: string | null) => {
    if (!text || !text.trim()) return
    messages.push({
      id: `assistant-${index++}`,
      role: 'assistant',
      time: timeLabel,
      text,
      kind: 'question',
    })
  }

  const pushUser = (text?: string | null) => {
    if (!text || !text.trim()) return
    messages.push({
      id: `user-${index++}`,
      role: 'user',
      time: timeLabel,
      text,
      kind: 'answer',
    })
  }

  pushAssistant(session.emotionQuestion)
  pushUser(session.emotionAnswer)
  pushAssistant(session.issueQuestion)
  pushUser(session.issueAnswer)
  pushAssistant(session.deepDiveQuestion)
  pushUser(session.deepDiveAnswer)

  const currentQuestion = session.currentQuestion?.trim()
  const lastAssistantBeforeCurrent = [...messages]
    .reverse()
    .find((message) => message.role === 'assistant')?.text

  if (currentQuestion && currentQuestion !== lastAssistantBeforeCurrent) {
    pushAssistant(currentQuestion)
  }

  const lastAssistantAfterCurrent = [...messages]
    .reverse()
    .find((message) => message.role === 'assistant')?.text

  if (
    session.reviewQuestion &&
    session.currentStep === CheckInStep.AwaitingConfirmation &&
    session.reviewQuestion !== lastAssistantAfterCurrent
  ) {
    pushAssistant(session.reviewQuestion)
  }

  return messages
}

const isAnswerStage = (stage: CheckInStage): stage is 'emotion' | 'issue' | 'deepdive' =>
  stage === 'emotion' || stage === 'issue' || stage === 'deepdive'

const AISupportPage = () => {
  const {
    sessionId,
    generatedSummary,
    status,
    currentStep,
    result,
    activeSession,
    loading,
    error,
    start,
    submitAnswer,
    rewriteSummary,
    confirm,
    reset,
    loadSessionById,
    loadSessions,
    sessions,
  } = useCheckIn()

  const [activeThreadId, setActiveThreadId] = useState<string>(DRAFT_THREAD_ID)
  const [editedSummary, setEditedSummary] = useState<string | null>(null)

  useEffect(() => {
    const bootstrap = async () => {
      await loadSessions()
    }

    void bootstrap()
  }, [])

  useEffect(() => {
    if (activeSession) {
      setActiveThreadId(getSafeSessionId(activeSession))
    }
  }, [activeSession])

  useEffect(() => {
    if (activeThreadId === DRAFT_THREAD_ID) {
      setEditedSummary(null)
      return
    }

    setEditedSummary(activeSession?.editedSummary ?? null)
  }, [activeSession, activeThreadId])

  const threads = useMemo(
    () =>
      sessions.map((session) => ({
        id: getSafeSessionId(session),
        title: buildSessionTitle(session),
        preview: buildSessionPreview(session),
        updatedAt: formatSessionTimestamp(session),
        stage: mapStepToStage(session.currentStep, session.status),
        messages: [],
        summary: mapSummaryToCard(
          session.confirmedSummary ?? session.editedSummary ?? session.generatedSummary,
        ),
        answers: {},
        suggestions: [],
        canRewrite: session.status === CheckInStatus.AwaitingConfirmation,
      })),
    [sessions],
  )

  const selectedSession = useMemo(() => {
    if (activeThreadId === DRAFT_THREAD_ID) {
      return null
    }

    if (activeSession && getSafeSessionId(activeSession) === activeThreadId) {
      return activeSession
    }

    return sessions.find((session) => getSafeSessionId(session) === activeThreadId) ?? null
  }, [activeSession, activeThreadId, sessions])

  const currentStage =
    activeThreadId === DRAFT_THREAD_ID
      ? 'idle'
      : selectedSession
        ? mapStepToStage(selectedSession.currentStep, selectedSession.status)
        : mapStepToStage(currentStep, status)

  const originalSummary = selectedSession
    ? mapSummaryToCard(selectedSession.generatedSummary ?? generatedSummary)
    : null

  const rewrittenSummary = selectedSession
    ? mapSummaryToCard(editedSummary ?? selectedSession.editedSummary)
    : null

  const confirmedSummary = selectedSession
    ? mapSummaryToCard(selectedSession.confirmedSummary ?? result?.confirmedSummary)
    : null

  const currentSummary = confirmedSummary ?? rewrittenSummary ?? originalSummary

  const currentMessages = useMemo(() => buildMessagesFromSession(selectedSession), [selectedSession])
  const hasConversation = currentMessages.length > 0
  const showWelcome = activeThreadId === DRAFT_THREAD_ID
  const activeSessionKey = activeSession ? getSafeSessionId(activeSession) : sessionId
  const showComposer =
    activeSessionKey === activeThreadId &&
    selectedSession?.status !== CheckInStatus.Completed &&
    isAnswerStage(currentStage)
  const isWaitingForSummary =
    loading &&
    activeSessionKey === activeThreadId &&
    currentStage === 'deepdive' &&
    !currentSummary

  const handleRefreshSessions = async () => {
    const sessionList = await loadSessions()

    if (!sessionList || !activeThreadId || activeThreadId === DRAFT_THREAD_ID) {
      return
    }

    const targetSession = sessionList.find((session) => getSafeSessionId(session) === activeThreadId)

    if (targetSession) {
      await loadSessionById(getSafeSessionId(targetSession))
    }
  }

  const handleNewChat = () => {
    reset()
    setEditedSummary(null)
    setActiveThreadId(DRAFT_THREAD_ID)
  }

  const handleStartCheckIn = async () => {
    setEditedSummary(null)

    const response = await start('Text')

    if (!response) {
      return
    }

    setActiveThreadId(response.sessionId)
    await loadSessions()
    await loadSessionById(response.sessionId)
  }

  const handleSendMessage = async (message: string) => {
    if (!activeSessionKey || activeThreadId !== activeSessionKey) {
      return
    }

    const response = await submitAnswer(message)

    if (!response) {
      return
    }

    if (response.summary) {
      setEditedSummary(null)
    }

    await handleRefreshSessions()
  }

  const handleSelectThread = async (threadId: string) => {
    setActiveThreadId(threadId)

    if (threadId === DRAFT_THREAD_ID) {
      reset()
      setEditedSummary(null)
      return
    }

    await loadSessionById(threadId)
  }

  const handleRewriteSummary = () => {
    const sourceSummary = editedSummary ?? generatedSummary

    if (!sourceSummary) {
      return
    }

    void (async () => {
      const response = await rewriteSummary(sourceSummary)

      if (!response) {
        return
      }

      setEditedSummary(response.rewrittenText)
    })()
  }

  const handleConfirmSummary = async () => {
    const response = await confirm(editedSummary ?? generatedSummary ?? undefined)

    if (!response) {
      return
    }

    setEditedSummary(response.confirmedSummary)
    await handleRefreshSessions()
  }

  return (
    <section className="min-h-0 overflow-hidden lg:h-[calc(100vh-1rem)] lg:max-h-[calc(100vh-1rem)]">
      <div className="grid min-h-0 gap-4 lg:h-full lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] bg-[#f7fbff] p-4 shadow-[0_24px_55px_rgba(15,23,42,0.08)]">
          <header className="shrink-0">
            <AIChatHeader stage={currentStage} isBusy={loading} />
          </header>

          <div className="shrink-0 pt-4">
            <AIProgressSteps stage={currentStage} />
          </div>

          <main className="min-h-0 flex-1 overflow-hidden pt-4">
            {showWelcome ? (
              <div className="app-scrollbar flex h-full items-center justify-center overflow-y-auto px-4">
                <AICheckInWelcome isStarting={loading} onStart={handleStartCheckIn} />
              </div>
            ) : (
              <div className="app-scrollbar h-full overflow-y-auto pr-1">
                <div className="mx-auto max-w-5xl space-y-4 pb-4">
                  {error ? (
                    <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                      {error}
                    </div>
                  ) : null}

                  {hasConversation ? <AIConversation messages={currentMessages} /> : null}

                  {isWaitingForSummary ? (
                    <div className="rounded-[2rem] border border-sky-100 bg-white px-6 py-5 text-slate-600 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                        Summary in progress
                      </p>
                      <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">
                        Hệ thống tổng hợp nội dung từ câu trả lời của bạn và đưa ra tổng kết.
                      </p>
                    </div>
                  ) : null}

                  {currentSummary ? (
                    <AISummaryCard
                      summary={currentSummary}
                      originalSummary={originalSummary}
                      rewrittenSummary={rewrittenSummary}
                      isBusy={loading}
                      canRewrite={
                        activeSessionKey === activeThreadId &&
                        selectedSession?.status === CheckInStatus.AwaitingConfirmation
                      }
                      showActions={selectedSession?.status !== CheckInStatus.Completed}
                      onConfirm={handleConfirmSummary}
                      onRewrite={handleRewriteSummary}
                    />
                  ) : null}

                  {!hasConversation && !currentSummary && selectedSession ? (
                    <div className="rounded-[2rem] bg-white px-6 py-6 text-slate-600 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Session Snapshot
                      </p>
                      <p className="mt-3 text-base leading-7">
                        Session này đang ở trạng thái <span className="font-semibold">{selectedSession.status}</span>{' '}
                        tai buoc <span className="font-semibold">{selectedSession.currentStep}</span>.
                      </p>
                    </div>
                  ) : null}

                  {result ? (
                    <div className="rounded-[2rem] bg-white px-6 py-6 text-slate-600 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                        Session Completed
                      </p>
                      <p className="mt-3 text-base leading-7">
                        Summary đã được xác nhận.
                      </p>
                      <div className="mt-4">
                        <div className="rounded-[1.5rem] bg-slate-50 px-4 py-4 text-sm text-slate-700">
                          {createStatusMessage('Summary đã được xác nhận.').text}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </main>

          {showComposer ? (
            <footer className="shrink-0 pt-4">
              <AIChatComposer
                onSend={handleSendMessage}
                placeholder={stagePlaceholders[currentStage]}
                suggestions={[]}
                disabled={false}
                isBusy={loading}
                multiline={currentStage === 'deepdive'}
              />
            </footer>
          ) : null}
        </div>

        <AIChatSidebar
          threads={threads}
          activeThreadId={activeThreadId}
          onNewChat={handleNewChat}
          onSelectThread={(threadId) => {
            void handleSelectThread(threadId)
          }}
        />
      </div>
    </section>
  )
}

export default AISupportPage

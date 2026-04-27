import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

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
import CheckInCompletedPanel from '@/components/matching/CheckInCompletedPanel'
import MatchingQueuePanel from '@/components/matching/MatchingQueuePanel'
import { useCheckIn } from '@/hooks/chat/useCheckIn'
import { useMatchingQueue } from '@/hooks/matching/useMatchingQueue'
import {
  buildSessionPreview,
  buildSessionTitle,
  formatSessionTimestamp,
  getSafeSessionId,
  mapStepToStage,
} from '@/lib/checkInSessionUi'
import { matchingService } from '@/services/matchingService'
import {
  CheckInStatus,
  CheckInStep,
  type CheckInCompletedDto,
  type CheckInSessionDto,
} from '@/types/checkIn'
import {
  MatchingRequestStatus,
  MatchingRoomStatus,
} from '@/types/matching'

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

type WorkspaceView = 'draft' | 'checkin' | 'completed' | 'queue'

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const formatCurrentTime = () => timeFormatter.format(new Date())

const createStatusMessage = (text: string): AIMessage => ({
  id: createId('message'),
  role: 'assistant',
  time: formatCurrentTime(),
  text,
  kind: 'status',
})

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
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const requestedSessionId = searchParams.get('sessionId')

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
    loadSessionResultById,
    loadSessions,
    sessions,
  } = useCheckIn()

  const {
    queueState,
    loading: matchingLoading,
    error: matchingError,
    joinQueue,
    leaveQueue,
    setQueueState,
  } = useMatchingQueue(null)

  const [activeThreadId, setActiveThreadId] = useState<string>(DRAFT_THREAD_ID)
  const [editedSummary, setEditedSummary] = useState<string | null>(null)
  const [workspaceView, setWorkspaceView] = useState<WorkspaceView>('draft')
  const [selectedResult, setSelectedResult] = useState<CheckInCompletedDto | null>(null)
  const [joiningQueue, setJoiningQueue] = useState(false)

  const conversationEndRef = useRef<HTMLDivElement | null>(null)

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
    workspaceView === 'completed' || workspaceView === 'queue'
      ? 'completed'
      : workspaceView === 'draft'
        ? 'idle'
        : selectedSession
          ? mapStepToStage(selectedSession.currentStep, selectedSession.status)
          : mapStepToStage(currentStep, status)

  const originalSummary =
    workspaceView === 'checkin' && selectedSession
      ? mapSummaryToCard(selectedSession.generatedSummary ?? generatedSummary)
      : null

  const rewrittenSummary =
    workspaceView === 'checkin' && selectedSession
      ? mapSummaryToCard(editedSummary ?? selectedSession.editedSummary)
      : null

  const confirmedSummary =
    workspaceView === 'checkin' && selectedSession
      ? mapSummaryToCard(selectedSession.confirmedSummary ?? result?.confirmedSummary)
      : null

  const currentSummary = confirmedSummary ?? rewrittenSummary ?? originalSummary
  const currentMessages = useMemo(
    () => (workspaceView === 'checkin' ? buildMessagesFromSession(selectedSession) : []),
    [selectedSession, workspaceView],
  )
  const hasConversation = currentMessages.length > 0
  const showWelcome = workspaceView === 'draft'
  const activeSessionKey = activeSession ? getSafeSessionId(activeSession) : sessionId
  const showComposer =
    workspaceView === 'checkin' &&
    activeSessionKey === activeThreadId &&
    selectedSession?.status !== CheckInStatus.Completed &&
    isAnswerStage(currentStage)
  const isWaitingForSummary =
    workspaceView === 'checkin' &&
    loading &&
    activeSessionKey === activeThreadId &&
    currentStage === 'deepdive' &&
    !currentSummary

  const clearMatchingState = useCallback(() => {
    setSelectedResult(null)
    setQueueState(null)
    setJoiningQueue(false)
  }, [setQueueState])

  const openSession = useCallback(
    async (threadId: string) => {
      setActiveThreadId(threadId)

      if (threadId === DRAFT_THREAD_ID) {
        reset()
        setEditedSummary(null)
        clearMatchingState()
        setWorkspaceView('draft')
        navigate('/ai', { replace: true })
        return
      }

      const targetSession = sessions.find((session) => getSafeSessionId(session) === threadId)

      if (!targetSession) {
        return
      }

      const selectedSessionId = getSafeSessionId(targetSession)
      navigate(`/ai?sessionId=${selectedSessionId}`, { replace: true })

      if (targetSession.status !== CheckInStatus.Completed) {
        clearMatchingState()
        setEditedSummary(null)
        setWorkspaceView('checkin')
        await loadSessionById(selectedSessionId)
        return
      }

      const sessionResult = await loadSessionResultById(selectedSessionId)

      if (!sessionResult) {
        return
      }

      setSelectedResult(sessionResult)

      if (!sessionResult.matchingRequestId) {
        setQueueState(null)
        setWorkspaceView('completed')
        return
      }

      const matchingStatus = await matchingService.getStatus(sessionResult.matchingRequestId)

      if (!matchingStatus.success || !matchingStatus.data) {
        setQueueState(null)
        setWorkspaceView('completed')
        return
      }

      const nextQueueState = matchingStatus.data

      setQueueState(nextQueueState)

      if (
        nextQueueState.requestStatus === MatchingRequestStatus.Queued ||
        nextQueueState.requestStatus === MatchingRequestStatus.Assigned ||
        nextQueueState.canEnterRoom ||
        nextQueueState.roomStatus === MatchingRoomStatus.Ready ||
        nextQueueState.roomStatus === MatchingRoomStatus.Active
      ) {
        setWorkspaceView('queue')
        return
      }

      setWorkspaceView('completed')
    },
    [
      clearMatchingState,
      loadSessionById,
      loadSessionResultById,
      navigate,
      reset,
      sessions,
      setQueueState,
    ],
  )

  useEffect(() => {
    const bootstrap = async () => {
      const sessionList = await loadSessions()

      if (!requestedSessionId || !sessionList) {
        return
      }

      const targetSession = sessionList.find((session) => getSafeSessionId(session) === requestedSessionId)

      if (targetSession) {
        await openSession(requestedSessionId)
      }
    }

    void bootstrap()
    // Intentionally keyed only by the requested session id to avoid re-running on every render
    // when hook functions receive new identities.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedSessionId])

  useEffect(() => {
    if (activeSession && workspaceView === 'checkin') {
      setActiveThreadId(getSafeSessionId(activeSession))
    }
  }, [activeSession, workspaceView])

  useEffect(() => {
    if (workspaceView !== 'checkin') {
      return
    }

    if (activeThreadId === DRAFT_THREAD_ID) {
      setEditedSummary(null)
      return
    }

    setEditedSummary(activeSession?.editedSummary ?? null)
  }, [activeSession, activeThreadId, workspaceView])

  useEffect(() => {
    if (workspaceView !== 'checkin') {
      return
    }

    conversationEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [currentMessages, currentSummary, isWaitingForSummary, result, workspaceView])

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
    void openSession(DRAFT_THREAD_ID)
  }

  const handleStartCheckIn = async () => {
    setEditedSummary(null)
    clearMatchingState()

    const response = await start('Text')

    if (!response) {
      return
    }

    const nextSessionId = response.sessionId
    setActiveThreadId(nextSessionId)
    setWorkspaceView('checkin')
    navigate(`/ai?sessionId=${nextSessionId}`, { replace: true })
    await loadSessions()
    await loadSessionById(nextSessionId)
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
    setSelectedResult(response)
    setQueueState(null)
    setWorkspaceView('completed')
    navigate(`/ai?sessionId=${response.sessionId}`, { replace: true })
    await loadSessions()
  }

  const handleJoinQueue = () => {
    const matchingRequestId = selectedResult?.matchingRequestId

    if (!matchingRequestId) {
      return
    }

    void (async () => {
      setJoiningQueue(true)
      const response = await joinQueue(matchingRequestId)
      setJoiningQueue(false)

      if (!response) {
        return
      }

      setQueueState(response)
      setWorkspaceView('queue')
    })()
  }

  const handleLeaveQueue = () => {
    const matchingRequestId = selectedResult?.matchingRequestId

    if (!matchingRequestId) {
      return
    }

    void (async () => {
      const success = await leaveQueue(matchingRequestId)

      if (success) {
        setWorkspaceView('completed')
      }
    })()
  }

  const handleEnterRoom = () => {
    if (!queueState?.roomId) {
      return
    }

    navigate(`/groups?roomId=${queueState.roomId}`)
  }

  const handleDefer = () => {
    navigate('/home')
  }

  const renderWorkspace = () => {
    if (showWelcome) {
      return (
        <div className="app-scrollbar flex h-full items-center justify-center overflow-y-auto px-4">
          <AICheckInWelcome isStarting={loading} onStart={handleStartCheckIn} />
        </div>
      )
    }

    if (workspaceView === 'completed' && selectedResult) {
      return (
        <div className="app-scrollbar h-full overflow-y-auto pr-1">
          <CheckInCompletedPanel
            result={selectedResult}
            joiningQueue={joiningQueue}
            error={matchingError}
            onJoinQueue={handleJoinQueue}
            onDefer={handleDefer}
          />
        </div>
      )
    }

    if (workspaceView === 'queue') {
      return (
        <div className="app-scrollbar h-full overflow-y-auto pr-1">
          <MatchingQueuePanel
            result={selectedResult}
            queueState={queueState}
            loading={matchingLoading}
            error={matchingError}
            contextLoading={loading && !selectedResult}
            onEnterRoom={handleEnterRoom}
            onLeaveQueue={handleLeaveQueue}
            onDefer={handleDefer}
          />
        </div>
      )
    }

    return (
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
                He thong dang tong hop noi dung tu cau tra loi cua ban va dua ra tong ket.
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
                Session nay dang o trang thai <span className="font-semibold">{selectedSession.status}</span> tai
                buoc <span className="font-semibold">{selectedSession.currentStep}</span>.
              </p>
            </div>
          ) : null}

          {result ? (
            <div className="rounded-[2rem] bg-white px-6 py-6 text-slate-600 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Session Completed
              </p>
              <p className="mt-3 text-base leading-7">Summary da duoc xac nhan.</p>
              <div className="mt-4">
                <div className="rounded-[1.5rem] bg-slate-50 px-4 py-4 text-sm text-slate-700">
                  {createStatusMessage('Summary da duoc xac nhan.').text}
                </div>
              </div>
            </div>
          ) : null}

          <div ref={conversationEndRef} />
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-0 overflow-hidden lg:h-[calc(100vh-1rem)] lg:max-h-[calc(100vh-1rem)]">
      <div className="grid min-h-0 gap-4 lg:h-full lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-h-0 flex-col overflow-hidden rounded-[2rem] bg-[#f7fbff] p-4 shadow-[0_24px_55px_rgba(15,23,42,0.08)]">
          <header className="shrink-0">
            <AIChatHeader stage={currentStage} isBusy={loading || matchingLoading || joiningQueue} />
          </header>

          <div className="shrink-0 pt-4">
            <AIProgressSteps stage={currentStage} />
          </div>

          <main className="min-h-0 flex-1 overflow-hidden pt-4">{renderWorkspace()}</main>

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
            void openSession(threadId)
          }}
        />
      </div>
    </section>
  )
}

export default AISupportPage

import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { AIThread } from '@/components/ai-support/ai-support-data'
import { checkInService } from '@/services/checkInService'
import { type CheckInSessionDto, CheckInStatus } from '@/types/checkIn'
import {
  buildSessionPreview,
  buildSessionTitle,
  formatSessionTimestamp,
  getSafeSessionId,
  mapStepToStage,
} from '@/lib/checkInSessionUi'

export const useCheckInSessionSidebar = (currentSessionId?: string | null) => {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<CheckInSessionDto[]>([])
  const [sidebarLoading, setSidebarLoading] = useState(false)
  const [activeThreadId, setActiveThreadId] = useState<string | null>(currentSessionId ?? null)

  useEffect(() => {
    setActiveThreadId(currentSessionId ?? null)
  }, [currentSessionId])

  const loadSessions = async () => {
    setSidebarLoading(true)

    const result = await checkInService.getMySessions()

    if (!result.success || !result.data) {
      setSessions([])
      setSidebarLoading(false)
      return undefined
    }

    const normalizedSessions = Array.isArray(result.data)
      ? result.data
      : Array.isArray((result.data as { data?: unknown }).data)
        ? ((result.data as { data: CheckInSessionDto[] }).data ?? [])
        : []

    setSessions(normalizedSessions)
    setSidebarLoading(false)
    return normalizedSessions
  }

  useEffect(() => {
    void loadSessions()
  }, [])

  const threads = useMemo<AIThread[]>(
    () =>
      (Array.isArray(sessions) ? sessions : []).map((session) => ({
        id: getSafeSessionId(session),
        title: buildSessionTitle(session),
        preview: buildSessionPreview(session),
        updatedAt: formatSessionTimestamp(session),
        stage: mapStepToStage(session.currentStep, session.status),
        messages: [],
        summary: null,
        answers: {},
        suggestions: [],
        canRewrite: session.status === CheckInStatus.AwaitingConfirmation,
      })),
    [sessions],
  )

  const selectSession = async (threadId: string) => {
    setActiveThreadId(threadId)

    const targetSession = sessions.find((session) => getSafeSessionId(session) === threadId)

    if (!targetSession) {
      return
    }

    const selectedSessionId = getSafeSessionId(targetSession)
    navigate(`/ai?sessionId=${selectedSessionId}`)
  }

  return {
    threads,
    activeThreadId,
    setActiveThreadId,
    selectSession,
    loadSessions,
    sidebarLoading,
  }
}

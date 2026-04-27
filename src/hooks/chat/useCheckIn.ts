import { useState } from 'react'

import { checkInService } from '@/services/checkInService'
import {
  CheckInCompletedDto,
  CheckInStartResponseDto,
  CheckInStepResponseDto,
  CheckInStatus,
  CheckInStep,
  CheckInSessionDto,
  RewriteSummaryResponseDto,
} from '@/types/checkIn'

interface CheckInState {
  sessionId: string | null
  question: string | null
  currentStep: CheckInStep | null
  generatedSummary: string | null
  status: CheckInStatus | null
  result: CheckInCompletedDto | null
  activeSession: CheckInSessionDto | null
  loading: boolean
  error: string | null
}

const INITIAL_STATE: CheckInState = {
  sessionId: null,
  question: null,
  generatedSummary: null,
  currentStep: null,
  status: null,
  result: null,
  activeSession: null,
  loading: false,
  error: null,
}

const getSessionKey = (session: Pick<CheckInSessionDto, 'sessionId' | 'id'>) =>
  session.sessionId ?? session.id ?? null

export const useCheckIn = () => {
  const [state, setState] = useState<CheckInState>(INITIAL_STATE)
  const [sessions, setSessions] = useState<CheckInSessionDto[]>([])

  const setLoading = (loading: boolean) =>
    setState((prev) => ({ ...prev, loading, error: loading ? null : prev.error }))

  const setError = (error: string) =>
    setState((prev) => ({ ...prev, error, loading: false }))

  const loadSessions = async (): Promise<CheckInSessionDto[] | undefined> => {
    setLoading(true)

    const result = await checkInService.getMySessions()

    if (!result.success || !result.data) {
      setError(result.message ?? 'Loi khi lay ra danh sach session history')
      return
    }

    setSessions(result.data)
    setLoading(false)
    return result.data
  }

  const start = async (
    inputMode: 'Text' | 'Voice' = 'Text',
  ): Promise<CheckInStartResponseDto | undefined> => {
    setLoading(true)

    const result = await checkInService.start({ inputMode })

    if (!result.success || !result.data) {
      setError(result.message ?? 'Loi khi bat dau session')
      return
    }

    const res = result.data

    setState((prev) => ({
      ...prev,
      sessionId: res.sessionId,
      currentStep: res.currentStep,
      generatedSummary: null,
      question: res.firstQuestion,
      status: res.status,
      result: null,
      activeSession: {
        sessionId: res.sessionId,
        status: res.status,
        currentStep: res.currentStep,
        inputMode: res.inputMode,
        currentQuestion: res.firstQuestion,
        emotionQuestion: res.currentStep === CheckInStep.Step1Emotion ? res.firstQuestion : null,
        issueQuestion: null,
        deepDiveQuestion: null,
        reviewQuestion: null,
        emotionAnswer: null,
        issueAnswer: null,
        deepDiveAnswer: null,
        generatedSummary: null,
        editedSummary: null,
        confirmedSummary: null,
      },
      loading: false,
      error: null,
    }))

    return res
  }

  const submitAnswer = async (content: string): Promise<CheckInStepResponseDto | undefined> => {
    if (!state.sessionId) return
    setLoading(true)

    const previousStep = state.currentStep
    const result = await checkInService.submitAnswer(state.sessionId, { content })

    if (!result.success || !result.data) {
      setError(result.message ?? 'Loi khi gui cau tra loi')
      return
    }

    const res = result.data

    setState((prev) => {
      const activeSession = prev.activeSession
        ? {
            ...prev.activeSession,
            status: res.status,
            currentStep: res.currentStep,
            currentQuestion: res.nextQuestion ?? null,
            generatedSummary: res.summary ?? prev.activeSession.generatedSummary ?? null,
            reviewQuestion:
              res.isAwaitingConfirmation || res.summary
                ? prev.activeSession.reviewQuestion ?? prev.activeSession.currentQuestion ?? null
                : prev.activeSession.reviewQuestion ?? null,
            emotionAnswer:
              previousStep === CheckInStep.Step1Emotion
                ? content
                : prev.activeSession.emotionAnswer ?? null,
            issueAnswer:
              previousStep === CheckInStep.Step2MainIssue ? content : prev.activeSession.issueAnswer ?? null,
            deepDiveAnswer:
              previousStep === CheckInStep.Step3DeepDive
                ? content
                : prev.activeSession.deepDiveAnswer ?? null,
            issueQuestion:
              res.currentStep === CheckInStep.Step2MainIssue && res.nextQuestion
                ? res.nextQuestion
                : prev.activeSession.issueQuestion ?? null,
            deepDiveQuestion:
              res.currentStep === CheckInStep.Step3DeepDive && res.nextQuestion
                ? res.nextQuestion
                : prev.activeSession.deepDiveQuestion ?? null,
          }
        : prev.activeSession

      return {
        ...prev,
        status: res.status,
        currentStep: res.currentStep,
        question: res.nextQuestion ?? null,
        generatedSummary: res.summary ?? prev.generatedSummary,
        activeSession,
        loading: false,
        error: null,
      }
    })

    return res
  }

  const loadActice = async (): Promise<void> => {
    setLoading(true)

    const result = await checkInService.getActive()

    if (!result.success) {
      setError(result.message ?? 'Loi khi lay session active')
      return
    }

    const session = result.data

    if (!session) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: null,
      }))
      return
    }

    setState((prev) => ({
      ...prev,
      sessionId: getSessionKey(session),
      question: session.currentQuestion ?? null,
      currentStep: session.currentStep,
      status: session.status,
      generatedSummary: session.generatedSummary ?? session.editedSummary ?? session.confirmedSummary ?? null,
      result: null,
      activeSession: session,
      loading: false,
      error: null,
    }))
  }

  const loadSessionById = async (sessionId: string): Promise<CheckInSessionDto | undefined> => {
    setLoading(true)

    const result = await checkInService.getSessionById(sessionId)

    if (!result.success || !result.data) {
      setError(result.message ?? 'Loi khi lay chi tiet session')
      return
    }

    const session = result.data

    setState((prev) => ({
      ...prev,
      sessionId: getSessionKey(session),
      question: session.currentQuestion ?? null,
      currentStep: session.currentStep,
      status: session.status,
      generatedSummary: session.generatedSummary ?? session.editedSummary ?? session.confirmedSummary ?? null,
      result: null,
      activeSession: session,
      loading: false,
      error: null,
    }))

    return session
  }

  const confirm = async (editedSummary?: string): Promise<CheckInCompletedDto | undefined> => {
    if (!state.sessionId) return
    setLoading(true)

    const result = await checkInService.confirm(state.sessionId, {
      isConfirmed: true,
      editedSummary,
    })

    if (!result.success || !result.data) {
      setError(result.message ?? 'Loi khi xac nhan session')
      return
    }

    const res = result.data

    setState((prev) => ({
      ...prev,
      result: res,
      status: CheckInStatus.Completed,
      currentStep: CheckInStep.Completed,
      question: null,
      activeSession: prev.activeSession
        ? {
            ...prev.activeSession,
            status: CheckInStatus.Completed,
            currentStep: CheckInStep.Completed,
            currentQuestion: null,
            confirmedSummary: res.confirmedSummary,
          }
        : prev.activeSession,
      loading: false,
      error: null,
    }))

    return res
  }

  const rewriteSummary = async (text: string): Promise<RewriteSummaryResponseDto | undefined> => {
    setLoading(true)

    const result = await checkInService.rewrite({ text })

    if (!result.success || !result.data) {
      setError(result.message ?? 'Loi khi rewrite summary')
      return
    }

    const res = result.data

    setState((prev) => ({
      ...prev,
      generatedSummary: res.rewrittenText,
      activeSession: prev.activeSession
        ? {
            ...prev.activeSession,
            editedSummary: res.rewrittenText,
          }
        : prev.activeSession,
      loading: false,
      error: null,
    }))

    return res
  }

  const cancel = async (): Promise<void> => {
    if (!state.sessionId) return
    setLoading(true)

    const result = await checkInService.cancel(state.sessionId)

    if (!result.success) {
      setError(result.message ?? 'Loi khi huy session')
      return
    }

    setState((prev) => ({
      ...prev,
      status: CheckInStatus.Cancelled,
      currentStep: null,
      generatedSummary: null,
      result: null,
      activeSession: null,
      sessionId: null,
      question: null,
      loading: false,
      error: null,
    }))
  }

  const reset = () => setState(INITIAL_STATE)

  return {
    sessionId: state.sessionId,
    question: state.question,
    generatedSummary: state.generatedSummary,
    status: state.status,
    result: state.result,
    activeSession: state.activeSession,
    currentStep: state.currentStep,
    loading: state.loading,
    error: state.error,
    start,
    submitAnswer,
    rewriteSummary,
    confirm,
    cancel,
    reset,
    loadActice,
    loadSessionById,
    loadSessions,
    sessions,
  }
}

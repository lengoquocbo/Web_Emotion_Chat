import { useState } from 'react'

import { checkInService } from '@/services/checkInService'
import type {
  CheckInCompletedDto,
  CheckInStartResponseDto,
  CheckInStepResponseDto,
  CheckInStatus,
} from '@/types/checkIn'

interface CheckInState {
  sessionId: string | null
  question: string | null
  generatedSummary: string | null
  status: CheckInStatus | null
  result: CheckInCompletedDto | null
  loading: boolean
  error: string | null
}

const INITIAL_STATE: CheckInState = {
  sessionId: null,
  question: null,
  generatedSummary: null,
  status: null,
  result: null,
  loading: false,
  error: null,
}

export const useCheckIn = () => {
  const [state, setState] = useState<CheckInState>(INITIAL_STATE)

  const setLoading = (loading: boolean) =>
    setState((prev) => ({ ...prev, loading, error: loading ? null : prev.error }))

  const setError = (error: string) =>
    setState((prev) => ({ ...prev, error, loading: false }))

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
      question: res.question,
      status: res.status,
      loading: false,
      error: null,
    }))

    return res
  }

  const submitAnswer = async (content: string): Promise<CheckInStepResponseDto | undefined> => {
    if (!state.sessionId) return
    setLoading(true)

    const result = await checkInService.submitAnswer(state.sessionId, { content })

    if (!result.success || !result.data) {
      setError(result.message ?? 'Loi khi gui cau tra loi')
      return
    }

    const res = result.data

    setState((prev) => ({
      ...prev,
      status: res.status,
      question: res.question ?? null,
      generatedSummary: res.generatedSummary ?? prev.generatedSummary,
      loading: false,
      error: null,
    }))

    return res
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
      status: 'Completed',
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
      status: 'Cancelled',
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
    loading: state.loading,
    error: state.error,
    start,
    submitAnswer,
    confirm,
    cancel,
    reset,
  }
}

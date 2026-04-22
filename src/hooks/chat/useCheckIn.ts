// hooks/chat/useCheckIn.ts
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
  /** Câu hỏi hiện tại từ server */
  question: string | null
  /** Summary được server generate sau Step3 */
  generatedSummary: string | null
  /** Status từ server (dùng để sync với BE nếu cần) */
  status: CheckInStatus | null
  /** Kết quả đầy đủ sau confirm */
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

  // ── start ──────────────────────────────────────────────────────────────────
  const start = async (inputMode: 'Text' | 'Voice' = 'Text'): Promise<CheckInStartResponseDto | undefined> => {
    setLoading(true)
    try {
      const res = await checkInService.start({ inputMode })
      setState((prev) => ({
        ...prev,
        sessionId: res.sessionId,
        question: res.question,
        status: res.status,
        loading: false,
        error: null,
      }))
      return res
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Lỗi khi bắt đầu session')
    }
  }

  // ── submitAnswer ───────────────────────────────────────────────────────────
  const submitAnswer = async (content: string): Promise<CheckInStepResponseDto | undefined> => {
    if (!state.sessionId) return
    setLoading(true)
    try {
      const res = await checkInService.submitAnswer(state.sessionId, { content })
      setState((prev) => ({
        ...prev,
        status: res.status,
        question: res.question ?? null,
        generatedSummary: res.generatedSummary ?? prev.generatedSummary,
        loading: false,
        error: null,
      }))
      return res
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Lỗi khi gửi câu trả lời')
    }
  }

  // ── confirm ────────────────────────────────────────────────────────────────
  const confirm = async (editedSummary?: string): Promise<CheckInCompletedDto | undefined> => {
    if (!state.sessionId) return
    setLoading(true)
    try {
      const res = await checkInService.confirm(state.sessionId, {
        isConfirmed: true,
        editedSummary,
      })
      setState((prev) => ({
        ...prev,
        result: res,
        status: 'Completed',
        loading: false,
        error: null,
      }))
      return res
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Lỗi khi xác nhận session')
    }
  }

  // ── cancel ─────────────────────────────────────────────────────────────────
  const cancel = async (): Promise<void> => {
    if (!state.sessionId) return
    setLoading(true)
    try {
      await checkInService.cancel(state.sessionId)
      setState((prev) => ({
        ...prev,
        status: 'Cancelled',
        sessionId: null,
        question: null,
        loading: false,
        error: null,
      }))
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Lỗi khi huỷ session')
    }
  }

  // ── reset (local only, không gọi API) ─────────────────────────────────────
  const reset = () => setState(INITIAL_STATE)

  return {
    // state
    sessionId: state.sessionId,
    question: state.question,
    generatedSummary: state.generatedSummary,
    status: state.status,
    result: state.result,
    loading: state.loading,
    error: state.error,
    // actions
    start,
    submitAnswer,
    confirm,
    cancel,
    reset,
  }
}
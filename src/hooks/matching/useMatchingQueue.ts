import { useCallback, useEffect, useRef, useState } from 'react'

import { matchingService } from '@/services/matchingService'
import {
  MatchingRequestStatus,
  type MatchingQueueState,
  isMatchingTerminalState,
} from '@/types/matching'

const POLL_INTERVAL_MS = 5000

export const useMatchingQueue = (initialState?: MatchingQueueState | null) => {
  const [queueState, setQueueState] = useState<MatchingQueueState | null>(initialState ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const pollRef = useRef<number | null>(null)

  const clearPoll = useCallback(() => {
    if (pollRef.current !== null) {
      window.clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  const syncStatus = useCallback(async (matchingRequestId: string) => {
    setLoading(true)
    setError(null)

    const result = await matchingService.getStatus(matchingRequestId)

    if (!result.success || !result.data) {
      setError(result.message ?? 'Loi khi dong bo queue')
      setLoading(false)
      return undefined
    }

    setQueueState(result.data)
    setLoading(false)
    return result.data
  }, [])

  const joinQueue = useCallback(async (matchingRequestId: string) => {
    setLoading(true)
    setError(null)

    const result = await matchingService.joinOrCreate(matchingRequestId)

    if (!result.success || !result.data) {
      setError(result.message ?? 'Loi khi tham gia queue')
      setLoading(false)
      return undefined
    }

    setQueueState(result.data)
    setLoading(false)
    return result.data
  }, [])

  const leaveQueue = useCallback(async (matchingRequestId: string) => {
    setLoading(true)
    setError(null)

    const result = await matchingService.leaveQueue(matchingRequestId)

    if (!result.success) {
      setError(result.message ?? 'Loi khi roi queue')
      setLoading(false)
      return false
    }

    clearPoll()
    setQueueState((prev) =>
      prev
        ? {
            ...prev,
            roomId: null,
            requestStatus: MatchingRequestStatus.Cancelled,
            roomStatus: prev.roomStatus ?? null,
            canEnterRoom: false,
          }
        : prev,
    )
    setLoading(false)
    return true
  }, [clearPoll])

  useEffect(() => clearPoll, [clearPoll])

  useEffect(() => {
    clearPoll()

    if (!queueState?.matchingRequestId || isMatchingTerminalState(queueState)) {
      return
    }

    pollRef.current = window.setInterval(() => {
      void syncStatus(queueState.matchingRequestId)
    }, POLL_INTERVAL_MS)

    return clearPoll
  }, [clearPoll, queueState, syncStatus])

  return {
    queueState,
    loading,
    error,
    setQueueState,
    joinQueue,
    syncStatus,
    leaveQueue,
  }
}

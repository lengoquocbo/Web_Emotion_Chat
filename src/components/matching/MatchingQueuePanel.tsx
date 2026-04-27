import MatchingCandidatesPreview from '@/components/matching/MatchingCandidatesPreview'
import MatchingQueueCard from '@/components/matching/MatchingQueueCard'
import CheckInResultCard from '@/components/matching/CheckInResultCard'
import type { CheckInCompletedDto } from '@/types/checkIn'
import { MatchingRequestStatus, type MatchingQueueState } from '@/types/matching'

type MatchingQueuePanelProps = {
  result: CheckInCompletedDto | null
  queueState: MatchingQueueState | null
  loading: boolean
  error: string | null
  contextLoading: boolean
  onEnterRoom: () => void
  onLeaveQueue: () => void
  onDefer: () => void
}

export default function MatchingQueuePanel({
  result,
  queueState,
  loading,
  error,
  contextLoading,
  onEnterRoom,
  onLeaveQueue,
  onDefer,
}: MatchingQueuePanelProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {result ? (
        <CheckInResultCard summary={result.confirmedSummary} topEmotion={result.topEmotion} />
      ) : null}

      {queueState ? (
        <MatchingQueueCard
          queueState={queueState}
          isBusy={loading}
          onEnterRoom={onEnterRoom}
          onLeaveQueue={onLeaveQueue}
          onDefer={onDefer}
        />
      ) : (
        <div className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_22px_48px_rgba(15,23,42,0.08)]">
          <p className="text-sm text-slate-500">Dang tai trang thai matching queue...</p>
        </div>
      )}

      {error ? (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {contextLoading ? (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
          Dang tai lai du lieu session...
        </div>
      ) : null}

      {queueState?.requestStatus === MatchingRequestStatus.Cancelled ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          Matching request nay da o trang thai Cancelled.
        </div>
      ) : null}

      {result && result.candidates.length > 0 ? (
        <section className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_22px_48px_rgba(15,23,42,0.08)]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Candidate Preview
          </p>
          <div className="mt-5">
            <MatchingCandidatesPreview candidates={result.candidates} />
          </div>
        </section>
      ) : null}
    </div>
  )
}

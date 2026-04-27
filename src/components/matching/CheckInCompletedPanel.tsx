import CheckInResultCard from '@/components/matching/CheckInResultCard'
import JoinQueueButton from '@/components/matching/JoinQueueButton'
import MatchingCandidatesPreview from '@/components/matching/MatchingCandidatesPreview'
import type { CheckInCompletedDto } from '@/types/checkIn'

type CheckInCompletedPanelProps = {
  result: CheckInCompletedDto
  joiningQueue: boolean
  error: string | null
  onJoinQueue: () => void
  onDefer: () => void
}

export default function CheckInCompletedPanel({
  result,
  joiningQueue,
  error,
  onJoinQueue,
  onDefer,
}: CheckInCompletedPanelProps) {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <CheckInResultCard summary={result.confirmedSummary} topEmotion={result.topEmotion} />

      <section className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_22px_48px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              Matching Candidates
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Nhom goi y sau check-in
            </h3>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <JoinQueueButton disabled={joiningQueue} onClick={onJoinQueue} />
            <button
              onClick={onDefer}
              className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Để sau
            </button>
          </div>
        </div>

        <div className="mt-6">
          <MatchingCandidatesPreview candidates={result.candidates} />
        </div>

        {error ? (
          <div className="mt-5 rounded-[1.5rem] border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>
    </div>
  )
}

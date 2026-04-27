import type { MatchingCandidate } from '@/types/checkIn'

type MatchingCandidatesPreviewProps = {
  candidates: MatchingCandidate[]
}

const buildCandidateLabel = (candidate: MatchingCandidate, index: number) =>
  candidate.matchReason ??
  candidate.matchType ??
  candidate.candidateUserId ??
  candidate.candidateRoomId ??
  `Candidate ${index + 1}`

const formatScore = (candidate: MatchingCandidate) => {
  const value = candidate.similarityScore ?? candidate.score

  if (typeof value !== 'number') {
    return null
  }

  return `${Math.round(value * 100)}%`
}

export default function MatchingCandidatesPreview({
  candidates,
}: MatchingCandidatesPreviewProps) {
  if (candidates.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-5 text-sm text-slate-500">
        Chưa có dữ liệu candidate để hiển thị.
      </div>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {candidates.slice(0, 6).map((candidate, index) => (
        <article
          key={candidate.id ?? candidate.candidateUserId ?? candidate.candidateRoomId ?? index}
          className="rounded-[1.5rem] bg-white px-5 py-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Candidate {index + 1}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{buildCandidateLabel(candidate, index)}</p>
            </div>
            {formatScore(candidate) ? (
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                {formatScore(candidate)}
              </span>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  )
}

import type { AISummary } from './ai-support-data'

type AISummaryCardProps = {
  summary: AISummary
  originalSummary?: AISummary | null
  rewrittenSummary?: AISummary | null
  isBusy: boolean
  canRewrite: boolean
  showActions?: boolean
  onConfirm: () => void
  onRewrite: () => void
}

const SummaryBlock = ({
  label,
  summary,
}: {
  label: string
  summary: AISummary
}) => (
  <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,#eff6ff_0%,#f8fbff_100%)] px-5 py-5">
    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">{label}</p>

    <div className="mt-4 grid gap-4 md:grid-cols-3">
      <div className="rounded-[1.5rem] bg-white/80 px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Emotion</p>
        <p className="mt-3 text-sm font-medium text-slate-800 md:text-base">{summary.emotion}</p>
      </div>
      <div className="rounded-[1.5rem] bg-white/80 px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Issue</p>
        <p className="mt-3 text-sm font-medium text-slate-800 md:text-base">{summary.issue}</p>
      </div>
      <div className="rounded-[1.5rem] bg-white/80 px-4 py-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Deep Dive</p>
        <p className="mt-3 text-sm font-medium text-slate-800 md:text-base">{summary.deepdive}</p>
      </div>
    </div>

    <div className="mt-5 rounded-[1.5rem] bg-white/80 px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">Narrative</p>
      <p className="mt-3 text-sm leading-7 text-slate-700 md:text-base">{summary.narrative}</p>
    </div>
  </div>
)

export default function AISummaryCard({
  summary,
  originalSummary,
  rewrittenSummary,
  isBusy,
  canRewrite,
  showActions = true,
  onConfirm,
  onRewrite,
}: AISummaryCardProps) {
  const hasRewrittenVersion =
    !!originalSummary &&
    !!rewrittenSummary &&
    rewrittenSummary.narrative.trim() !== originalSummary.narrative.trim()

  return (
    <section className="rounded-[2rem] border border-sky-100 bg-white px-6 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Summary Review
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-800 md:text-2xl">
            Summary ready
          </h3>
        </div>
        <span className="rounded-full bg-sky-50 px-4 py-2 text-[11px] font-medium text-sky-700">
          Review
        </span>
      </div>

      <div className="mt-6 space-y-4">
        {hasRewrittenVersion ? (
          <>
            <SummaryBlock label="Original Summary" summary={originalSummary} />
            <SummaryBlock label="Rewritten Summary" summary={rewrittenSummary} />
          </>
        ) : (
          <SummaryBlock label="Current Summary" summary={summary} />
        )}
      </div>

      {showActions ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onConfirm}
            disabled={isBusy}
            className="inline-flex h-11 items-center justify-center rounded-full bg-sky-800 px-6 text-xs font-semibold text-white transition hover:bg-sky-900 disabled:cursor-not-allowed disabled:bg-slate-300 md:text-sm"
          >
            Confirm
          </button>
          <button
            onClick={onRewrite}
            disabled={isBusy || !canRewrite}
            className="inline-flex h-11 items-center justify-center rounded-full border border-sky-200 bg-white px-6 text-xs font-semibold text-sky-800 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 md:text-sm"
          >
            Rewrite
          </button>
        </div>
      ) : null}
    </section>
  )
}

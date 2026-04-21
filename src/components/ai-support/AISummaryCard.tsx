import type { AISummary } from './ai-support-data'

type AISummaryCardProps = {
  summary: AISummary
  isBusy: boolean
  canRewrite: boolean
  onConfirm: () => void
  onRewrite: () => void
}

export default function AISummaryCard({
  summary,
  isBusy,
  canRewrite,
  onConfirm,
  onRewrite,
}: AISummaryCardProps) {
  return (
    <section className="rounded-[2rem] border border-sky-100 bg-white px-6 py-6 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Summary Review</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-800">
            Ban dien giai tong hop da san sang
          </h3>
        </div>
        <span className="rounded-full bg-sky-50 px-4 py-2 text-xs font-medium text-sky-700">
          Xac nhan hoac yeu cau viet lai
        </span>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Emotion</p>
          <p className="mt-3 text-base font-medium text-slate-800">{summary.emotion}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Issue</p>
          <p className="mt-3 text-base font-medium text-slate-800">{summary.issue}</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Deep Dive</p>
          <p className="mt-3 text-base font-medium text-slate-800">{summary.deepdive}</p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.75rem] bg-[linear-gradient(180deg,#eff6ff_0%,#f8fbff_100%)] px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Narrative</p>
        <p className="mt-3 text-base leading-7 text-slate-700">{summary.narrative}</p>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onConfirm}
          disabled={isBusy}
          className="inline-flex h-12 items-center justify-center rounded-full bg-sky-800 px-6 text-sm font-semibold text-white transition hover:bg-sky-900 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isBusy ? 'Dang xu ly...' : 'Dong y voi ban dien giai'}
        </button>
        <button
          onClick={onRewrite}
          disabled={isBusy || !canRewrite}
          className="inline-flex h-12 items-center justify-center rounded-full border border-sky-200 bg-white px-6 text-sm font-semibold text-sky-800 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
        >
          Viet lai
        </button>
      </div>
    </section>
  )
}

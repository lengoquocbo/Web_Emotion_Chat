type CheckInResultCardProps = {
  summary: string
  topEmotion?: string | null
}

export default function CheckInResultCard({ summary, topEmotion }: CheckInResultCardProps) {
  return (
    <section className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_22px_48px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Check-in Result
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Kết quả check-in của bạn đã sẵn sàng!
          </h2>
        </div>
        {topEmotion ? (
          <span className="inline-flex rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
            Cảm xúc nổi bật: {topEmotion}
          </span>
        ) : null}
      </div>

      <div className="mt-6 rounded-[1.75rem] bg-[linear-gradient(180deg,#eff6ff_0%,#f8fbff_100%)] px-5 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">Confirmed Summary</p>
        <p className="mt-3 text-sm leading-7 text-slate-700 md:text-base">{summary}</p>
      </div>
    </section>
  )
}

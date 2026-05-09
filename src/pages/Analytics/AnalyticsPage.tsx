import { useEffect, useMemo, useState } from 'react'
import { Activity, CalendarRange, Flame, Loader2, Sparkles, Tags } from 'lucide-react'
import { ReflectionService } from '@/services/reflectionService'
import type {
  ReflectionAnalysisSummaryDto,
  ReflectionDto,
  ReflectionHistoryPagedResult,
  ReflectionMoodDistributionDto,
  ReflectionTagDistributionDto,
  ReflectionTimelinePointDto,
  ReflectionTransitionDto,
} from '@/types/reflection'

type PresetRange = '30d' | '90d' | '365d' | 'all'
type GroupBy = 'day' | 'week' | 'month'

const HISTORY_TAKE = 12

const emptySummary: ReflectionAnalysisSummaryDto = {
  totalReflections: 0,
  activeDays: 0,
  averageEmotionShiftScore: 0,
  averageMoodAfterIntensity: 0,
  averageMoodBeforeIntensity: 0,
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function getDateRange(preset: PresetRange) {
  if (preset === 'all') return { from: undefined, to: undefined }

  const to = new Date()
  const from = new Date()

  if (preset === '30d') from.setDate(to.getDate() - 30)
  if (preset === '90d') from.setDate(to.getDate() - 90)
  if (preset === '365d') from.setDate(to.getDate() - 365)

  return {
    from: formatDate(from),
    to: formatDate(to),
  }
}

function formatTag(tag?: string | null) {
  if (!tag) return 'Chưa có tag'
  return tag
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function formatPeriod(period: string, groupBy: GroupBy) {
  const date = new Date(period)
  if (Number.isNaN(date.getTime())) return period

  if (groupBy === 'month') {
    return date.toLocaleDateString('vi-VN', { month: 'short', year: 'numeric' })
  }

  return date.toLocaleDateString('vi-VN', {
    month: 'short',
    day: 'numeric',
  })
}

function formatMood(mood?: string | null) {
  return mood ?? 'Không rõ'
}

function StatCard({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint: string
  tone: 'sky' | 'emerald' | 'amber' | 'fuchsia'
}) {
  const toneMap = {
    sky: 'bg-sky-50 text-sky-700 border-sky-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    fuchsia: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100',
  }

  return (
    <article className="rounded-[1.75rem] bg-white/92 p-5 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${toneMap[tone]}`}
      >
        {label}
      </span>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p>
    </article>
  )
}

function TrendChart({
  data,
  groupBy,
}: {
  data: ReflectionTimelinePointDto[]
  groupBy: GroupBy
}) {
  if (!data.length) {
    return (
      <p className="text-sm text-slate-500">
        Chưa có dữ liệu xu hướng trong khoảng thời gian này.
      </p>
    )
  }

  const width = 720
  const height = 240
  const padding = 28
  const maxValue = Math.max(
    10,
    ...data.flatMap((point) => [
      point.averageMoodBeforeIntensity,
      point.averageMoodAfterIntensity,
      point.averageEmotionShiftScore,
    ]),
  )

  const getX = (index: number) => {
    if (data.length === 1) return width / 2
    return padding + (index * (width - padding * 2)) / (data.length - 1)
  }

  const getY = (value: number) => height - padding - (value / maxValue) * (height - padding * 2)

  const beforeLine = data
    .map((point, index) => `${getX(index)},${getY(point.averageMoodBeforeIntensity)}`)
    .join(' ')
  const afterLine = data
    .map((point, index) => `${getX(index)},${getY(point.averageMoodAfterIntensity)}`)
    .join(' ')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-slate-400" />
          Cường độ trước
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-sky-600" />
          Cường độ sau
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          Điểm chuyển biến
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px] rounded-[1.75rem] bg-slate-50/80 p-4">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-[240px] w-full">
            {[0, 0.25, 0.5, 0.75, 1].map((step) => {
              const y = padding + step * (height - padding * 2)
              return (
                <line
                  key={step}
                  x1={padding}
                  x2={width - padding}
                  y1={y}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="4 6"
                />
              )
            })}

            {data.map((point, index) => {
              const barHeight =
                (point.averageEmotionShiftScore / maxValue) * (height - padding * 2)
              const barY = height - padding - barHeight
              return (
                <g key={point.period}>
                  <rect
                    x={getX(index) - 9}
                    y={barY}
                    width="18"
                    height={barHeight}
                    rx="9"
                    fill="rgba(16,185,129,0.22)"
                  />
                </g>
              )
            })}

            <polyline
              fill="none"
              stroke="#94a3b8"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={beforeLine}
            />
            <polyline
              fill="none"
              stroke="#0369a1"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={afterLine}
            />

            {data.map((point, index) => (
              <g key={`${point.period}-dots`}>
                <circle
                  cx={getX(index)}
                  cy={getY(point.averageMoodBeforeIntensity)}
                  r="4"
                  fill="#94a3b8"
                />
                <circle
                  cx={getX(index)}
                  cy={getY(point.averageMoodAfterIntensity)}
                  r="4.5"
                  fill="#0369a1"
                />
              </g>
            ))}
          </svg>

          <div
            className="mt-3 grid gap-2 text-xs text-slate-500"
            style={{ gridTemplateColumns: `repeat(${data.length}, minmax(0, 1fr))` }}
          >
            {data.map((point) => (
              <div key={`${point.period}-label`} className="truncate text-center">
                {formatPeriod(point.period, groupBy)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DistributionBars({
  data,
}: {
  data: ReflectionMoodDistributionDto[]
}) {
  if (!data.length) {
    return (
      <p className="text-sm text-slate-500">
        Phân bố cảm xúc sẽ xuất hiện sau khi bạn có reflection.
      </p>
    )
  }

  const maxCount = Math.max(1, ...data.flatMap((item) => [item.beforeCount, item.afterCount]))

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.mood} className="rounded-[1.5rem] bg-slate-50/80 px-4 py-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="text-sm font-semibold text-slate-800">{formatMood(item.mood)}</h4>
            <span className="text-xs text-slate-400">
              TB {item.averageBeforeIntensity.toFixed(1)} → {item.averageAfterIntensity.toFixed(1)}
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span>Trước</span>
                <span>{item.beforeCount}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-slate-400"
                  style={{ width: `${(item.beforeCount / maxCount) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span>Sau</span>
                <span>{item.afterCount}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-sky-100">
                <div
                  className="h-full rounded-full bg-sky-700"
                  style={{ width: `${(item.afterCount / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TagChart({
  data,
}: {
  data: ReflectionTagDistributionDto[]
}) {
  if (!data.length) {
    return (
      <p className="text-sm text-slate-500">
        Không có mẫu tag nào phù hợp với bộ lọc hiện tại.
      </p>
    )
  }

  const maxCount = Math.max(1, ...data.map((item) => item.count))

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.tag} className="rounded-[1.5rem] bg-slate-50/80 px-4 py-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-800">{formatTag(item.tag)}</span>
            <span className="text-xs text-slate-400">{item.count} reflection</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Điểm chuyển biến trung bình: {item.averageShiftScore.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  )
}

function TransitionGrid({
  data,
}: {
  data: ReflectionTransitionDto[]
}) {
  if (!data.length) {
    return (
      <p className="text-sm text-slate-500">
        Chưa đủ reflection để hiển thị chuyển đổi cảm xúc.
      </p>
    )
  }

  const maxCount = Math.max(1, ...data.map((item) => item.count))

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {data.map((item) => (
        <article
          key={`${item.fromMood}-${item.toMood}`}
          className="rounded-[1.5rem] bg-slate-50/80 px-4 py-4"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-800">{formatMood(item.fromMood)}</span>
            <span className="text-xs uppercase tracking-[0.16em] text-slate-400">sang</span>
            <span className="text-sm font-semibold text-sky-700">{formatMood(item.toMood)}</span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-sky-100">
            <div
              className="h-full rounded-full bg-sky-700"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">{item.count} lần chuyển đổi được ghi nhận</p>
        </article>
      ))}
    </div>
  )
}

function HistoryList({
  items,
  totalCount,
  isLoadingMore,
  onLoadMore,
}: {
  items: ReflectionDto[]
  totalCount: number
  isLoadingMore: boolean
  onLoadMore: () => void
}) {
  if (!items.length) {
    return (
      <p className="text-sm text-slate-500">
        Lịch sử reflection của bạn sẽ xuất hiện tại đây sau khi bạn bắt đầu ghi nhận.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article key={item.Id} className="rounded-[1.75rem] bg-slate-50/80 px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {new Date(item.CreatedAt).toLocaleDateString('vi-VN', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                {item.Tags?.map((tag) => (
                  <span
                    key={`${item.Id}-${tag}`}
                    className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
                  >
                    {formatTag(tag)}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">
                {formatMood(item.MoodBefore)} {item.MoodBeforeIntensity ?? '-'} → {formatMood(item.MoodAfter)}{' '}
                {item.MoodAfterIntensity ?? '-'}
              </p>
              {item.Content && <p className="mt-2 text-sm leading-6 text-slate-500">{item.Content}</p>}
            </div>

            <div className="rounded-2xl bg-white px-3 py-2 text-right shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                Chuyển biến
              </p>
              <p className="mt-1 text-lg font-semibold text-sky-700">
                {item.EmotionShiftScore?.toFixed(2) ?? '—'}
              </p>
            </div>
          </div>
        </article>
      ))}

      {items.length < totalCount && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_14px_28px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingMore && <Loader2 className="size-4 animate-spin" />}
            Tải thêm reflection
          </button>
        </div>
      )}
    </div>
  )
}

export default function AnalyticsPage() {
  const [presetRange, setPresetRange] = useState<PresetRange>('90d')
  const [groupBy, setGroupBy] = useState<GroupBy>('week')
  const [summary, setSummary] = useState<ReflectionAnalysisSummaryDto>(emptySummary)
  const [timeline, setTimeline] = useState<ReflectionTimelinePointDto[]>([])
  const [moods, setMoods] = useState<ReflectionMoodDistributionDto[]>([])
  const [tags, setTags] = useState<ReflectionTagDistributionDto[]>([])
  const [transitions, setTransitions] = useState<ReflectionTransitionDto[]>([])
  const [history, setHistory] = useState<ReflectionHistoryPagedResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const range = useMemo(() => getDateRange(presetRange), [presetRange])

  useEffect(() => {
    let cancelled = false

    const loadAnalysis = async () => {
      setIsLoading(true)
      setError(null)

      const [
        summaryResult,
        timelineResult,
        moodResult,
        tagResult,
        transitionResult,
        historyResult,
      ] = await Promise.all([
        ReflectionService.getMyAnalysisSummary(),
        ReflectionService.getMyAnalysisTimeline({
          from: range.from,
          to: range.to,
          groupBy,
        }),
        ReflectionService.getMyMoodDistribution({
          from: range.from,
          to: range.to,
        }),
        ReflectionService.getMyTagDistribution({
          from: range.from,
          to: range.to,
          take: 8,
        }),
        ReflectionService.getMyTransitions({
          from: range.from,
          to: range.to,
        }),
        ReflectionService.getMyHistory({
          skip: 0,
          take: HISTORY_TAKE,
          from: range.from,
          to: range.to,
        }),
      ])

      if (cancelled) return

      if (!summaryResult.success) {
        setError(summaryResult.message ?? 'Không thể tải dữ liệu phân tích lúc này.')
        setIsLoading(false)
        return
      }

      setSummary(summaryResult.data ?? emptySummary)
      setTimeline(timelineResult.data ?? [])
      setMoods(moodResult.data ?? [])
      setTags(tagResult.data ?? [])
      setTransitions(transitionResult.data ?? [])
      setHistory(
        historyResult.data ?? {
          items: [],
          pageNumber: 1,
          pageSize: HISTORY_TAKE,
          totalCount: 0,
        },
      )
      setIsLoading(false)
    }

    loadAnalysis()

    return () => {
      cancelled = true
    }
  }, [groupBy, range.from, range.to])

  const handleLoadMore = async () => {
    if (!history || isLoadingMore || history.items.length >= history.totalCount) return

    setIsLoadingMore(true)
    const result = await ReflectionService.getMyHistory({
      skip: history.items.length,
      take: HISTORY_TAKE,
      from: range.from,
      to: range.to,
    })

    if (result.success && result.data) {
      const nextPage = result.data
      setHistory((current) =>
        current
          ? {
              ...nextPage,
              pageNumber: nextPage.pageNumber,
              pageSize: nextPage.pageSize,
              items: [...current.items, ...nextPage.items],
              totalCount: nextPage.totalCount,
            }
          : nextPage,
      )
    }

    setIsLoadingMore(false)
  }

  const summaryCards = [
    {
      label: 'Reflection',
      value: String(summary.totalReflections),
      hint: 'Tổng số reflection đã được ghi lại đến hiện tại.',
      tone: 'sky' as const,
    },
    {
      label: 'Ngày hoạt động',
      value: String(summary.activeDays),
      hint: 'Số ngày khác nhau mà bạn đã ghi nhận reflection.',
      tone: 'emerald' as const,
    },
    {
      label: 'TB chuyển biến',
      value: summary.averageEmotionShiftScore.toFixed(2),
      hint: 'Mức độ thay đổi cảm xúc trung bình sau mỗi room.',
      tone: 'amber' as const,
    },
    {
      label: 'Tag nổi bật',
      value: formatTag(summary.topTag),
      hint: 'Chủ đề xuất hiện nhiều nhất trong các reflection của bạn.',
      tone: 'fuchsia' as const,
    },
  ]

  return (
    <section className="space-y-5 pb-4">
      <header className="rounded-[2rem] bg-white/92 px-8 py-8 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
              <Sparkles className="size-3.5" />
              Phân tích reflection
            </span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
              Theo dõi sự thay đổi cảm xúc của bạn theo thời gian
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
              Quan sát cảm xúc bạn mang vào mỗi room, sự thay đổi sau khi trò chuyện, và những
              chủ đề lặp lại trong các reflection của bạn.
            </p>
          </div>

          <div className="flex flex-col gap-3 xl:items-end">
            <div className="flex flex-wrap gap-2">
              {([
                ['30d', '30 ngày'],
                ['90d', '90 ngày'],
                ['365d', '12 tháng'],
                ['all', 'Toàn bộ'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPresetRange(value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    presetRange === value
                      ? 'bg-sky-700 text-white shadow-[0_12px_28px_rgba(3,105,161,0.22)]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {(['day', 'week', 'month'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGroupBy(value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition ${
                    groupBy === value
                      ? 'bg-white text-sky-700 shadow-[0_12px_28px_rgba(15,23,42,0.08)]'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex min-h-[60vh] items-center justify-center rounded-[2rem] bg-white/80 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          <Loader2 className="size-8 animate-spin text-slate-300" />
        </div>
      ) : error ? (
        <div className="rounded-[2rem] bg-rose-50 px-6 py-5 text-sm font-medium text-rose-600 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
            <article className="rounded-[2rem] bg-white/92 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  <CalendarRange className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Xu hướng cảm xúc</h2>
                  <p className="text-sm text-slate-500">
                    So sánh cường độ trước và sau, kèm theo điểm chuyển biến.
                  </p>
                </div>
              </div>
              <TrendChart data={timeline} groupBy={groupBy} />
            </article>

            <article className="rounded-[2rem] bg-white/92 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-fuchsia-100 text-fuchsia-700">
                  <Flame className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Phân bố cảm xúc</h2>
                  <p className="text-sm text-slate-500">
                    Tần suất mỗi cảm xúc xuất hiện trước và sau mỗi room.
                  </p>
                </div>
              </div>
              <DistributionBars data={moods} />
            </article>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr]">
            <article className="rounded-[2rem] bg-white/92 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Tags className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Chủ đề lặp lại</h2>
                  <p className="text-sm text-slate-500">
                    Những tag chuẩn hóa xuất hiện nhiều nhất trong reflection của bạn.
                  </p>
                </div>
              </div>
              <TagChart data={tags} />
            </article>

            <article className="rounded-[2rem] bg-white/92 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Activity className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Bản đồ chuyển đổi</h2>
                  <p className="text-sm text-slate-500">
                    Những hướng chuyển đổi cảm xúc mà bạn đi qua nhiều nhất.
                  </p>
                </div>
              </div>
              <TransitionGrid data={transitions} />
            </article>
          </div>

          <article className="rounded-[2rem] bg-white/92 p-6 shadow-[0_18px_48px_rgba(15,23,42,0.06)]">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-900">Lịch sử reflection</h2>
              <p className="mt-1 text-sm text-slate-500">
                Xem lại các reflection gần đây, bao gồm cảm xúc, tag và ghi chú của bạn.
              </p>
            </div>
            <HistoryList
              items={history?.items ?? []}
              totalCount={history?.totalCount ?? 0}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
            />
          </article>
        </>
      )}
    </section>
  )
}

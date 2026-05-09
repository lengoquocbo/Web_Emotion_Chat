import { useEffect, useMemo, useState } from 'react'
import { Loader2, Sparkles, X } from 'lucide-react'
import { ReflectionService } from '@/services/reflectionService'
import type { Room } from '@/types/Chat'
import type { CreateReflectionRequest, EmotionType, ReflectionDto } from '@/types/reflection'
import { EMOTION_OPTIONS } from '@/types/reflection'

interface GroupReflectionPanelProps {
  room: Room
  initialReflection: ReflectionDto | null
  onClose: () => void
  onSaved: (reflection: ReflectionDto) => void
}

const QUICK_NOTES = [
  'Tôi thấy nhẹ hơn sau khi chia sẻ',
  'Tôi đã rõ hơn về điều mình đang cảm thấy',
  'Tôi vẫn cần thêm thời gian để ổn định lại',
  'Tôi thấy được lắng nghe và kết nối hơn',
]

function SliderField({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <label className="block rounded-3xl bg-slate-50 px-4 py-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-sky-700 shadow-sm">
          {value}/10
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-sky-100 accent-sky-700"
      />
      <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
        <span>1</span>
        <span>10</span>
      </div>
    </label>
  )
}

function EmotionPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: EmotionType
  onChange: (value: EmotionType) => void
}) {
  return (
    <div className="rounded-3xl bg-slate-50 px-4 py-4">
      <p className="mb-3 text-sm font-medium text-slate-700">{label}</p>
      <div className="flex flex-wrap gap-2">
        {EMOTION_OPTIONS.map((emotion) => {
          const isActive = value === emotion
          return (
            <button
              key={emotion}
              type="button"
              onClick={() => onChange(emotion)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                isActive
                  ? 'bg-sky-700 text-white shadow-[0_12px_24px_rgba(3,105,161,0.22)]'
                  : 'bg-white text-slate-600 shadow-sm hover:bg-sky-50 hover:text-sky-700'
              }`}
            >
              {emotion}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function GroupReflectionPanel({
  room,
  initialReflection,
  onClose,
  onSaved,
}: GroupReflectionPanelProps) {
  const [tags, setTags] = useState<string[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [moodBefore, setMoodBefore] = useState<EmotionType>(
    initialReflection?.MoodBefore ?? 'Other',
  )
  const [moodAfter, setMoodAfter] = useState<EmotionType>(
    initialReflection?.MoodAfter ?? 'Other',
  )
  const [moodBeforeIntensity, setMoodBeforeIntensity] = useState(
    initialReflection?.MoodBeforeIntensity ?? 5,
  )
  const [moodAfterIntensity, setMoodAfterIntensity] = useState(
    initialReflection?.MoodAfterIntensity ?? 5,
  )
  const [selectedTags, setSelectedTags] = useState<string[]>(initialReflection?.Tags ?? [])
  const [content, setContent] = useState(initialReflection?.Content ?? '')

  useEffect(() => {
    let cancelled = false

    const loadTags = async () => {
      setIsLoadingTags(true)
      const result = await ReflectionService.GetTags()

      if (cancelled) return

      if (!result.success || !result.data) {
        setTags([])
        setError(result.message ?? 'Không thể tải danh sách tag')
        setIsLoadingTags(false)
        return
      }

      setTags(result.data)
      setIsLoadingTags(false)
    }

    loadTags()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setMoodBefore(initialReflection?.MoodBefore ?? 'Other')
    setMoodAfter(initialReflection?.MoodAfter ?? 'Other')
    setMoodBeforeIntensity(initialReflection?.MoodBeforeIntensity ?? 5)
    setMoodAfterIntensity(initialReflection?.MoodAfterIntensity ?? 5)
    setSelectedTags(initialReflection?.Tags ?? [])
    setContent(initialReflection?.Content ?? '')
  }, [initialReflection, room.id])

  const selectedTagSet = useMemo(() => new Set(selectedTags), [selectedTags])

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    )
  }

  const handleSave = async () => {
    setError(null)
    setIsSaving(true)

    const request: CreateReflectionRequest = {
      RoomId: room.id,
      MoodBefore: moodBefore,
      MoodBeforeIntensity: moodBeforeIntensity,
      MoodAfter: moodAfter,
      MoodAfterIntensity: moodAfterIntensity,
      Content: content.trim() || undefined,
      Tags: selectedTags,
    }

    const result = initialReflection
      ? await ReflectionService.UpdateMineByRoomId(room.id, request)
      : await ReflectionService.Create(request)

    if (!result.success || !result.data) {
      setError(result.message ?? 'Không thể lưu reflection')
      setIsSaving(false)
      return
    }

    onSaved(result.data)
    setIsSaving(false)
  }

  return (
    <section className="flex max-h-[calc(100vh-13rem)] flex-col overflow-hidden rounded-[2rem] bg-white/95 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 pb-4 pt-5">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            <Sparkles className="size-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-slate-900">
              {initialReflection ? 'Cập nhật reflection' : 'Tạo reflection mới'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Chọn nhanh cảm xúc trước và sau để ghi lại sự thay đổi của bạn trong room.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="app-scrollbar min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="grid gap-4 xl:grid-cols-2">
          <EmotionPicker
            label="Bạn đến với cảm xúc nào?"
            value={moodBefore}
            onChange={setMoodBefore}
          />
          <EmotionPicker
            label="Bây giờ bạn thấy mình ra sao?"
            value={moodAfter}
            onChange={setMoodAfter}
          />
          <SliderField
            label="Cường độ cảm xúc lúc đầu"
            value={moodBeforeIntensity}
            onChange={setMoodBeforeIntensity}
          />
          <SliderField
            label="Cường độ cảm xúc hiện tại"
            value={moodAfterIntensity}
            onChange={setMoodAfterIntensity}
          />
        </div>

        <div className="mt-4 rounded-3xl bg-slate-50 px-4 py-4">
          <p className="mb-3 text-sm font-medium text-slate-700">Điều gì đã thay đổi nhiều nhất?</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_NOTES.map((note) => {
              const isActive = content === note
              return (
                <button
                  key={note}
                  type="button"
                  onClick={() => setContent(note)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-fuchsia-100 text-fuchsia-700'
                      : 'bg-white text-slate-600 shadow-sm hover:bg-fuchsia-50 hover:text-fuchsia-700'
                  }`}
                >
                  {note}
                </button>
              )
            })}
          </div>
          <input
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Hoặc thêm một dòng ngắn gọn nếu bạn muốn..."
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-300"
          />
        </div>

        <div className="mt-4 rounded-3xl bg-slate-50 px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-700">Chọn tag phù hợp</p>
            {isLoadingTags && <Loader2 className="size-4 animate-spin text-slate-400" />}
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const isActive = selectedTagSet.has(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-white text-slate-600 shadow-sm hover:bg-emerald-50 hover:text-emerald-700'
                  }`}
                >
                  {tag.split('_').join(' ')}
                </button>
              )
            })}
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 bg-white px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-200"
        >
          Đóng
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-full bg-sky-800 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(3,105,161,0.22)] transition hover:bg-sky-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving && <Loader2 className="size-4 animate-spin" />}
          {initialReflection ? 'Lưu cập nhật' : 'Tạo reflection'}
        </button>
      </div>
    </section>
  )
}

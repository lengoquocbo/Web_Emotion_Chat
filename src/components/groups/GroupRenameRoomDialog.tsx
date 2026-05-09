import { useEffect, useState } from 'react'
import { Loader2, PencilLine } from 'lucide-react'

interface GroupRenameRoomDialogProps {
  currentName: string
  isOpen: boolean
  isSaving: boolean
  error: string | null
  onClose: () => void
  onSubmit: (nextName: string) => Promise<void> | void
}

export default function GroupRenameRoomDialog({
  currentName,
  isOpen,
  isSaving,
  error,
  onClose,
  onSubmit,
}: GroupRenameRoomDialogProps) {
  const [name, setName] = useState(currentName)

  useEffect(() => {
    if (!isOpen) return
    setName(currentName)
  }, [currentName, isOpen])

  if (!isOpen) return null

  const trimmedName = name.trim()
  const isDisabled = isSaving || trimmedName.length === 0 || trimmedName === currentName.trim()

  const handleSubmit = async () => {
    if (isDisabled) return
    await onSubmit(trimmedName)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/25 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.18)]">
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
            <PencilLine className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-slate-900">Cập nhật tên nhóm</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Đổi tên để mọi người trong phòng dễ nhận diện nhóm hơn.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="room-name" className="mb-2 block text-sm font-medium text-slate-700">
            Tên nhóm
          </label>
          <input
            id="room-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                void handleSubmit()
              }
            }}
            maxLength={80}
            autoFocus
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
            placeholder="Nhập tên nhóm mới"
          />
          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>Tối đa 80 ký tự</span>
            <span>{trimmedName.length}/80</span>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-500">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Đóng
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isDisabled}
            className="inline-flex min-w-[136px] items-center justify-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            {isSaving ? 'Đang lưu' : 'Lưu tên nhóm'}
          </button>
        </div>
      </div>
    </div>
  )
}

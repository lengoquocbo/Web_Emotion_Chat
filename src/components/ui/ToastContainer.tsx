import { useSyncExternalStore, useCallback } from 'react'
import { X, MessageSquare } from 'lucide-react'
import { toastStore, type Toast } from '@/stores/toastStore'

interface ToastContainerProps {
  onRoomSelect?: (roomId: string) => void
}

function ToastItem({ toast, onSelect, onClose }: {
  toast: Toast
  onSelect: () => void
  onClose: () => void
}) {
  return (
    <div
      onClick={onSelect}
      className="flex items-start gap-3 w-80 rounded-2xl bg-white px-4 py-3.5 shadow-[0_20px_60px_rgba(15,23,42,0.15)] border border-slate-100 cursor-pointer"
      style={{ animation: 'slideIn 0.25s ease-out' }}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-sky-700">
        <MessageSquare className="size-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium text-slate-400 truncate">{toast.roomName}</p>
          <button
            onClick={e => { e.stopPropagation(); onClose() }}
            className="shrink-0 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
        <p className="text-sm font-semibold text-slate-700 truncate">{toast.senderName}</p>
        <p className="text-sm text-slate-500 truncate">{toast.content}</p>
      </div>
    </div>
  )
}

export default function ToastContainer({ onRoomSelect }: ToastContainerProps) {
  const toasts = useSyncExternalStore(
    useCallback((notify) => toastStore.subscribe(notify), []),
    () => toastStore.getAll(),
  )

  if (toasts.length === 0) return null

  return (
    <>
      {/* Inline keyframe — không cần thêm CSS file */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(1rem); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onSelect={() => {
              onRoomSelect?.(toast.roomId)
              toastStore.remove(toast.id)
            }}
            onClose={() => toastStore.remove(toast.id)}
          />
        ))}
      </div>
    </>
  )
}
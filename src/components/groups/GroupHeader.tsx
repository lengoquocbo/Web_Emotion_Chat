import { ChevronDown, MessageSquareMore, PencilLine, Sparkles, Users } from 'lucide-react'
import { useState } from 'react'
import type { Room } from '@/types/Chat'

interface GroupHeaderProps {
  room: Room
  rooms: Room[]
  onSelectRoom: (room: Room) => void
  onOpenReflection: () => void
  hasReflection: boolean
  onOpenMembers: () => void
  onOpenRename: () => void
}

export default function GroupHeader({
  room,
  rooms,
  onSelectRoom,
  onOpenReflection,
  hasReflection,
  onOpenMembers,
  onOpenRename,
}: GroupHeaderProps) {
  const [showPicker, setShowPicker] = useState(false)

  return (
    <header className="rounded-[2rem] bg-white/90 px-6 py-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-fuchsia-200/75 text-fuchsia-900">
            <MessageSquareMore className="size-6" />
          </div>

          <div className="relative">
            <div className="flex items-start gap-3">
              <button
                onClick={() => setShowPicker((prev) => !prev)}
                className="flex items-center gap-2 text-left"
              >
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-800 transition-colors hover:text-sky-700">
                    {room.name ?? `Room #${room.id.slice(0, 6)}`}
                  </h1>
                  <p className="mt-0.5 text-sm font-medium uppercase tracking-[0.15em] text-slate-400">
                    {room.currentMemberCount} thành viên · {room.roomType}
                  </p>
                </div>
                {rooms.length > 1 && (
                  <ChevronDown
                    className={`size-4 text-slate-400 transition-transform ${showPicker ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              <button
                type="button"
                onClick={onOpenRename}
                className="mt-1 inline-flex size-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-sky-50 hover:text-sky-700"
                aria-label="Đổi tên nhóm"
              >
                <PencilLine className="size-4" />
              </button>
            </div>

            {showPicker && rooms.length > 1 && (
              <div className="absolute left-0 top-full z-10 mt-2 w-72 rounded-2xl bg-white p-2 shadow-[0_20px_60px_rgba(15,23,42,0.15)]">
                {rooms.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectRoom(item)
                      setShowPicker(false)
                    }}
                    className={`w-full rounded-xl px-4 py-3 text-left text-sm transition hover:bg-slate-50 ${
                      item.id === room.id ? 'font-semibold text-sky-700' : 'text-slate-700'
                    }`}
                  >
                    <span>{item.name ?? `Room #${item.id.slice(0, 6)}`}</span>
                    <span className="ml-2 text-xs text-slate-400">
                      {item.currentMemberCount}/{item.maxMembers} thành viên
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenReflection}
            className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-700 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:bg-sky-100"
          >
            <Sparkles className="size-4" />
            {hasReflection ? 'Cập nhật reflection' : 'Tạo reflection'}
          </button>
          <button
            onClick={onOpenMembers}
            className="flex size-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5"
          >
            <Users className="size-4" />
          </button>
          <div className="rounded-full border border-fuchsia-100 bg-white px-3 py-1.5 shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
            <span className="text-sm font-medium text-fuchsia-700">{room.roomType}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

import { MessageSquare, Plus } from 'lucide-react'
import type { Room } from '@/types/Chat'

interface RoomSidebarProps {
  rooms: Room[]
  activeRoomId: string
  onSelectRoom: (room: Room) => void
}

function getRoomInitials(room: Room): string {
  const name = room.name ?? 'R'
  return name.slice(0, 2).toUpperCase()
}

export default function RoomSidebar({ rooms, activeRoomId, onSelectRoom }: RoomSidebarProps) {
  return (
    <aside className="flex h-full shrink-0 flex-col gap-2 rounded-[2rem] bg-white p-4 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="flex items-center justify-between px-2 pb-2">
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
          Nhóm của tôi
        </h2>
        <button className="flex size-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700">
          <Plus className="size-3.5" />
        </button>
      </div>

      <div className="app-scrollbar flex flex-col gap-1 overflow-y-auto">
        {rooms.map((room) => {
          const isActive = room.id === activeRoomId
          const name = room.name ?? `Room #${room.id.slice(0, 6)}`
          const initials = getRoomInitials(room)
          const memberText = `${room.currentMemberCount}/${room.maxMembers} thanh vien`

          return (
            <button
              key={room.id}
              onClick={() => onSelectRoom(room)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-left transition-all ${
                isActive
                  ? 'bg-sky-50 shadow-[inset_0_0_0_1px_rgba(14,165,233,0.2)]'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
                  isActive
                    ? 'bg-sky-800 text-white'
                    : 'bg-gradient-to-br from-fuchsia-100 via-violet-50 to-sky-100 text-slate-600'
                }`}
              >
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className={`truncate text-sm font-semibold ${isActive ? 'text-sky-800' : 'text-slate-700'}`}>
                  {name}
                </p>
                <p className="truncate text-xs text-slate-400">{memberText}</p>
              </div>

              {isActive && <div className="size-1.5 shrink-0 rounded-full bg-sky-500" />}
            </button>
          )
        })}

        {rooms.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
              <MessageSquare className="size-5 text-slate-400" />
            </div>
            <p className="text-sm text-slate-400">Chua co nhom nao</p>
          </div>
        )}
      </div>

      {rooms.length > 0 && (
        <div className="mt-auto rounded-2xl bg-slate-50 px-3 py-2.5">
          <p className="text-xs text-slate-400">Room type</p>
          <p className="truncate text-sm font-medium text-slate-600">{rooms[0].roomType}</p>
        </div>
      )}
    </aside>
  )
}

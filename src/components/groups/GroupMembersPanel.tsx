import { useEffect, useState } from 'react'
import { Loader2, Sparkles, X } from 'lucide-react'
import { getRoomMembers } from '@/services/roomService'
import { usePresence } from '@/hooks/chat/usePresence'
import type { Room, RoomMember } from '@/types/Chat'

interface GroupMembersPanelProps {
  room: Room
  isOpen: boolean
  onClose: () => void
  onSelectMember: (member: RoomMember) => void
}

export default function GroupMembersPanel({
  room,
  isOpen,
  onClose,
  onSelectMember,
}: GroupMembersPanelProps) {
  const [members, setMembers] = useState<RoomMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isOnline } = usePresence()

  useEffect(() => {
    if (!isOpen || !room.id) return
    setIsLoading(true)
    getRoomMembers(room.id)
      .then((data) => setMembers(data))
      .catch((err) => console.error('[GroupMembersPanel] fetch members failed:', err))
      .finally(() => setIsLoading(false))
  }, [isOpen, room.id])

  if (!isOpen) return null

  return (
    <div className="absolute inset-0 z-40 flex items-start justify-end bg-slate-900/10 p-4 backdrop-blur-[2px]">
      <div className="flex h-full max-h-[calc(100vh-2rem)] w-full max-w-sm flex-col overflow-hidden rounded-[2rem] bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-400">
              {room.currentMemberCount} / {room.maxMembers} thành viên
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              Thành viên trong nhóm
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="app-scrollbar min-h-0 flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="size-5 animate-spin text-slate-300" />
            </div>
          ) : (
            <div className="space-y-3">
              {members.map((member) => {
                const name = member.displayName || member.userName
                const initials = name.slice(0, 2).toUpperCase()
                const online = isOnline(member.userId)

                return (
                  <button
                    key={member.userId}
                    type="button"
                    onClick={() => onSelectMember(member)}
                    className="flex w-full items-center gap-3 rounded-[1.5rem] px-2 py-2 text-left transition hover:bg-slate-50"
                  >
                    <div className="relative shrink-0">
                      <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-fuchsia-100 via-violet-50 to-sky-100 text-sm font-semibold text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={name}
                            className="size-full object-cover"
                          />
                        ) : (
                          initials
                        )}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white transition-colors ${
                          online ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-700">{name}</p>
                      <p className={`text-xs ${online ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {online ? 'Đang hoạt động' : 'Ngoại tuyến'}
                      </p>
                    </div>
                  </button>
                )
              })}

              {members.length === 0 && (
                <p className="text-sm text-slate-400">Chưa có thành viên nào.</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-2 rounded-[2rem] bg-slate-50 p-5 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]">
          <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
            <Sparkles className="size-4 text-fuchsia-500" />
            Gợi ý hôm nay
          </div>
          <p className="mt-3 text-sm italic leading-7 text-slate-500">
            "Mình được phép chia sẻ nhu cầu và cảm xúc của mình mà không cần cảm thấy có lỗi."
          </p>
        </div>
      </div>
    </div>
  )
}

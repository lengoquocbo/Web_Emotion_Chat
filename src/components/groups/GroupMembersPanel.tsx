import { useEffect, useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { getRoomMembers } from '@/services/roomService'
import { usePresence } from '@/hooks/chat/usePresence'
import type { Room, RoomMember } from '@/types/Chat'

interface GroupMembersPanelProps {
  room: Room
}

export default function GroupMembersPanel({ room }: GroupMembersPanelProps) {
  const [members, setMembers] = useState<RoomMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { isOnline } = usePresence()

  useEffect(() => {
    if (!room.id) return
    setIsLoading(true)
    getRoomMembers(room.id)
      .then(data => setMembers(data))
      .catch(err => console.error('[GroupMembersPanel] fetch members failed:', err))
      .finally(() => setIsLoading(false))
  }, [room.id])

  return (
    <aside className="flex flex-col h-full gap-5 rounded-[2rem] bg-white p-5 xl:min-h-[calc(100vh-13rem)]">

      {/* Header */}
      <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-400">
        {room.currentMemberCount} / {room.maxMembers} thành viên
      </p>

      {/* Member list */}
      {isLoading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="size-5 animate-spin text-slate-300" />
        </div>
      ) : (
        <div className="space-y-4">
          {members.map(member => {
            const name     = member.displayName || member.userName
            const initials = name.slice(0, 2).toUpperCase()
            const online   = isOnline(member.userId)

            return (
              <div key={member.userId} className="flex items-center gap-3">
                {/* Avatar + online badge */}
                <div className="relative shrink-0">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-100 via-violet-50 to-sky-100 text-sm font-semibold text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                    {initials}
                  </div>
                  <span className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white transition-colors ${
                    online ? 'bg-emerald-500' : 'bg-slate-300'
                  }`} />
                </div>

                {/* Name + status */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-700">{name}</p>
                  <p className={`text-xs ${online ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            )
          })}

          {members.length === 0 && (
            <p className="text-sm text-slate-400">Chưa có thành viên nào</p>
          )}
        </div>
      )}

      {/* Daily Intention */}
      <div className="mt-auto rounded-[2rem] bg-slate-50 p-5 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]">
        <div className="flex items-center gap-2 text-base font-semibold text-slate-800">
          <Sparkles className="size-4 text-fuchsia-500" />
          Daily Intention
        </div>
        <p className="mt-3 text-sm italic leading-7 text-slate-500">
          "I am allowed to take up space and express my needs without guilt."
        </p>
      </div>
    </aside>
  )
}
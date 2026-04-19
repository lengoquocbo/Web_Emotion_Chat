import { Sparkles } from 'lucide-react'

import { groupMembers } from './groups-data'

export default function GroupMembersPanel() {
  return (
    <aside className="flex flex-col h-full overflow-y-auto gap-5 rounded-[2rem] bg-white p-5  xl:min-h-[calc(100vh-13rem)]">
      <div className="space-y-5">
        <p>ALL Member </p>
        {groupMembers.map((member) => (
          <div key={member.name} className="flex items-center gap-4">
            <div className="relative">
              <div
                className={`flex size-14 items-center justify-center rounded-full bg-gradient-to-br ${member.tone} text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.08)]`}
              >
                {member.initials}
              </div>
              <span
                className={`absolute bottom-1 right-1 size-3 rounded-full border-2 border-white ${
                  member.online ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              />
            </div>
            <div className="min-w-0">
              <p
                className={`truncate text-xl ${member.strong ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}
              >
                {member.name}
              </p>
              <p className={`text-sm ${member.online ? 'text-emerald-700' : 'text-slate-400'}`}>
                {member.status}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto rounded-[2rem] bg-slate-50 p-6 shadow-[inset_0_0_0_1px_rgba(226,232,240,0.8)]">
        <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Sparkles className="size-5 text-fuchsia-500" />
          Daily Intention
        </div>
        <p className="mt-4 text-lg italic leading-9 text-slate-500">
          "I am allowed to take up space and express my needs without guilt."
        </p>
      </div>
    </aside>
  )
}

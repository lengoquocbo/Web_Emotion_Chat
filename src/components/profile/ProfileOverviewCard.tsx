import { Mail, Phone } from 'lucide-react'

import { useAuth } from '@/hooks/auth/useAuth'
import { Button } from '@/components/ui/button'

export default function ProfileOverviewCard() {
  const { user } = useAuth()

  const displayName = user?.displayName || user?.username || 'User'
  const email = user?.email || 'No email'
  const phone = user?.phone || 'No phone'
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

  return (
    <section className="overflow-hidden rounded-[2rem] bg-white shadow-[0_18px_48px_rgba(15,23,42,0.08)] ring-1 ring-slate-100">
      <div className="h-28 bg-[linear-gradient(135deg,rgba(236,253,245,0.95),rgba(239,246,255,0.95))]" />

      <div className="px-6 pb-5 sm:px-8">
        <div className="-mt-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="flex size-24 items-center justify-center rounded-full border-[6px] border-white bg-gradient-to-br from-amber-300 via-orange-300 to-yellow-200 text-3xl font-semibold text-slate-800 shadow-[0_18px_40px_rgba(251,191,36,0.3)]">
              {initials}
            </div>

            <div className="pb-1">
              <h2 className="text-[1.8rem] font-semibold tracking-tight text-fuchsia-700">
                {displayName}
              </h2>
              <div className="mt-2 space-y-1.5 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Mail className="size-4 text-fuchsia-500" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-fuchsia-500" />
                  <span>{phone}</span>
                </div>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="h-11 rounded-full border-fuchsia-300 px-6 text-fuchsia-700 shadow-none hover:bg-fuchsia-50 hover:text-fuchsia-800"
          >
            Edit Profile
          </Button>
        </div>
      </div>
    </section>
  )
}

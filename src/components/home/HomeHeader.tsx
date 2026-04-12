import { Bell, Search, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/auth/useAuth'
import type { AuthUser } from "@/types/auth"
import { getMeService } from '@/services/authService'   
import { useEffect, useState } from "react"

export default function HomeHeader() {
  const { user } = useAuth()
  const [data, setData] = useState<AuthUser | null>(null)

  useEffect(() => {
    const fetchMe = async () => {
      try {
      const res = await getMeService()
      setData(res) 
    } catch (err) {
      console.error(err)
    }
    }

    fetchMe()
  }, [])

  const displayName1 = data?.displayName || data?.username
  const displayName = user?.displayName || user?.username
  const finalName = displayName1 || displayName || "User"



  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative max-w-2xl flex-1">
        <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search experiences..."
          className="h-14 w-full rounded-full border border-white/70 bg-white/90 pl-12 pr-4 text-sm text-slate-700 shadow-[0_10px_30px_rgba(15,23,42,0.05)] outline-none ring-0 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center justify-between gap-3 lg:justify-end">
        <div className="flex items-center gap-2">
          <button className="flex size-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:text-slate-700">
            <Bell className="size-4" />
          </button>
          <button className="flex size-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:text-slate-700">
            <Settings className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-full bg-white/90 py-1.5 pl-1.5 pr-4 shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-rose-100 to-blue-200 text-sm font-semibold text-slate-700">
            {finalName[0].toUpperCase()} 
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700">{finalName}</p>
            <p className="text-xs text-slate-400">Keep showing up</p>
          </div>
        </div>
      </div>
    </header>
  )
}

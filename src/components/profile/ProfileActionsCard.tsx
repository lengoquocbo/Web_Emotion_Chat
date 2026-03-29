import { LogOut, ShieldAlert } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function ProfileActionsCard() {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <ShieldAlert className="size-5" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-800">Account Actions</h3>
          <p className="mt-1 text-sm text-slate-500">Manage session access and keep your account safe.</p>
        </div>
      </div>

      <div className="mt-6 rounded-[1.75rem] bg-slate-50 p-5">
        <p className="text-base leading-7 text-slate-500">
          When you finish your session on this device, you can sign out to protect your private reflections and conversations.
        </p>

        <Button
          variant="destructive"
          className="mt-5 h-12 w-full rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200"
        >
          <LogOut className="size-4" />
          Đăng xuất
        </Button>
      </div>
    </section>
  )
}

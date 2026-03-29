import { Mail, MapPin, Phone, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

export default function ProfileOverviewCard() {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)] sm:p-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-5">
          <div className="flex size-24 items-center justify-center rounded-[2rem] bg-gradient-to-br from-sky-100 via-blue-50 to-emerald-100 text-2xl font-semibold text-slate-700 shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
            AN
          </div>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              <Sparkles className="size-4" />
              Feeling grounded this week
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-800">An Nhi</h2>
            <p className="mt-2 max-w-xl text-base leading-7 text-slate-500">
              Building softer routines, taking gentle pauses, and learning to treat rest like it matters.
            </p>
          </div>
        </div>

        <Button className="h-11 rounded-full bg-sky-800 px-6 text-white hover:bg-sky-900">
          Edit Profile
        </Button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-3 text-slate-500">
            <Mail className="size-4" />
            <span className="text-sm">Email</span>
          </div>
          <p className="mt-2 font-medium text-slate-800">annhi@example.com</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-3 text-slate-500">
            <Phone className="size-4" />
            <span className="text-sm">Phone</span>
          </div>
          <p className="mt-2 font-medium text-slate-800">+84 912 345 678</p>
        </div>
        <div className="rounded-[1.5rem] bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-3 text-slate-500">
            <MapPin className="size-4" />
            <span className="text-sm">Location</span>
          </div>
          <p className="mt-2 font-medium text-slate-800">Ho Chi Minh City</p>
        </div>
      </div>
    </section>
  )
}

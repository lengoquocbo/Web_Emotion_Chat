import { MoonStar, ShieldCheck } from 'lucide-react'

import { settingsItems, wellnessItems } from './profile-data'

export default function ProfileWellnessCard() {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_18px_48px_rgba(15,23,42,0.08)]">
      <div className="flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-fuchsia-100 text-fuchsia-700">
          <MoonStar className="size-5" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-800">Wellness Preferences</h3>
          <p className="mt-1 text-sm text-slate-500">The routines and settings shaping your sanctuary.</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {wellnessItems.map((item) => (
          <div key={item} className="rounded-[1.5rem] bg-slate-50 px-5 py-4 text-slate-600">
            {item}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-[1.75rem] bg-sky-50 p-5">
        <div className="flex items-center gap-3 text-sky-800">
          <ShieldCheck className="size-5" />
          <span className="font-semibold">Account Settings</span>
        </div>
        <div className="mt-4 space-y-3">
          {settingsItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-4 rounded-[1.25rem] bg-white px-4 py-3">
              <span className="text-sm text-slate-500">{item.label}</span>
              <span className="text-sm font-medium text-slate-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

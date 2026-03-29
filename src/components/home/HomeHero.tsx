import { Button } from '@/components/ui/button'

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#9fd1ff_0%,#a9e8d4_55%,#b8f7b7_100%)] px-6 py-8 shadow-[0_24px_60px_rgba(91,139,171,0.18)] sm:px-8 sm:py-10 lg:px-10">
      <div className="absolute inset-y-12 right-10 hidden w-40 rounded-full bg-slate-500/20 blur-3xl lg:block" />
      <div className="relative z-10 max-w-2xl space-y-5">
        <span className="inline-flex rounded-full bg-white/45 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-900">
          Daily Affirmation
        </span>
        <div className="space-y-4">
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.05] tracking-tight text-sky-950 sm:text-5xl">
            "Every small step I take toward my well-being is a victory."
          </h1>
          <p className="max-w-lg text-base leading-7 text-sky-900/75">
            Take a moment to breathe. You are doing enough, just by being here.
          </p>
        </div>
        <Button className="h-12 rounded-full bg-sky-900 px-7 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(12,74,110,0.28)] hover:bg-sky-950">
          Reflect on this
        </Button>
      </div>
    </section>
  )
}

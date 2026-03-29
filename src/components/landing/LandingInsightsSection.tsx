import { ArrowRight } from 'lucide-react'

import { FloatingCard, StatPill } from './LandingShared'

export default function LandingInsightsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
      <FloatingCard className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:p-8" delay={0.2}>
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Emotional Insights
          </div>
          <h3 className="text-3xl font-semibold tracking-tight">Gentle analytics that feel human.</h3>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
            Track growth with supportive visuals, subtle motion, and readable feedback designed for
            reflection instead of pressure.
          </p>
          <button className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            Learn how it works
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <StatPill label="Calm Score" value="84%" tone="pink" />
        <StatPill label="Average Session" value="12 Days" tone="blue" />
      </FloatingCard>
    </section>
  )
}

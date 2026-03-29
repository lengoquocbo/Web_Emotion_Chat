import { FloatingCard } from './LandingShared'
import { testimonials } from './landing-data'

export default function LandingTestimonialsSection() {
  return (
    <section id="community" className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
      <div className="text-center">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          What our community says
        </div>
        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
          Designed to feel warm, modern, and trustworthy.
        </h2>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {testimonials.map(([quote, name], index) => (
          <FloatingCard key={name} className="p-6" delay={0.15 * index}>
            <p className="text-sm leading-7 text-slate-600">"{quote}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-200 to-violet-200" />
              <div>
                <div className="font-semibold">{name}</div>
                <div className="text-xs text-slate-500">Early user</div>
              </div>
            </div>
          </FloatingCard>
        ))}
      </div>
    </section>
  )
}

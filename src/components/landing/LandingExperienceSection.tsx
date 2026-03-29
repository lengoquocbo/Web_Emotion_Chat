import { FloatingCard, PhoneMock } from './LandingShared'
import { experienceBullets } from './landing-data'

export default function LandingExperienceSection() {
  return (
    <section
      id="experience"
      className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8"
    >
      <div>
        <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Experience the Peace
        </div>
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          A calmer interface with depth and motion.
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
          This section recreates the premium softness of the reference design while adding layered 3D
          motion, floating cards, glass surfaces, and ambient gradients.
        </p>
        <ul className="mt-8 space-y-4 text-slate-700">
          {experienceBullets.map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative">
        <div className="absolute inset-0 rounded-[38px] bg-gradient-to-br from-slate-100 to-violet-100 blur-xl" />
        <FloatingCard className="relative p-5 md:p-7" delay={0.4}>
          <PhoneMock />
        </FloatingCard>
      </div>
    </section>
  )
}

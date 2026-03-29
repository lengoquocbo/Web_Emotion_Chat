import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { fadeUp } from './landing-animations'
import { FloatingCard, MiniBars, PhoneMock, StatPill } from './LandingShared'

export default function LandingHeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 pb-20 pt-10 lg:grid-cols-2 lg:px-8 lg:pb-28 lg:pt-16">
      <div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-fuchsia-600 shadow-sm backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" />
          AI + 3D Experience
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mt-6 max-w-xl text-5xl font-bold leading-[1.02] tracking-[-0.04em] md:text-7xl"
        >
          Find calm in a
          <span className="block bg-gradient-to-r from-sky-600 via-indigo-600 to-fuchsia-500 bg-clip-text italic text-transparent">
            digital sanctuary.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mt-6 max-w-xl text-lg leading-8 text-slate-600"
        >
          A modern landing page with soft 3D visuals, premium glass cards, and a calming UI direction.
          Built to guide users naturally toward login, register, and your main product experience.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-9 flex flex-wrap items-center gap-4"
        >
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-3.5 font-semibold text-white shadow-[0_16px_40px_rgba(2,132,199,0.28)] transition hover:-translate-y-0.5 hover:bg-sky-700"
          >
            Get Started for Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#story" className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:text-slate-900">
            Watch Our Story
          </a>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={4}
          className="mt-10 grid max-w-xl grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <StatPill label="Smart Analytics" value="24K+" tone="blue" />
          <StatPill label="Emotion Accuracy" value="92%" tone="pink" />
          <StatPill label="Response Speed" value="0.8s" tone="green" />
        </motion.div>
      </div>

      <div className="relative min-h-[560px]">
        <motion.div
          className="absolute inset-0 rounded-[48px] bg-gradient-to-br from-sky-100/70 via-white to-violet-100/70 blur-2xl"
          animate={{ scale: [1, 1.03, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          className="absolute right-2 top-4 h-72 w-72 rounded-full border border-sky-200/70"
          animate={{ rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute right-10 top-14 h-56 w-56 rounded-full border border-violet-200/70"
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />

        <FloatingCard className="absolute left-0 top-8 w-[240px] p-5" delay={0.35}>
          <div className="text-sm text-slate-500">Realtime Mood Signal</div>
          <MiniBars />
        </FloatingCard>

        <FloatingCard className="absolute right-0 top-2 w-[210px] p-5" delay={0.45}>
          <div className="text-sm text-slate-500">Engagement</div>
          <div className="mt-3 text-5xl font-bold tracking-tight">87%</div>
          <div className="mt-1 text-sm font-medium text-emerald-600">+12.4% this week</div>
        </FloatingCard>

        <FloatingCard className="absolute left-[30px] top-[270px] w-[240px] p-5" delay={0.55}>
          <div className="text-sm text-slate-500">User Sentiment</div>
          <div className="mt-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-fuchsia-200 to-violet-300 shadow-inner" />
            <div>
              <div className="text-2xl font-semibold">Positive</div>
              <div className="text-sm text-slate-500">Stable session pattern</div>
            </div>
          </div>
        </FloatingCard>

        <div className="absolute bottom-8 right-0">
          <PhoneMock />
        </div>
      </div>
    </section>
  )
}

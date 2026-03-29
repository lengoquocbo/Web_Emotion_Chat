import { motion } from 'framer-motion'
import { HeartHandshake, ShieldCheck } from 'lucide-react'

import { communityGroups } from './landing-data'
import { FeatureCard, Soft3DObject } from './LandingShared'

export default function LandingFeatureSection() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <FeatureCard
          icon={HeartHandshake}
          title="AI Companion"
          desc="Private, always-on emotional support designed to feel calm, responsive, and present whenever users need a moment to breathe."
          accent="blue"
        >
          <Soft3DObject />
        </FeatureCard>

        <FeatureCard
          icon={ShieldCheck}
          title="Safe Communities"
          desc="Curated spaces for meaningful conversations with gentle moderation, thoughtful prompts, and built-in emotional safety cues."
          accent="green"
        >
          <div className="space-y-4 rounded-[24px] bg-white/70 p-4">
            {communityGroups.map(([label, dot]) => (
              <motion.div
                key={label}
                className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm"
                whileHover={{ x: 4 }}
              >
                <span className={`h-3 w-3 rounded-full ${dot}`} />
                <span className="text-sm font-medium text-slate-700">{label}</span>
              </motion.div>
            ))}
          </div>
        </FeatureCard>
      </div>
    </section>
  )
}

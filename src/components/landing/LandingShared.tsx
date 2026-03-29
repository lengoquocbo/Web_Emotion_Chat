import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'

import thienImage from '@/assets/img/thien.jpg'

type FloatingOrbProps = {
  className?: string
  delay?: number
  size?: number
}

export function FloatingOrb({ className = '', delay = 0, size = 220 }: FloatingOrbProps) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ width: size, height: size }}
      animate={{ y: [0, -18, 0], x: [0, 8, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  )
}

type FloatingCardProps = {
  children: ReactNode
  className?: string
  delay?: number
}

export function FloatingCard({ children, className = '', delay = 0 }: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ y: -6, rotateX: 3, rotateY: -3 }}
      className={`rounded-[28px] border border-slate-200/60 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}

type StatPillProps = {
  label: string
  value: string
  tone?: 'blue' | 'green' | 'pink'
}

export function StatPill({ label, value, tone = 'blue' }: StatPillProps) {
  const tones: Record<'blue' | 'green' | 'pink', string> = {
    blue: 'from-sky-100 to-indigo-100 text-slate-800',
    green: 'from-emerald-100 to-lime-100 text-slate-800',
    pink: 'from-fuchsia-100 to-rose-100 text-slate-800',
  }

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tones[tone]} px-4 py-3 shadow-sm`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  )
}

type FeatureCardProps = {
  icon: LucideIcon
  title: string
  desc: string
  accent?: 'blue' | 'green' | 'pink'
  children?: ReactNode
}

export function FeatureCard({
  icon: Icon,
  title,
  desc,
  accent = 'blue',
  children,
}: FeatureCardProps) {
  const accents: Record<'blue' | 'green' | 'pink', string> = {
    blue: 'from-sky-50 to-indigo-50',
    green: 'from-emerald-50 to-lime-50',
    pink: 'from-fuchsia-50 to-rose-50',
  }

  return (
    <FloatingCard className={`bg-gradient-to-br ${accents[accent]} p-6 md:p-7`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 text-slate-700 shadow-sm">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">{desc}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </FloatingCard>
  )
}

export function MiniBars() {
  const heights = [48, 72, 98, 64, 82]

  return (
    <div className="flex items-end gap-3 pt-3">
      {heights.map((height, index) => (
        <motion.div
          key={index}
          className="w-4 rounded-full bg-gradient-to-t from-sky-400 to-indigo-300"
          style={{ height }}
          animate={{ height: [height - 12, height, height - 6, height] }}
          transition={{ duration: 3 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export function Soft3DObject() {
  return (
    <motion.div
      className="relative mx-auto h-40 w-40"
      animate={{ rotate: [0, 8, -8, 0], y: [0, -8, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-indigo-200 via-violet-200 to-sky-200 shadow-[0_28px_60px_rgba(99,102,241,0.22)]" />
      <div className="absolute left-6 top-6 h-20 w-20 rounded-full bg-white/45 blur-sm" />
      <div className="absolute bottom-6 right-5 h-10 w-10 rounded-full bg-fuchsia-200/80 blur-[2px]" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[30px] bg-gradient-to-br from-violet-300 to-indigo-400 opacity-80 shadow-xl" />
      <div className="absolute bottom-[-18px] left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-slate-300/40 blur-md" />
    </motion.div>
  )
}

export function PhoneMock() {
  return (
    <motion.div
      className="relative mx-auto h-[320px] w-[240px] rounded-[34px] border border-white/70 bg-white/70 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      animate={{ y: [0, -8, 0], rotate: [0, 1.2, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transform: 'perspective(1000px) rotateY(-10deg) rotateX(6deg)', transformStyle: 'preserve-3d' }}
    >
      <img
        src={thienImage}
        alt="Mindful app preview"
        className="h-[230px] w-full rounded-[34px] object-cover"
      />
      <div className="space-y-4">
        <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
          <div className="h-3 w-20 rounded-full bg-slate-200" />
          <div className="h-3 w-28 rounded-full bg-slate-200" />
        </div>
      </div>
    </motion.div>
  )
}

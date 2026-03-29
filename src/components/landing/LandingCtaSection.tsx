import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function LandingCtaSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
      <motion.div
        className="rounded-[36px] bg-gradient-to-r from-sky-100 via-indigo-50 to-fuchsia-100 px-8 py-14 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          Join your users in a calmer digital space.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Use this landing page as your premium entry point, then route visitors smoothly to login,
          register, or the full app experience.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/register"
            className="rounded-2xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-800"
          >
            Join Sanctuary Today
          </Link>
          <Link
            to="/login"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Login
          </Link>
        </div>
      </motion.div>
    </section>
  )
}

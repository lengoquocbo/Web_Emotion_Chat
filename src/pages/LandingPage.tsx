import { motion, type Variants } from "framer-motion";
import { ArrowRight, ShieldCheck, HeartHandshake, Sparkles, Play, LogIn, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

function FloatingOrb({ className = "", delay = 0, size = 220 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl ${className}`}
      style={{ width: size, height: size }}
      animate={{ y: [0, -18, 0], x: [0, 8, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function FloatingCard({ children, className = "", delay = 0 }: { children?: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ y: -6, rotateX: 3, rotateY: -3 }}
      className={`rounded-[28px] border border-slate-200/60 bg-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
}

function StatPill({ label, value, tone = "blue" }: { label: string; value: string; tone?: "blue" | "green" | "pink" }) {
  const tones: Record<"blue" | "green" | "pink", string> = {
    blue: "from-sky-100 to-indigo-100 text-slate-800",
    green: "from-emerald-100 to-lime-100 text-slate-800",
    pink: "from-fuchsia-100 to-rose-100 text-slate-800",
  };

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tones[tone]} px-4 py-3 shadow-sm`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-xl font-bold">{value}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, accent = "blue", children }: { icon: LucideIcon; title: string; desc: string; accent?: "blue" | "green" | "pink"; children?: React.ReactNode }) {
  const accents: Record<"blue" | "green" | "pink", string> = {
    blue: "from-sky-50 to-indigo-50",
    green: "from-emerald-50 to-lime-50",
    pink: "from-fuchsia-50 to-rose-50",
  };

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
  );
}

function MiniBars() {
  const heights = [48, 72, 98, 64, 82];
  return (
    <div className="flex items-end gap-3 pt-3">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-4 rounded-full bg-gradient-to-t from-sky-400 to-indigo-300"
          style={{ height: h }}
          animate={{ height: [h - 12, h, h - 6, h] }}
          transition={{ duration: 3 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function Soft3DObject() {
  return (
    <motion.div
      className="relative mx-auto h-40 w-40"
      animate={{ rotate: [0, 8, -8, 0], y: [0, -8, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-indigo-200 via-violet-200 to-sky-200 shadow-[0_28px_60px_rgba(99,102,241,0.22)]" />
      <div className="absolute left-6 top-6 h-20 w-20 rounded-full bg-white/45 blur-sm" />
      <div className="absolute bottom-6 right-5 h-10 w-10 rounded-full bg-fuchsia-200/80 blur-[2px]" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-[30px] bg-gradient-to-br from-violet-300 to-indigo-400 opacity-80 shadow-xl" />
      <div className="absolute bottom-[-18px] left-1/2 h-6 w-24 -translate-x-1/2 rounded-full bg-slate-300/40 blur-md" />
    </motion.div>
  );
}

function PhoneMock() {
  return (
    
    <motion.div
      className="relative mx-auto h-[320px] w-[240px] rounded-[34px] border border-white/70 bg-white/70 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      animate={{ y: [0, -8, 0], rotate: [0, 1.2, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      style={{ transform: "perspective(1000px) rotateY(-10deg) rotateX(6deg)", transformStyle: "preserve-3d" }}
    >
     <img src="../../src/assets/img/thien.jpg" className="w-full h-[230px] rounded-[34px] object-cover"/>
      <div className="space-y-4">
      
        <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
          <div className="h-3 w-20 rounded-full bg-slate-200" />
          <div className="h-3 w-28 rounded-full bg-slate-200" />
        </div>
      </div>
      
    </motion.div>
  );
}

export default function LandingPage3D() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f8fafc] text-slate-900">
      <div className="relative isolate">
        <FloatingOrb className="left-[-60px] top-[100px] bg-sky-200/60" delay={0.3} size={220} />
        <FloatingOrb className="right-[-40px] top-[280px] bg-violet-200/60" delay={0.9} size={260} />
        <FloatingOrb className="left-[38%] top-[760px] bg-fuchsia-200/50" delay={0.5} size={200} />
<div className="fixed top-0 left-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">

        <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-sm font-bold text-white shadow-md">
              E
            </div>
            <div>
              <div className="font-semibold">Emotion AI</div>
              <div className="text-xs text-slate-500">Modern Experience Platform</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-slate-900">Features</a>
            <a href="#experience" className="transition hover:text-slate-900">Experience</a>
            <a href="#community" className="transition hover:text-slate-900">Community</a>
            <a href="#about" className="transition hover:text-slate-900">About</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
            <Link to="/register" className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800">
              Register
            </Link>
          </div>
        </header>
</div>
        <main>
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
                A modern landing page with soft 3D visuals, premium glass cards, and a calming UI direction. Built to guide users naturally toward login, register, and your main product experience.
              </motion.p>

              <motion.div
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={3}
                className="mt-9 flex flex-wrap items-center gap-4"
              >
                <Link to="/register" className="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-6 py-3.5 font-semibold text-white shadow-[0_16px_40px_rgba(2,132,199,0.28)] transition hover:-translate-y-0.5 hover:bg-sky-700">
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
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />

              <motion.div
                className="absolute right-2 top-4 h-72 w-72 rounded-full border border-sky-200/70"
                animate={{ rotate: 360 }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute right-10 top-14 h-56 w-56 rounded-full border border-violet-200/70"
                animate={{ rotate: -360 }}
                transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
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
                  {[
                    ["Anxiety Support Group", "bg-emerald-300"],
                    ["Daily Wellness Circle", "bg-fuchsia-300"],
                    ["Mindful Break Room", "bg-sky-300"],
                  ].map(([label, dot]) => (
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

          <section className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
            <FloatingCard className="grid gap-6 p-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:p-8" delay={0.2}>
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Emotional Insights
                </div>
                <h3 className="text-3xl font-semibold tracking-tight">Gentle analytics that feel human.</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600">
                  Track growth with supportive visuals, subtle motion, and readable feedback designed for reflection instead of pressure.
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

          <section id="experience" className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:px-8">
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Experience the Peace</div>
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">A calmer interface with depth and motion.</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
                This section recreates the premium softness of the reference design while adding layered 3D motion, floating cards, glass surfaces, and ambient gradients.
              </p>
              <ul className="mt-8 space-y-4 text-slate-700">
                {[
                  "Micro-interactions that feel light and natural",
                  "Calm content hierarchy with breathing room",
                  "Subtle motion to create depth without distraction",
                ].map((item) => (
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

          <section id="community" className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            <div className="text-center">
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">What our community says</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">Designed to feel warm, modern, and trustworthy.</h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {[
                ["This feels soft and premium without looking cold. The motion gives the page life.", "Priya N."],
                ["The visual direction balances calm energy and modern product design really well.", "Hasan K."],
                ["I love the layered 3D cards. They make the hero feel interactive immediately.", "Lena R."],
              ].map(([quote, name], i) => (
                <FloatingCard key={name} className="p-6" delay={0.15 * i}>
                  <p className="text-sm leading-7 text-slate-600">“{quote}”</p>
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

          <section className="mx-auto max-w-5xl px-6 py-16 lg:px-8">
            <motion.div
              className="rounded-[36px] bg-gradient-to-r from-sky-100 via-indigo-50 to-fuchsia-100 px-8 py-14 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl">Join your users in a calmer digital space.</h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                Use this landing page as your premium entry point, then route visitors smoothly to login, register, or the full app experience.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link to="/register" className="rounded-2xl bg-slate-900 px-6 py-3.5 font-semibold text-white transition hover:bg-slate-800">
                  Join Sanctuary Today
                </Link>
                <Link to="/login" className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-medium text-slate-700 transition hover:bg-slate-50">
                  Login
                </Link>
              </div>
            </motion.div>
          </section>
        </main>

        <footer id="about" className="mx-auto flex max-w-7xl flex-col justify-between gap-4 border-t border-slate-200/80 px-6 py-8 text-sm text-slate-500 md:flex-row lg:px-8">
          <div>
            <div className="font-semibold text-slate-700">Emotion AI</div>
            <div>Soft visuals. Clear hierarchy. Modern calm.</div>
          </div>
          <div>CopyRight: QuocBo- QuangHuy</div>
          <div className="flex flex-wrap gap-5">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
            <a href="#">Support</a>
            <a href="#">Contact</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

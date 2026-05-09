import { type ReactNode } from 'react'
import { Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'

import bgImage from '@/assets/img/bg.jpg'

type AuthShellProps = {
  title: string
  description: string
  footerPrompt: string
  footerLinkLabel: string
  footerLinkTo: string
  children: ReactNode
}

export default function AuthShell({
  title,
  description,
  footerPrompt,
  footerLinkLabel,
  footerLinkTo,
  children,
}: AuthShellProps) {
  return (
    <div className="h-dvh overflow-hidden bg-[linear-gradient(135deg,#f6ddff_0%,#d6e8ff_100%)] px-3 py-3 sm:px-5 sm:py-5 lg:px-7">
      <div className="mx-auto flex h-full max-w-[1280px] flex-col">
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <div className="grid h-full max-h-[660px] w-full max-w-[920px] overflow-hidden rounded-[40px] bg-white/55 shadow-[0_24px_72px_rgba(71,85,105,0.16)] backdrop-blur xl:grid-cols-[0.98fr_1.02fr]">
            <section className="app-scrollbar min-h-0 overflow-y-auto bg-[linear-gradient(180deg,rgba(244,240,255,0.95)_0%,rgba(235,241,255,0.96)_100%)] px-6 py-6 sm:px-8 sm:py-8 lg:px-9 lg:py-9">
              <Link to="/" className="inline-flex items-center gap-3 text-sky-800">
                <Leaf className="size-6" />
                <span className="text-[1.7rem] font-semibold tracking-tight">Sanctuary</span>
              </Link>

              <div className="mt-6 max-w-xl">
                <h1 className="text-3xl font-semibold leading-[1.14] tracking-tight text-slate-900 sm:text-[2.45rem]">
                  {title}
                </h1>
                <p className="mt-3 max-w-lg text-[15px] leading-7 text-slate-500">{description}</p>
              </div>

              <div className="mt-6 max-w-xl">{children}</div>

              <div className="mt-6 text-center text-sm text-slate-500">
                {footerPrompt}{' '}
                <Link to={footerLinkTo} className="font-semibold text-sky-800 hover:text-sky-900">
                  {footerLinkLabel}
                </Link>
              </div>
            </section>

            <section
              className="relative hidden h-full overflow-hidden xl:block"
              style={{
                backgroundImage: `linear-gradient(180deg,rgba(71,85,105,0.35),rgba(191,219,254,0.08)), url(${bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(191,219,254,0.4),transparent_38%),radial-gradient(circle_at_bottom_left,rgba(219,234,254,0.22),transparent_30%)]" />
              <div className="absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(255,255,255,0.55),transparent_50%)]" />

              <div className="absolute bottom-8 left-1/2 w-[74%] -translate-x-1/2 rounded-[2rem] border border-white/35 bg-white/18 p-6 text-sky-900 shadow-[0_24px_60px_rgba(15,23,42,0.15)] backdrop-blur-xl">
                <div className="flex size-14 items-center justify-center rounded-full bg-emerald-200 text-emerald-950 shadow-[0_12px_30px_rgba(16,185,129,0.18)]">
                  <span className="text-2xl">"</span>
                </div>

                <p className="mt-6 text-[1.3rem] italic leading-[1.45] tracking-tight">
                  The soul always knows what to do to heal itself. The challenge is to silence the
                  mind.
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-slate-700/75 text-sm font-semibold text-white">
                    EV
                  </div>
                  <div>
                    <p className="text-lg font-semibold">Elena Vance</p>
                    <p className="text-sm text-sky-900/70">Wellness Lead at Sanctuary</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-3 shrink-0 flex flex-wrap items-center justify-center gap-5 px-4 text-xs font-medium uppercase tracking-[0.2em] text-sky-800/75">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Contact Us</a>
        </footer>
      </div>
    </div>
  )
}

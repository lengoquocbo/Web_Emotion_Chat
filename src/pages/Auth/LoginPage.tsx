import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

import AuthDivider from '@/components/auth/AuthDivider'
import AuthShell from '@/components/auth/AuthShell'
import AuthSocialButtons from '@/components/auth/AuthSocialButtons'
import { div } from 'framer-motion/client'

export default function LoginPage() {
  return (

    <AuthShell
      title="Welcome back to your space."
      description="Find your center and continue your journey to emotional wellness."
      footerPrompt="New here?"
      footerLinkLabel="Create your account"
      footerLinkTo="/register"
    >
      <form className="space-y-8">
        <div>
          <label htmlFor="email" className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="hello@yoursanctuary.com"
            className="mt-3 h-[50px] w-full
                       rounded-2xl border border-white/60 bg-white px-7 text-xl text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.05)] o
                       utline-none placeholder:text-slate-400 focus:border-sky-200"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <label htmlFor="password" className="  text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Password
            </label>
            <Link to="/forgot-password" className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800">
              Forgot?
            </Link>
          </div>
          <div className="relative mt-3">
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="h-[50px] w-full rounded-2xl border border-white/60 bg-white px-7 pr-16 text-xl text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.05)] outline-none placeholder:text-slate-400 focus:border-sky-200"
            />
            <button
              type="button"
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              <Eye className="size-6" />
            </button>
          </div>
        </div>

        <button className="flex h-[50px] w-full items-center justify-center rounded-full bg-sky-800 text-2xl font-semibold text-white shadow-[0_24px_50px_rgba(14,116,144,0.22)] transition hover:-translate-y-0.5 hover:bg-sky-900">
          Login
        </button>
      </form>

      <AuthDivider />
      <AuthSocialButtons />
    </AuthShell>
    
  )
}

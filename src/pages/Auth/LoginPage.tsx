import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Navigate, Link, useNavigate } from 'react-router-dom'

import AuthDivider from '@/components/auth/AuthDivider'
import AuthShell from '@/components/auth/AuthShell'
import AuthSocialButtons from '@/components/auth/AuthSocialButtons'
import { useLogin } from '@/hooks/auth/useLogin'
import { useAuth } from '@/hooks/auth/useAuth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { token, isLoading } = useAuth()
  const { handleLogin, error, loading } = useLogin()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await handleLogin(email, password)

    if (success) {
      navigate('/home', { replace: true })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (token) {
    return <Navigate to="/home" replace />
  }

  return (
    <AuthShell
      title="Welcome back to your space."
      description="Find your center and continue your journey to emotional wellness."
      footerPrompt="New here?"
      footerLinkLabel="Create your account"
      footerLinkTo="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="hello@yoursanctuary.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="mt-3 h-[50px] w-full rounded-2xl border border-white/60 bg-white px-7 text-xl text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.05)] outline-none placeholder:text-slate-400 focus:border-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="password"
              className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500"
            >
              Password
            </label>
            <button
              type="button"
              className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-800 hover:text-sky-900"
            >
              Forgot?
            </button>
          </div>

          <div className="relative mt-3">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="h-[50px] w-full rounded-2xl border border-white/60 bg-white px-7 pr-16 text-xl text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.05)] outline-none placeholder:text-slate-400 focus:border-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              disabled={loading}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? <EyeOff className="size-6" /> : <Eye className="size-6" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-[50px] w-full items-center justify-center rounded-full bg-sky-800 text-2xl font-semibold text-white shadow-[0_24px_50px_rgba(14,116,144,0.22)] transition hover:-translate-y-0.5 hover:bg-sky-900 disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:bg-sky-800"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <AuthDivider />
      <AuthSocialButtons />
    </AuthShell>
  )
}

import { Eye } from 'lucide-react'
import { useState } from "react";
import { useRegister } from "../../hooks/auth/useRegister";


import AuthDivider from '@/components/auth/AuthDivider'
import AuthShell from '@/components/auth/AuthShell'
import AuthSocialButtons from '@/components/auth/AuthSocialButtons'

export default function RegisterPage() {
  const { handleRegister, error, loading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    displayName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister(formData.username, formData.email, formData.password, formData.confirmPassword, formData.displayName);
  };



  return (
  
    <AuthShell
      title="Create your sanctuary."
      description="Set up your account and begin a calmer, more intentional emotional wellness journey."
      footerPrompt="Already with us?"
      footerLinkLabel="Sign in here"
      footerLinkTo="/login"
    >
      <form className="space-y-7" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="username" className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Your calm name"
            value={formData.username}
            onChange={handleChange}
            className="mt-3 h-[50px] w-full rounded-2xl border border-white/60 bg-white px-7 text-xl text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.05)] outline-none placeholder:text-slate-400 focus:border-sky-200"
          />
        </div>

        


        <div>
          <label htmlFor="email" className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="hello@yoursanctuary.com"
            value={formData.email}
            onChange={handleChange}
            className="mt-3 h-[50px] w-full rounded-2xl border border-white/60 bg-white px-7 text-xl text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.05)] outline-none placeholder:text-slate-400 focus:border-sky-200"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Password
          </label>
          <div className="relative mt-3">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a gentle password"
              value={formData.password}
              onChange={handleChange}
              className="h-[50px] w-full rounded-2xl border border-white/60 bg-white px-7 pr-16 text-xl text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.05)] outline-none placeholder:text-slate-400 focus:border-sky-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              <Eye className="size-6" />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Confirm Password
          </label>
          <div className="relative mt-3">
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="h-[50px] w-full rounded-2xl border border-white/60 bg-white px-7 pr-16 text-xl text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.05)] outline-none placeholder:text-slate-400 focus:border-sky-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
            >
              <Eye className="size-6" />
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="displayName" className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Display Name
          </label>
          <input
            id="displayName"
            type="text"
            placeholder="How should we call you?"
            value={formData.displayName}
            onChange={handleChange}
            className="mt-3 h-[50px] w-full rounded-2xl border border-white/60 bg-white px-7 text-xl text-slate-700 shadow-[0_16px_40px_rgba(15,23,42,0.05)] outline-none placeholder:text-slate-400 focus:border-sky-200"
          />
        </div>

        <div className="flex items-start gap-3 rounded-2xl bg-white/70 px-5 py-4 text-base leading-7 text-slate-500 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
          <input id="terms" type="checkbox" className="mt-1 size-5 rounded border-slate-300 text-sky-700" />
          <label htmlFor="terms">
            I agree to Sanctuary&apos;s terms of care, privacy policy, and supportive communication
            guidelines.
          </label>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="flex h-20 w-full items-center justify-center rounded-full bg-sky-800 text-2xl font-semibold text-white shadow-[0_24px_50px_rgba(14,116,144,0.22)] transition hover:-translate-y-0.5 hover:bg-sky-900 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Create My Account'}
        </button>
      </form>

      <AuthDivider />
      <AuthSocialButtons />
    </AuthShell>
     
  )
}

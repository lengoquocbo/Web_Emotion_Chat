export default function AuthSocialButtons() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2">
      <button className="flex h-[50px] items-center justify-center gap-4 rounded-full bg-white px-6 text-xl font-medium text-slate-800 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold">G</span>
        Google
      </button>
      <button className="flex h-[50px] items-center justify-center gap-4 rounded-full bg-white px-6 text-xl font-medium text-slate-800 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold">A</span>
        Apple
      </button>
    </div>
  )
}

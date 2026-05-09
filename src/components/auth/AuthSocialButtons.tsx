import ggIcon from '@/assets/img/gg.png'
import { getGoogleLoginUrl } from '@/services/authService'

export default function AuthSocialButtons() {
  const handleGoogleLogin = () => {
    window.location.href = getGoogleLoginUrl()
  }

  return (
    <div className="mt-7 sm:grid-cols-2">
      <button
        onClick={handleGoogleLogin}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-full bg-white px-5 text-base font-medium text-slate-800 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-semibold">
          <img src={ggIcon} alt="Google" className="size-4" />
        </span>
        Google
      </button>
    </div>
  )
}

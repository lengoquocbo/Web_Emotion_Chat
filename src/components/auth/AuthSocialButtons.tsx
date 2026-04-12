import ggIcon from '@/assets/img/gg.png'
import { getGoogleLoginUrl } from '@/services/authService'

export default function AuthSocialButtons() {
  const handleGoogleLogin = () => {
    window.location.href = getGoogleLoginUrl()
  }

  return (
    <div className="mt-10 sm:grid-cols-2">
      <button
        onClick={handleGoogleLogin}
        className="w-full flex h-[50px] items-center justify-center gap-4 rounded-full bg-white px-6 text-xl font-medium text-slate-800 shadow-[0_18px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5"
      >
        <span className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-sm font-semibold">
          <img src={ggIcon} alt="Google" className="size-5" />
        </span>
        Google
      </button>
    </div>
  )
}
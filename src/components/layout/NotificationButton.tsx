import { Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotificationButton() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/notifications')}
      className="flex size-11 items-center justify-center rounded-full bg-white text-slate-500 shadow-[0_10px_20px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:text-slate-700"
    >
      <Bell className="size-4" />
    </button>
  )
}

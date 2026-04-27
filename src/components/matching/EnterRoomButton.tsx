type EnterRoomButtonProps = {
  disabled?: boolean
  onClick: () => void
}

export default function EnterRoomButton({ disabled, onClick }: EnterRoomButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      Vao phong chat
    </button>
  )
}

type JoinQueueButtonProps = {
  disabled?: boolean
  onClick: () => void
}

export default function JoinQueueButton({ disabled, onClick }: JoinQueueButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 items-center justify-center rounded-full bg-sky-800 px-6 text-sm font-semibold text-white transition hover:bg-sky-900 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      TÌM NHÓM PHÙ HỢP NGAY
    </button>
  )
}

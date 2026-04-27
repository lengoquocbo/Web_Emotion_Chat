type LeaveQueueButtonProps = {
  disabled?: boolean
  onClick: () => void
}

export default function LeaveQueueButton({ disabled, onClick }: LeaveQueueButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
    >
      Rời hàng chờ
    </button>
  )
}

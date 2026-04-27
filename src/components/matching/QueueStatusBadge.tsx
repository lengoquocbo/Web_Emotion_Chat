import { MatchingRequestStatus, MatchingRoomStatus } from '@/types/matching'

type QueueStatusBadgeProps = {
  roomStatus?: string | null
  requestStatus: string
  canEnterRoom: boolean
}

export default function QueueStatusBadge({
  roomStatus,
  requestStatus,
  canEnterRoom,
}: QueueStatusBadgeProps) {
  const label = canEnterRoom ? MatchingRoomStatus.Ready : roomStatus ?? requestStatus
  const tone =
    canEnterRoom || roomStatus === MatchingRoomStatus.Active
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : requestStatus === MatchingRequestStatus.Cancelled ||
          requestStatus === MatchingRequestStatus.Exprired
        ? 'bg-amber-50 text-amber-700 border-amber-100'
        : 'bg-sky-50 text-sky-700 border-sky-100'

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>
      {label}
    </span>
  )
}

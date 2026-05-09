import { CheckCircle2 } from 'lucide-react'

import {
  MatchingRequestStatus,
  MatchingRoomStatus,
  type MatchingQueueState,
} from '@/types/matching'

import EnterRoomButton from './EnterRoomButton'
import LeaveQueueButton from './LeaveQueueButton'
import QueueStatusBadge from './QueueStatusBadge'

type MatchingQueueCardProps = {
  queueState: MatchingQueueState
  isBusy: boolean
  onEnterRoom: () => void
  onLeaveQueue: () => void
  onDefer?: () => void
}

export default function MatchingQueueCard({
  queueState,
  isBusy,
  onEnterRoom,
  onLeaveQueue,
  onDefer,
}: MatchingQueueCardProps) {
  const title =
    queueState.requestStatus === MatchingRequestStatus.Cancelled
      ? 'Bạn đã rời hàng chờ'
      : queueState.requestStatus === MatchingRequestStatus.Exprired
        ? 'Hàng chờ đã hết hạn'
        : queueState.canEnterRoom
          ? 'Nhóm đã sẵn sàng, hãy vào phòng ngay!'
          : queueState.joinedExistingRoom
            ? 'Bạn đã vào một nhóm đang chờ'
            : 'Đang tìm nhóm phù hợp'

  const description =
    queueState.requestStatus === MatchingRequestStatus.Cancelled
      ? 'Matching request này đã bị hủy. Bạn có thể bắt đầu lại'
      : queueState.requestStatus === MatchingRequestStatus.Exprired
        ? 'Matching request này đã hết hạn. Bạn có thể bắt đầu lại từ màn hình kết quả.'
        : queueState.canEnterRoom || queueState.roomStatus === MatchingRoomStatus.Active
          ? 'Bạn có thể bắt đầu trò chuyện ngay bây giờ.'
          : queueState.joinedExistingRoom
            ? 'Chúng tôi sẽ thông báo khi nhóm sẵn sàng.'
            : 'Bạn có thể rời hàng chờ bất cứ lúc nào.'

  const showEnterButton =
    queueState.canEnterRoom ||
    queueState.roomStatus === MatchingRoomStatus.Ready ||
    queueState.roomStatus === MatchingRoomStatus.Active

  const showLeaveButton =
    !showEnterButton &&
    queueState.requestStatus !== MatchingRequestStatus.Cancelled &&
    queueState.requestStatus !== MatchingRequestStatus.Exprired

  return (
    <section className="rounded-[2rem] bg-white px-6 py-6 shadow-[0_22px_48px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            Matching Queue
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-600 md:text-base">{description}</p>
        </div>

        <QueueStatusBadge
          requestStatus={queueState.requestStatus}
          roomStatus={queueState.roomStatus}
          canEnterRoom={queueState.canEnterRoom}
        />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[1.5rem] bg-slate-50 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Members</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">
            {queueState.memberCount}/{queueState.maxMembers}
          </p>
          <p className="mt-2 text-sm text-slate-500">Ít nhất {queueState.minMembers} thành viên</p>
        </div>

        <div className="rounded-[1.5rem] bg-slate-50 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Request</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">{queueState.requestStatus}</p>
        </div>

        <div className="rounded-[1.5rem] bg-slate-50 px-5 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Room</p>
          <p className="mt-3 text-xl font-semibold text-slate-900">{queueState.roomStatus ?? 'Waiting'}</p>
        </div>
      </div>

      {showEnterButton ? (
        <div className="mt-6 rounded-[1.75rem] border border-emerald-100 bg-emerald-50/70 px-5 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Match Success
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-900">
                Nhóm phù hợp đã sẵn sàng cho bạn
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600 md:text-base">
                Bạn đã được ghép nhóm thành công. Bạn có thể vào phòng chat ngay bây giờ hoặc để sau và quay lại bất cứ lúc nào.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {showEnterButton ? (
          <EnterRoomButton disabled={isBusy} onClick={onEnterRoom} />
        ) : null}
        {showEnterButton && onDefer ? (
          <button
            onClick={onDefer}
            disabled={isBusy}
            className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            Để sau
          </button>
        ) : null}
        {showLeaveButton ? (
          <LeaveQueueButton disabled={isBusy} onClick={onLeaveQueue} />
        ) : null}
      </div>
    </section>
  )
}

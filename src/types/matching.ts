import type { CheckInCompletedDto, MatchingCandidate } from '@/types/checkIn'

export enum MatchingRequestStatus {
  Created = 'Created',
  Queued = 'Queued',
  Assigned = 'Assigned',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Exprired = 'Exprired',
}

export enum MatchingRoomStatus {
  Waiting = 'Waiting',
  Ready = 'Ready',
  Active = 'Active',
  Closed = 'Closed',
  Archived = 'Archived',
}

export interface MatchingQueueState {
  matchingRequestId: string
  roomId?: string | null
  requestStatus: MatchingRequestStatus | string
  roomStatus?: MatchingRoomStatus | string | null
  memberCount: number
  minMembers: number
  maxMembers: number
  joinedExistingRoom: boolean
  canEnterRoom: boolean
}

export interface JoinOrCreateRoomResponseDto extends Omit<MatchingQueueState, 'roomId'> {
  roomId: string
}

export interface MatchingStatusResponseDto extends MatchingQueueState {}

export interface CheckInCompletedRouteState {
  checkInResult: CheckInCompletedDto
}

export interface MatchingQueueRouteState {
  queueState: JoinOrCreateRoomResponseDto | MatchingStatusResponseDto
  sessionId?: string
  confirmedSummary?: string | null
  topEmotion?: string | null
  candidates?: MatchingCandidate[]
}

export const isMatchingTerminalState = (queueState: MatchingQueueState | null | undefined) => {
  if (!queueState) {
    return false
  }

  if (queueState.canEnterRoom) {
    return true
  }

  return (
    queueState.requestStatus === MatchingRequestStatus.Cancelled ||
    queueState.requestStatus === MatchingRequestStatus.Completed ||
    queueState.requestStatus === MatchingRequestStatus.Exprired ||
    queueState.roomStatus === MatchingRoomStatus.Closed ||
    queueState.roomStatus === MatchingRoomStatus.Archived
  )
}

export type FriendshipStatus =
  | 'Pending'
  | 'Accepted'
  | 'Rejected'
  | 'Cancelled'
  | 'Blocked'

export interface UserSummaryDto {
  id: string
  username: string
  email: string
  displayName: string
}

export interface FriendshipDto {
  id: string
  requesterId: string
  addresseeId: string
  status: FriendshipStatus
  requestedAt: string
  respondedAt: string | null
  cancelledAt: string | null
  blockedAt: string | null
  requester: UserSummaryDto
  addressee: UserSummaryDto
}

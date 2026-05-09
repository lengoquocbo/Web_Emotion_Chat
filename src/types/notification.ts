export type NotificationType =
  | 'FriendRequestReceived'
  | 'FriendRequestAccepted'
  | 'AchievementUnlocked'
  | 'RoomReady'
  | 'MessageReceived'

export interface NotificationDto {
  id: string
  userId: string
  type: NotificationType
  title: string
  body?: string
  payloadJson: string | null
  isRead: boolean
  createdAt: string
  readAt?: string | null
}

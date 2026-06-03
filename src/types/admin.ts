export type PagedAdminResult<T> = {
  items: T[]
  totalCount: number
  skip: number
  take: number
}

export type AdminUserRow = {
  id: string
  displayName: string
  username: string
  email: string
  status: string
  role: string
  avatarUrl?: string
  roomCount: number
  totalPoints: number
  achievementCount: number
  isGoogleAccount: boolean
  createdAt: string
  updatedAt: string
}

export type AdminRoomRow = {
  id: string
  name?: string
  roomType: string
  status: string
  memberCount: number
  maxMembers: number
  minMembers: number
  createdByDisplayName: string
  createdByUsername: string
  messageCount: number
  createdAt: string
  closedAt?: string
}

export type AdminLoginAudit = {
  id: string
  user: string
  identifier: string
  ipAddress: string
  location: string
  device: string
  browser: string
  isSuccess: boolean
  failureReason?: string
  createdAt: string
}

export type AdminUserQuery = {
  search?: string
  status?: string
  role?: string
  skip?: number
  take?: number
}

export type AdminRoomQuery = {
  search?: string
  status?: string
  roomType?: string
  skip?: number
  take?: number
}

export type CreateAdminUserRequest = {
  username: string
  email: string
  displayName: string
  password: string
  role: 'User' | 'Admin'
}

export type UpdateAdminUserRequest = {
  displayName?: string
  bio?: string
  avatarUrl?: string
  password?: string
  status?: 'Active' | 'Suspended' | 'Deleted'
  role?: 'User' | 'Admin'
}

export type AdminRoomConversationMessage = {
  id: string
  senderId: string
  senderName: string
  senderUsername: string
  messageType: string
  content: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  editedAt?: string
  createdAt: string
}

export type AdminRoomConversationExport = {
  roomId: string
  roomName?: string
  roomType: string
  status: string
  createdAt: string
  messages: AdminRoomConversationMessage[]
}

export type AdminAchievement = {
  id: string
  code: string
  name: string
  description: string
  category: string
  iconUrl?: string
  targetValue: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type UpsertAdminAchievementRequest = {
  code: string
  name: string
  description: string
  category: 'CheckIn' | 'Friendship' | 'Chat' | 'Reflection' | 'Matching' | 'Streak'
  iconUrl?: string
  targetValue: number
  isActive: boolean
}

export type AdminAccessRule = {
  id: string
  type: 'Ip' | 'Device' | 'Browser'
  value: string
  action: string
  reason?: string
  createdAt: string
}

export type CreateAccessRuleRequest = {
  type: 'Ip' | 'Device' | 'Browser'
  value: string
  reason: string
}
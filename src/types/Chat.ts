export type MessageType = 'Text' | 'Image' | 'File' | 'System'
export type RoomType    = 'Matching' | 'Community' | 'AI'
export type RoomStatus  = 'Open' | 'Closed'

// ─── Message — khớp CHÍNH XÁC response backend ───────────────────────────────
// Backend trả flat fields, KHÔNG có nested sender object:
// { id, roomId, senderId, senderUsername, messageType, content, createdAt, editedAt, deletedAt }

export interface Message {
  id: string
  roomId: string
  senderId: string
  senderUsername: string        // ← flat field từ backend
  senderDisplayName?: string    // ← có thể có hoặc không
  messageType: MessageType
  content: string
  createdAt: string
  editedAt: string | null
  deletedAt: string | null
}

// ─── Room ─────────────────────────────────────────────────────────────────────

export interface Room {
  id: string
  name: string | null
  roomType: RoomType
  status: RoomStatus
  maxMembers: number
  currentMemberCount: number
  createdById: string
  createdAt: string
  closedAt: string | null
}

// ─── Room Member (sau khi thêm API backend) ───────────────────────────────────

export interface RoomMember {
  userId: string
  userName: string        // ← khớp backend DTO: UserName (Pascal → camelCase)
  displayName?: string   // ← optional, backend có thể không có
  avatarUrl?: string
  joinedAt?: string
}

// ─── Presence ─────────────────────────────────────────────────────────────────

export interface OnlineUser {
  userId: string
  isOnline: boolean
}

// ─── REST ─────────────────────────────────────────────────────────────────────

export interface SendMessageRequest {
  roomId: string
  content: string
  messageType: MessageType
}

export interface EditMessageRequest {
  content: string
}

export interface PagedResult<T> {
  items: T[]
  pageNumber: number
  pageSize: number
  totalCount: number
}

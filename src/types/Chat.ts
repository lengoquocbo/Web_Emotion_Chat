export type MessageType = 'Text' | 'Image' | 'File' | 'System'
export type RoomType    = 'Matching' | 'Community' | 'AI'
export type RoomStatus  = 'Open' | 'Closed'

// ─── Message — khớp CHÍNH XÁC response backend ───────────────────────────────
// Backend MessageDto trả về:
// { id, roomId, senderId, senderUsername, messageType, content,
//   fileUrl, fileName, fileSize, createdAt, editedAt, deletedAt }

export interface Message {
  id: string
  roomId: string
  senderId: string
  senderUsername: string        // flat field từ backend
  senderDisplayName?: string    // optional
  messageType: MessageType
  content: string

  // ── File / Image fields (null với tin nhắn Text thông thường) ──
  fileUrl: string | null
  fileName: string | null
  fileSize: number | null       // bytes

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

// ─── Room Member ──────────────────────────────────────────────────────────────

export interface RoomMember {
  userId: string
  userName: string
  displayName?: string
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

  // Optional — chỉ dùng khi gửi ảnh hoặc file tài liệu
  fileUrl?: string
  fileName?: string
  fileSize?: number
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

// ─── Upload ───────────────────────────────────────────────────────────────────

/** Response từ POST /api/Upload/image và /api/Upload/file */
export interface FileUploadResponseDto {
  url: string
  fileName: string
  fileSize: number
  fileType: string   // 'image' | 'file'
}
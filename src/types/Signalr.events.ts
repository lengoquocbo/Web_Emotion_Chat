// ─── Server → Client (lắng nghe bằng connection.on) ─────────────────────────

export const ChatEvents = {
  // ChatHub broadcasts khi có tin nhắn mới trong room
  ReceiveMessage: 'ReceiveMessage',
} as const

export const PresenceEvents = {
  // PresenceHub broadcasts khi user kết nối
  UserOnline:  'UserOnline',
  // PresenceHub broadcasts khi user ngắt kết nối
  UserOffline: 'UserOffline',
} as const

// ─── Client → Server (gọi bằng connection.invoke) ────────────────────────────

export const ChatMethods = {
  JoinRoom:    'JoinRoom',
  LeaveRoom:   'LeaveRoom',
  SendMessage: 'SendMessage',
} as const
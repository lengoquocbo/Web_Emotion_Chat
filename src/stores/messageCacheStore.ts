import type { Message } from '@/types/Chat'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RoomCache {
  messages: Message[]       // đã sort tăng dần theo createdAt
  pageNumber: number        // page cuối đã load
  hasMore: boolean          // còn tin cũ hơn để loadMore không
  loadedAt: number          // timestamp lần đầu load (ms)
}

type Listener = () => void

// ─── Store ────────────────────────────────────────────────────────────────────
// Singleton nằm ngoài React → không bị reset khi re-render
// Tất cả component dùng useChat đều share cùng 1 instance này

class MessageCacheStore {
  private cache = new Map<string, RoomCache>()
  private listeners = new Map<string, Set<Listener>>()

  // ── Read ──────────────────────────────────────────────────────────────────

  get(roomId: string): RoomCache | undefined {
    return this.cache.get(roomId)
  }

  has(roomId: string): boolean {
    return this.cache.has(roomId)
  }

  // ── Write ─────────────────────────────────────────────────────────────────

  /** Set toàn bộ cache lần đầu (sau khi API trả về trang 1) */
  init(roomId: string, messages: Message[], hasMore: boolean): void {
    this.cache.set(roomId, {
      messages,           // đã reverse đúng chiều ở caller
      pageNumber: 1,
      hasMore,
      loadedAt: Date.now(),
    })
    this.notify(roomId)
  }

  /** Prepend tin cũ hơn khi loadMore (scroll lên) */
  prepend(roomId: string, olderMessages: Message[], nextPage: number, hasMore: boolean): void {
    const existing = this.cache.get(roomId)
    if (!existing) return

    // Tránh duplicate khi SignalR và REST trả về tin trùng id
    const existingIds = new Set(existing.messages.map(m => m.id))
    const fresh = olderMessages.filter(m => !existingIds.has(m.id))

    this.cache.set(roomId, {
      ...existing,
      messages: [...fresh, ...existing.messages],
      pageNumber: nextPage,
      hasMore,
    })
    this.notify(roomId)
  }

  /** Append 1 tin mới nhất từ SignalR */
  append(roomId: string, message: Message): void {
    const existing = this.cache.get(roomId)

    if (!existing) {
      // Room chưa có cache (user chưa mở room này lần nào)
      // Không init ở đây — để useChat init khi user thực sự mở room
      return
    }

    // Tránh duplicate — server broadcast kể cả người gửi
    const alreadyExists = existing.messages.some(m => m.id === message.id)
    if (alreadyExists) return

    this.cache.set(roomId, {
      ...existing,
      messages: [...existing.messages, message],
    })
    this.notify(roomId)
  }

  /** Cập nhật 1 tin đã edit */
  update(roomId: string, updated: Message): void {
    const existing = this.cache.get(roomId)
    if (!existing) return

    this.cache.set(roomId, {
      ...existing,
      messages: existing.messages.map(m => (m.id === updated.id ? updated : m)),
    })
    this.notify(roomId)
  }

  /** Soft delete — thay content bằng "[Deleted]" */
  remove(roomId: string, messageId: string): void {
    const existing = this.cache.get(roomId)
    if (!existing) return

    this.cache.set(roomId, {
      ...existing,
      messages: existing.messages.map(m =>
        m.id === messageId ? { ...m, content: '[Deleted]', deletedAt: new Date().toISOString() } : m,
      ),
    })
    this.notify(roomId)
  }

  /** Xoá cache 1 room (VD: user leave room) */
  invalidate(roomId: string): void {
    this.cache.delete(roomId)
    this.notify(roomId)
  }

  /** Xoá toàn bộ cache (VD: logout) */
  clear(): void {
    const rooms = [...this.cache.keys()]
    this.cache.clear()
    rooms.forEach(id => this.notify(id))
  }

  // ── Subscribe (để useChat re-render khi cache thay đổi) ───────────────────

  subscribe(roomId: string, listener: Listener): () => void {
    if (!this.listeners.has(roomId)) {
      this.listeners.set(roomId, new Set())
    }
    this.listeners.get(roomId)!.add(listener)

    // Trả về hàm unsubscribe
    return () => {
      this.listeners.get(roomId)?.delete(listener)
    }
  }

  private notify(roomId: string): void {
    this.listeners.get(roomId)?.forEach(fn => fn())
  }
}

// Export singleton
export const messageCacheStore = new MessageCacheStore()
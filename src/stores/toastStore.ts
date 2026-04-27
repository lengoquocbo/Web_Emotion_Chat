// ─── Types ────────────────────────────────────────────────────────────────────

export interface Toast {
  id: string
  roomId: string
  roomName: string
  senderName: string
  content: string
  createdAt: number // Date.now()
}

type Listener = () => void

// ─── Store singleton ──────────────────────────────────────────────────────────

class ToastStore {
  private toasts: Toast[] = []
  private listeners = new Set<Listener>()
  private timers = new Map<string, ReturnType<typeof setTimeout>>()

  getAll(): Toast[] {
    return this.toasts
  }

  add(toast: Omit<Toast, 'id' | 'createdAt'>): void {
    const id = `${toast.roomId}-${Date.now()}`
    const newToast: Toast = { ...toast, id, createdAt: Date.now() }

    this.toasts = [newToast, ...this.toasts].slice(0, 5) // max 5 toast cùng lúc
    this.notify()

    // Tự xóa sau 4 giây
    const timer = setTimeout(() => this.remove(id), 4000)
    this.timers.set(id, timer)
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter(t => t.id !== id)
    clearTimeout(this.timers.get(id))
    this.timers.delete(id)
    this.notify()
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notify(): void {
    this.listeners.forEach(fn => fn())
  }
}

export const toastStore = new ToastStore()
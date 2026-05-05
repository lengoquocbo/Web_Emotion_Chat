import { createContext, useEffect, useState, ReactNode } from 'react'
import { getMeService, LogoutService } from '../services/authService'
import { stopPresenceConnection } from '../hooks/chat/usePresence'
import { AuthUser } from '../types/auth'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: AuthUser) => void
  logout: () => Promise<void>
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]       = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isAuthenticated = user !== null

  // Bootstrap — kiểm tra session hiện tại khi app khởi động
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const res = await getMeService()
        setUser(res)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    bootstrapAuth()
  }, [])

  const login = (nextUser: AuthUser) => {
    setUser(nextUser)
  }

  const logout = async () => {
    // Bước 1: Dừng SignalR presence TRƯỚC khi xoá cookie.
    //         Server nhận OnDisconnectedAsync → xoá Redis key → broadcast UserOffline.
    //         Nếu làm sau khi xoá cookie thì request SignalR sẽ bị 401.
    await stopPresenceConnection()

    // Bước 2: Gọi API logout → server xoá cookie "token"
    try {
      await LogoutService()
    } catch {
      // Bỏ qua lỗi — cookie sẽ tự hết hạn
    }

    // Bước 3: Clear React state → ProtectedRoute redirect về /login
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
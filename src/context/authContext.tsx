import { createContext, ReactNode, useEffect, useState } from 'react'

import { stopPresenceConnection } from '../hooks/chat/usePresence'
import { AuthUser } from '../types/auth'
import { getMeService, LogoutService } from '../services/authService'

interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (user: AuthUser) => void
  updateUser: (user: Partial<AuthUser>) => void
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isAuthenticated = user !== null

  useEffect(() => {
    if (['/login', '/register'].includes(window.location.pathname)) {
      setIsLoading(false)
      return
    }

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

    void bootstrapAuth()
  }, [])

  const login = (nextUser: AuthUser) => {
    setUser(nextUser)
  }

  const updateUser = (nextUser: Partial<AuthUser>) => {
    setUser((current) => (current ? { ...current, ...nextUser } : current))
  }

  const logout = async () => {
    await stopPresenceConnection()

    try {
      await LogoutService()
    } catch {
      // Ignore logout failure and clear local auth state anyway.
    }

    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

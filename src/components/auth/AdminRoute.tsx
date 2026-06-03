import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/hooks/auth/useAuth'

export default function AdminRoute() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (user?.role !== 'Admin') {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}

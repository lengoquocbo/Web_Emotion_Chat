import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '../../hooks/auth/useAuth'

const ProtectedRoute = () => {
  // const { token } = useAuth()

 

  // if (!token) {
  //   return <Navigate to="/login" replace={true} />
  // }

  return <Outlet />
}

export default ProtectedRoute

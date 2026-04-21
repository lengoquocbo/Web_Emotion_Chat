import { Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  // const { token } = useAuth()

 

  // if (!token) {
  //   return <Navigate to="/login" replace={true} />
  // }

  return <Outlet />
}

export default ProtectedRoute

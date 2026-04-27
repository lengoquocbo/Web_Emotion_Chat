import axios, { AxiosError } from 'axios'

const axiosClient = axios.create({
  baseURL: '/',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status
      const isLoginPage = window.location.pathname === '/login'
      const isAuthMe = error.config?.url?.includes('/api/Auth/me')

      if (status === 401 && !isLoginPage && !isAuthMe) {
        window.location.href = '/login'
      }
    } else {
      console.error('Network error:', error.message)
    }

    return Promise.reject(error)
  },
)

export default axiosClient

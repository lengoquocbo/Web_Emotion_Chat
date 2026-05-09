import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

type RetriableAxiosRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

const axiosClient = axios.create({
  baseURL: '/',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const refreshClient = axios.create({
  baseURL: '/',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let refreshPromise: Promise<void> | null = null

function isLoginPage() {
  return window.location.pathname === '/login'
}

function isPublicAuthPage() {
  return ['/login', '/register'].includes(window.location.pathname)
}

function isRefreshableRequest(url?: string) {
  if (!url) return false

  return ![
    '/api/Auth/login',
    '/api/Auth/register',
    '/api/Auth/logout',
    '/api/Auth/refresh-token',
  ].some((path) => url.includes(path))
}

function shouldSkipRefresh(url?: string) {
  if (!url) {
    return true
  }

  if (isPublicAuthPage() && url.includes('/api/Auth/me')) {
    return true
  }

  return !isRefreshableRequest(url)
}

async function refreshToken() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/api/Auth/refresh-token', {})
      .then(() => undefined)
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    if (!error.response) {
      console.error('Network error:', error.message)
      return Promise.reject(error)
    }

    const status = error.response.status
    const originalRequest = error.config as RetriableAxiosRequestConfig | undefined

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !shouldSkipRefresh(originalRequest.url)
    ) {
      originalRequest._retry = true

      try {
        await refreshToken()
        return axiosClient(originalRequest)
      } catch (refreshError) {
        if (!isLoginPage()) {
          window.location.href = '/login'
        }

        return Promise.reject(refreshError)
      }
    }

    if (status === 401 && !isLoginPage()) {
      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)

export default axiosClient

import { useEffect, useState } from 'react'

import axiosClient from '@/services/axiosClient'

export default function ServerStatusPage() {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking')
  const [message, setMessage] = useState('Dang kiem tra ket noi...')
  const [apiUrl] = useState(import.meta.env.VITE_API_URL)

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await axiosClient.get('/')
        setStatus('success')
        setMessage('Ket noi server thanh cong!')
        console.log('Server response:', response)
      } catch (error: any) {
        setStatus('error')
        const errorMsg = error?.response?.statusText || error?.message || 'Khong the ket noi den server'
        setMessage(`Loi ket noi: ${errorMsg}`)
        console.error('Server connection error:', error)
      }
    }

    const timer = setTimeout(checkServer, 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            {status === 'checking' && (
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
                <div className="flex h-24 w-24 items-center justify-center">
                  <span className="text-4xl">...</span>
                </div>
              </div>
            )}
            {status === 'success' && (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <span className="text-5xl">OK</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                <span className="text-5xl">!</span>
              </div>
            )}
          </div>

          <h1 className="mb-4 text-3xl font-bold text-slate-800">
            {status === 'checking' && 'Kiem Tra Ket Noi'}
            {status === 'success' && 'Ket Noi Thanh Cong'}
            {status === 'error' && 'Loi Ket Noi'}
          </h1>

          <p className="mb-8 text-lg text-slate-600">{message}</p>

          <div className="mb-8 rounded-2xl bg-slate-100 p-4 text-left">
            <p className="mb-2 text-sm font-semibold text-slate-600">API URL:</p>
            <p className="break-all rounded bg-white p-3 font-mono text-sm text-slate-700">
              {apiUrl || 'Khong duoc dinh nghia (VITE_API_URL)'}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
              Kiem tra lai
            </button>

            {status === 'success' && (
              <button
                onClick={() => {
                  window.location.href = '/'
                }}
                className="w-full rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                Quay ve trang chu
              </button>
            )}

            {status === 'error' && (
              <div className="mt-6 rounded-2xl bg-red-50 p-4 text-left">
                <p className="mb-2 text-sm font-semibold text-red-700">Huong Dan Khac Phuc:</p>
                <ul className="list-inside list-disc space-y-2 text-sm text-red-600">
                  <li>Kiem tra backend server co dang chay khong</li>
                  <li>Backend phai chay tai: {apiUrl}</li>
                  <li>Kiem tra file .env xac dinh VITE_API_URL dung</li>
                  <li>Neu dung HTTPS, hay xac nhan SSL certificate hop le</li>
                  <li>Kiem tra cau hinh CORS tren backend</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

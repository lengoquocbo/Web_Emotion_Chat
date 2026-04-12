import { useEffect, useState } from 'react';
import axiosClient from '@/services/axiosClient';

export default function ServerStatusPage() {
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');
  const [message, setMessage] = useState('Đang kiểm tra kết nối...');
  const [apiUrl, setApiUrl] = useState(import.meta.env.VITE_API_URL);

  useEffect(() => {
    const checkServer = async () => {
      try {
        // Thử gọi endpoint health check hoặc root endpoint
        const response = await axiosClient.get('/');
        setStatus('success');
        setMessage('✅ Kết nối server thành công!');
        console.log('Server response:', response);
      } catch (error: any) {
        setStatus('error');
        const errorMsg = error?.response?.statusText || error?.message || 'Không thể kết nối đến server';
        setMessage(`❌ Lỗi kết nối: ${errorMsg}`);
        console.error('Server connection error:', error);
      }
    };

    // Delay 1 giây để user nhìn thấy "Đang kiểm tra"
    const timer = setTimeout(checkServer, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center">
          {/* Status Icon */}
          <div className="mb-6 flex justify-center">
            {status === 'checking' && (
              <div className="relative h-24 w-24">
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500"></div>
                <div className="flex items-center justify-center h-24 w-24">
                  <span className="text-4xl">🔄</span>
                </div>
              </div>
            )}
            {status === 'success' && (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                <span className="text-5xl">✨</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
                <span className="text-5xl">⚠️</span>
              </div>
            )}
          </div>

          {/* Message */}
          <h1 className="mb-4 text-3xl font-bold text-slate-800">
            {status === 'checking' && 'Kiểm Tra Kết Nối'}
            {status === 'success' && 'Kết Nối Thành Công!'}
            {status === 'error' && 'Lỗi Kết Nối'}
          </h1>

          <p className="mb-8 text-lg text-slate-600">
            {message}
          </p>

          {/* API URL Info */}
          <div className="mb-8 rounded-2xl bg-slate-100 p-4 text-left">
            <p className="text-sm font-semibold text-slate-600 mb-2">API URL:</p>
            <p className="font-mono text-sm break-all text-slate-700 bg-white p-3 rounded">
              {apiUrl || 'Không được định nghĩa (VITE_API_URL)'}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
            >
              🔄 Kiểm Tra Lại
            </button>

            {status === 'success' && (
              <button
                onClick={() => window.location.href = '/'}
                className="w-full rounded-full bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
              >
                📨 Quay Về Trang Chủ
              </button>
            )}

            {status === 'error' && (
              <div className="mt-6 rounded-2xl bg-red-50 p-4 text-left">
                <p className="text-sm font-semibold text-red-700 mb-2">Hướng Dẫn Khắc Phục:</p>
                <ul className="text-sm text-red-600 space-y-2 list-disc list-inside">
                  <li>Kiểm tra backend server có chạy không</li>
                  <li>Backend phải chạy tại: {apiUrl}</li>
                  <li>Kiểm tra file `.env` xác định VITE_API_URL đúng</li>
                  <li>Nếu HTTPS, cần SSL certificate hợp lệ</li>
                  <li>Kiểm tra CORS settings trên backend</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

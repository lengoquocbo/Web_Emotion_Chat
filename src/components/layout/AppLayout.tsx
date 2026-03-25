// src/components/layout/AppLayout.tsx
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const AppLayout = () => (
  <div className="flex h-screen">
    <Sidebar />
    <main className="flex-1 overflow-y-auto p-6">
      <Outlet />   {/* nội dung từng trang render ở đây */}
    </main>
  </div>
)

export default AppLayout
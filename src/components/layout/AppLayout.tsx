import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

const AppLayout = () => (
  <div
    className="
      mx-auto
      flex
      h-screen
      max-w-[auto]
      flex-col
      gap-4
      border
      border-white/10
      bg-[linear-gradient(180deg,#f8fbff_0%,#f7f9fc_100%)]
      overflow-hidden
      p-0
      shadow-[0_30px_80px_rgba(15,23,42,0.35)]
      lg:flex-row
      lg:p-0
    "
  >
    <Sidebar />
    <main className="min-w-0 flex-1 rounded-[2rem] bg-transparent p-2">
      <Outlet />
    </main>
  </div>
)

export default AppLayout

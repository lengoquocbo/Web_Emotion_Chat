// src/components/layout/Sidebar.tsx
import { NavLink } from 'react-router-dom'
import { Home, Bot, Users, BarChart2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navItems = [
  { label: 'Home',       path: '/',          icon: Home },
  { label: 'AI Support', path: '/ai',         icon: Bot },
  { label: 'Groups',     path: '/groups',     icon: Users },
  { label: 'Analytics',  path: '/analytics',  icon: BarChart2 },
  { label: 'Profile',    path: '/profile',    icon: User },
]

const Sidebar = () => (
  <aside className="w-56 h-screen border-r flex flex-col p-4 gap-1">

    {/* Logo */}
    <div className="mb-6 px-2">
      <h1 className="font-semibold text-lg">Sanctuary</h1>
      <p className="text-xs text-muted-foreground">Your Digital Sanctuary</p>
    </div>

    {/* Nav items */}
    {navItems.map(({ label, path, icon: Icon }) => (
      <NavLink key={path} to={path}>
        {({ isActive }) => (
          <Button
            variant={isActive ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-3"
          >
            <Icon size={16} />
            {label}
          </Button>
        )}
      </NavLink>
    ))}

    {/* Daily Check-in button — dưới cùng */}
    <div className="mt-auto">
      <Button className="w-full">Daily Check-in</Button>
    </div>

  </aside>
)

export default Sidebar
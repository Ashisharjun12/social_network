'use client'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/useAuthStore'
import toast from 'react-hot-toast'
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Settings,
  LogOut,
  BarChart2,
  MessageSquare,
  Flag,
  Shield,
  Bell,
  Hash,
  HelpCircle,
  Zap,
  BookOpen,
  Layers
} from 'lucide-react'

const menuItems = [
  { 
    label: 'Overview',
    items: [
      { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/admin' },
      { icon: <BarChart2 size={18} />, label: 'Analytics', path: '/admin/analytics' },
      { icon: <Layers size={18} />, label: 'Activity', path: '/admin/activity' },
    ]
  },
  {
    label: 'Management',
    items: [
      { icon: <Users size={18} />, label: 'Users', path: '/admin/users' },
      { icon: <UserPlus size={18} />, label: 'Groups', path: '/admin/groups' },
      { icon: <Hash size={18} />, label: 'Categories', path: '/admin/categories' },
      { icon: <MessageSquare size={18} />, label: 'Posts', path: '/admin/posts' },
    ]
  },
  {
    label: 'Moderation',
    items: [
      { icon: <Flag size={18} />, label: 'Reports', path: '/admin/reports' },
      { icon: <Shield size={18} />, label: 'Banned Users', path: '/admin/banned' },
      { icon: <Bell size={18} />, label: 'Notifications', path: '/admin/notifications' },
    ]
  },
  {
    label: 'System',
    items: [
      { icon: <Settings size={18} />, label: 'Settings', path: '/admin/settings' },
      { icon: <HelpCircle size={18} />, label: 'Help Center', path: '/admin/help' },
      { icon: <BookOpen size={18} />, label: 'Documentation', path: '/admin/docs' },
    ]
  }
]

export default function AdminSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const logout = useAuthStore(state => state.logout)

  const handleLogout = async () => {
    try {
      toast.loading('Signing out...')
      logout()
      toast.dismiss()
      toast.success('Signed out successfully')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error signing out. Please try again.')
    }
  }

  return (
    <div className="w-64 bg-surface min-h-screen p-4 border-r border-white/10 flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 mb-6">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Zap size={20} className="text-primary" />
        </div>
        <div>
          <div className="font-bold">Admin Panel</div>
          <div className="text-xs text-gray-400">Manage everything</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide">
        {menuItems.map((section, index) => (
          <div key={section.label}>
            <div className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              {section.label}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => (
                <motion.button
                  key={item.path}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                    pathname === item.path
                      ? 'bg-primary/20 text-primary'
                      : 'text-gray-400 hover:bg-primary/10 hover:text-white'
                  }`}
                >
                  <span className={pathname === item.path ? 'text-primary' : 'text-gray-400'}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* User Profile & Logout */}
      <div className="pt-4 border-t border-white/10 space-y-4">
        {/* Admin Profile */}
        <div className="px-4 py-3 rounded-xl bg-surface/50 border border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield size={20} className="text-primary" />
            </div>
            <div>
              <div className="text-sm font-medium">Admin User</div>
              <div className="text-xs text-gray-400">Super Admin</div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </motion.button>
      </div>
    </div>
  )
} 
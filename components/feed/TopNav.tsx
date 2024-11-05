'use client'
import { useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { 
  User, 
  Settings, 
  BookMarked, 
  Bell, 
  LogOut,
  ChevronRight,
  Shield,
  HelpCircle
} from 'lucide-react'

export default function TopNav() {
  const { user, logout } = useAuthStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setShowUserMenu(false)
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

  const getAvatarDisplay = () => {
    if (!user?.avatarUrl) {
      return (
        <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
          <User size={20} className="text-primary" />
        </div>
      );
    }

    return (
      <div className="w-9 h-9 rounded-full overflow-hidden">
        <Image
          src={user.avatarUrl}
          alt={`${user.username}'s avatar`}
          width={36}
          height={36}
          className="object-cover w-full h-full"
          priority
          unoptimized
        />
      </div>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            href="/feed" 
            className="flex items-center gap-2 text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <span className="text-3xl">🎭</span>
            <span>AnonSocial</span>
          </Link>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  Welcome back,{' '}
                  <span className="text-white font-medium">
                    {user?.username}
                  </span>
                </span>
                <div className="relative">
                  {getAvatarDisplay()}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-surface"></div>
                </div>
              </div>
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 bg-surface rounded-xl shadow-lg border border-white/10 overflow-hidden"
                >
                  {/* User Info */}
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      {getAvatarDisplay()}
                      <div>
                        <div className="font-medium">{user?.username}</div>
                        <div className="text-xs text-gray-400">Anonymous User</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items - Now in a scrollable container */}
                  <div className="max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
                    <div className="p-2">
                      <MenuItem 
                        href="/profile" 
                        icon={<User size={16} />}
                        text="Profile" 
                        subText="View and edit your profile"
                      />
                      <MenuItem 
                        href="/settings" 
                        icon={<Settings size={16} />}
                        text="Settings" 
                        subText="Manage your preferences"
                      />
                      <MenuItem 
                        href="/saved" 
                        icon={<BookMarked size={16} />}
                        text="Saved Posts" 
                        subText="Your bookmarked content"
                      />
                      <MenuItem 
                        href="/notifications" 
                        icon={<Bell size={16} />}
                        text="Notifications" 
                        subText="Check your activity"
                      />
                      
                      {/* Divider */}
                      <div className="h-px bg-white/10 my-2"></div>
                      
                      <MenuItem 
                        href="/privacy" 
                        icon={<Shield size={16} />}
                        text="Privacy" 
                        subText="Manage your privacy settings"
                      />
                      <MenuItem 
                        href="/help" 
                        icon={<HelpCircle size={16} />}
                        text="Help & Support" 
                        subText="Get assistance"
                      />
                      
                      {/* Sign Out Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3 text-red-400 hover:text-red-300"
                      >
                        <LogOut size={16} />
                        <div>
                          <div className="font-medium">Sign Out</div>
                          <div className="text-xs text-gray-400">End your session</div>
                        </div>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  )
}

function MenuItem({ href, icon, text, subText }: { 
  href: string; 
  icon: React.ReactNode;
  text: string;
  subText: string;
}) {
  return (
    <Link
      href={href}
      className="block px-4 py-3 hover:bg-white/5 transition-colors flex items-center gap-3 group"
    >
      <span className="text-gray-400 group-hover:text-primary transition-colors">
        {icon}
      </span>
      <div className="flex-1">
        <div className="font-medium">{text}</div>
        <div className="text-xs text-gray-400">{subText}</div>
      </div>
      <ChevronRight size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
    </Link>
  )
} 
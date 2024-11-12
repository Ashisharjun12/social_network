'use client'
import { useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import UserSuggestions from './UserSuggestions'
import { Home, Search, PlusCircle, Users, MessageSquare, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import CreatePostModal from './CreatePostModal'

interface NavProps {
  onNavigate: (path: string) => void;
}

export function LeftSidebar({ onNavigate }: NavProps) {
  const pathname = usePathname()
  const { user } = useAuthStore()
  const [showCreatePostModal, setShowCreatePostModal] = useState(false)

  const menuItems = [
    { 
      icon: <Home size={22} />, 
      label: 'Home', 
      href: '/feed' 
    },
    { 
      icon: <Search size={22} />, 
      label: 'Search', 
      href: '/search' 
    },
    { 
      icon: <PlusCircle size={22} />, 
      label: 'Create Post', 
      href: '/create' 
    },
    { 
      icon: <Users size={22} />, 
      label: 'Groups', 
      href: '/groups' 
    },
    { 
      icon: <MessageSquare size={22} />, 
      label: 'Confession', 
      href: '/confessions' 
    },
    { 
      icon: <Settings size={22} />, 
      label: 'Settings', 
      href: '/settings' 
    }
  ]

  return (
    <div className="p-4 h-full">
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.href}
            onClick={() => {
              if (item.href === '/create') {
                setShowCreatePostModal(true)
              } else {
                onNavigate(item.href)
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative group
              ${pathname === item.href 
                ? 'text-primary bg-primary/5 font-medium shadow-sm' 
                : 'text-gray-400 hover:bg-white/5'
              }`}
          >
            {/* Active Route Indicator */}
            {pathname === item.href && (
              <div className="absolute inset-0 bg-primary/5 rounded-lg blur-sm -z-10" />
            )}

            {/* Icon with glow effect on active */}
            <div className={`${
              pathname === item.href 
                ? 'text-primary relative after:absolute after:inset-0 after:bg-primary/20 after:blur-xl after:-z-10' 
                : 'text-gray-400 group-hover:text-gray-300'
            }`}>
              {item.icon}
            </div>

            {/* Label */}
            <span className={`text-sm transition-colors ${
              pathname === item.href 
                ? 'text-primary' 
                : 'text-gray-400 group-hover:text-gray-300'
            }`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <CreatePostModal
        isOpen={showCreatePostModal}
        onClose={() => setShowCreatePostModal(false)}
        onPostCreated={() => {
          setShowCreatePostModal(false)
          onNavigate('/feed')
        }}
      />
    </div>
  )
}

export function RightSidebar() {
  const { user } = useAuthStore()

  if (!user) return null;

  return (
    <div className="p-4 h-full">
      <UserSuggestions />
    </div>
  );
}

export function BottomNav({ onNavigate }: NavProps) {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const navItems = [
    { icon: <Home size={28} />, href: '/feed' },
    { icon: <Search size={28} />, href: '/search' },
    { icon: <PlusCircle size={28} />, href: '/create' },
    { icon: <MessageSquare size={28} />, href: '/confessions' },
    {
      icon: user?.avatarUrl ? (
        <Image
          src={user.avatarUrl}
          alt={user.username}
          width={28}
          height={28}
          className="rounded-full"
          unoptimized
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gray-600" />
      ),
      href: `/profile/${user?.username}`
    }
  ]

  return (
    <div className="flex justify-around items-center py-4 px-6">
      {navItems.map((item) => (
        <button
          key={item.href}
          onClick={() => onNavigate(item.href)}
          className={`p-3 rounded-xl ${
            pathname === item.href ? 'text-primary bg-primary/5' : 'text-gray-400'
          }`}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
} 
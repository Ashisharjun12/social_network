'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { 
  Home,
  Compass,
  TrendingUp,
  Users,
  Bookmark,
  MessageCircle,
  Bell,
  Settings,
  HelpCircle,
  Hash,
  Zap,
  Crown,
  Star,
  Coffee,
  Sparkles,
  UserPlus,
  Activity,
  Award
} from 'lucide-react'

interface Category {
  _id: string;
  name: string;
  icon: string;
  description: string;
}

export function LeftSidebar({ onCategorySelect }: { onCategorySelect: (categoryId: string | null) => void }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories')
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      toast.error('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    const newSelected = selectedCategory === categoryId ? null : categoryId
    setSelectedCategory(newSelected)
    onCategorySelect(newSelected)
  }

  const mainNavItems = [
    { icon: <Home size={18} />, label: 'Home Feed', action: () => handleCategoryClick('all') },
    { icon: <Compass size={18} />, label: 'Explore', action: () => {} },
    { icon: <TrendingUp size={18} />, label: 'Trending', action: () => {} },
    { icon: <Users size={18} />, label: 'Study Groups', action: () => {} },
    { icon: <Bookmark size={18} />, label: 'Saved Posts', action: () => {} },
  ]

  return (
    <div className="hidden md:block col-span-12 md:col-span-3">
      <div className="sticky top-24 space-y-6">
        {/* Main Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-4"
        >
          <div className="space-y-2">
            {mainNavItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={item.action}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-white transition-all group"
              >
                <span className="text-primary group-hover:text-white transition-colors">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold mb-4 px-4 flex items-center gap-2">
            <Hash size={18} className="text-primary" />
            Categories
          </h3>
          <div className="space-y-1">
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-10 bg-dark/50 rounded-lg animate-pulse" />
              ))
            ) : (
              categories.map(category => (
                <motion.button
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                    selectedCategory === category._id 
                      ? 'bg-primary/20 text-primary' 
                      : 'text-gray-400 hover:bg-primary/10 hover:text-white'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </motion.button>
              ))
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-4"
        >
          <div className="space-y-2">
            <QuickAction 
              icon={<HelpCircle size={18} />}
              label="Help & Support"
            />
            <QuickAction 
              icon={<Settings size={18} />}
              label="Settings"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export function RightSidebar() {
  return (
    <div className="hidden lg:block col-span-12 lg:col-span-3">
      <div className="sticky top-24 space-y-6">
        {/* Trending Topics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold mb-4 px-4 flex items-center gap-2">
            <Zap size={18} className="text-primary" />
            Trending Now
          </h3>
          <div className="space-y-4">
            <TrendingTopic 
              icon={<Crown size={16} />}
              topic="Finals Week Tips"
              posts={234}
              isHot
            />
            <TrendingTopic 
              icon={<Star size={16} />}
              topic="Campus Life"
              posts={189}
            />
            <TrendingTopic 
              icon={<Coffee size={16} />}
              topic="Study Spots"
              posts={156}
            />
          </div>
        </motion.div>

        {/* Active Users */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold mb-4 px-4 flex items-center gap-2">
            <Activity size={18} className="text-primary" />
            Active Now
          </h3>
          <div className="space-y-3">
            <ActiveUser 
              username="StudyGuru_42"
              status="Sharing study tips"
              isVerified
            />
            <ActiveUser 
              username="CoffeeQueen"
              status="Writing a post"
            />
            <ActiveUser 
              username="LibraryOwl"
              status="Browsing"
              isTopContributor
            />
          </div>
        </motion.div>

        {/* Suggested Groups */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl p-4"
        >
          <h3 className="text-lg font-semibold mb-4 px-4 flex items-center gap-2">
            <UserPlus size={18} className="text-primary" />
            Suggested Groups
          </h3>
          <div className="space-y-3">
            <SuggestedGroup 
              name="CS Study Squad"
              members={234}
              icon="💻"
            />
            <SuggestedGroup 
              name="Campus Foodies"
              members={189}
              icon="🍕"
            />
            <SuggestedGroup 
              name="Night Owls"
              members={156}
              icon="🌙"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function QuickAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-gray-400 hover:text-white transition-all group"
    >
      <span className="text-primary group-hover:text-white transition-colors">
        {icon}
      </span>
      <span>{label}</span>
    </motion.button>
  )
}

function TrendingTopic({ icon, topic, posts, isHot = false }: {
  icon: React.ReactNode;
  topic: string;
  posts: number;
  isHot?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="px-4 py-3 rounded-lg hover:bg-primary/10 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-primary group-hover:text-white transition-colors">
            {icon}
          </span>
          <span className="text-gray-200 group-hover:text-white transition-colors">
            {topic}
          </span>
        </div>
        {isHot && (
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">
            Hot 🔥
          </span>
        )}
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {posts} posts
      </div>
    </motion.div>
  )
}

function ActiveUser({ username, status, isVerified = false, isTopContributor = false }: {
  username: string;
  status: string;
  isVerified?: boolean;
  isTopContributor?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="px-4 py-3 rounded-lg hover:bg-primary/10 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
            👤
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-surface"></div>
        </div>
        <div>
          <div className="flex items-center gap-1">
            <span className="text-gray-200 group-hover:text-white transition-colors">
              {username}
            </span>
            {isVerified && <Sparkles size={14} className="text-primary" />}
            {isTopContributor && <Award size={14} className="text-yellow-500" />}
          </div>
          <div className="text-xs text-gray-400">
            {status}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function SuggestedGroup({ name, members, icon }: {
  name: string;
  members: number;
  icon: string;
}) {
  return (
    <motion.div
      whileHover={{ x: 4 }}
      className="px-4 py-3 rounded-lg hover:bg-primary/10 transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-lg">
            {icon}
          </div>
          <div>
            <div className="text-gray-200 group-hover:text-white transition-colors">
              {name}
            </div>
            <div className="text-xs text-gray-400">
              {members} members
            </div>
          </div>
        </div>
        <button className="text-primary hover:text-white transition-colors">
          <UserPlus size={16} />
        </button>
      </div>
    </motion.div>
  )
} 
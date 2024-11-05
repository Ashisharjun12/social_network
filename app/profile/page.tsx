'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import Image from 'next/image'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

interface Post {
  _id: string;
  content: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

interface UserProfile {
  username: string;
  avatarUrl: string;
  avatarType: 'generated' | 'uploaded';
  personalInfo: {
    age: number;
    gender: string;
    personality: string;
    profession: string;
  };
  interests: string[];
  followersCount: number;
  followingCount: number;
  posts: Post[];
}

const defaultProfile: UserProfile = {
  username: '',
  avatarUrl: '',
  avatarType: 'generated',
  personalInfo: {
    age: 0,
    gender: '',
    personality: '',
    profession: ''
  },
  interests: [],
  followersCount: 0,
  followingCount: 0,
  posts: []
};

export default function ProfilePage() {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts')

  useEffect(() => {
    if (user?.username) {
      fetchProfile()
    }
  }, [user?.username])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/profile/${user?.username}`)
      const data = await response.json()
      if (response.ok) {
        setProfile(data)
      } else {
        throw new Error(data.error || 'Failed to fetch profile')
      }
    } catch (error) {
      console.error('Profile fetch error:', error)
      toast.error('Failed to fetch profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingProfile />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-surface rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <Image
                src={profile.avatarUrl}
                alt={profile.username}
                width={150}
                height={150}
                className="rounded-full border-4 border-white/10 group-hover:border-primary/50 transition-colors"
                unoptimized
              />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold mb-2">{profile.username}</h1>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-4">
              <div className="text-center">
                <div className="text-xl font-bold">{profile.posts?.length || 0}</div>
                <div className="text-sm text-gray-400">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{profile.followersCount}</div>
                <div className="text-sm text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold">{profile.followingCount}</div>
                <div className="text-sm text-gray-400">Following</div>
              </div>
            </div>

            {/* Personality Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                {profile.personalInfo.personality}
              </span>
              <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm">
                {profile.personalInfo.profession}
              </span>
            </div>

            {/* Interests */}
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-1 bg-surface rounded-full text-sm text-gray-400"
                >
                  #{interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <TabButton
          active={activeTab === 'posts'}
          onClick={() => setActiveTab('posts')}
          icon="📝"
          label="Posts"
        />
        <TabButton
          active={activeTab === 'about'}
          onClick={() => setActiveTab('about')}
          icon="👤"
          label="About"
        />
      </div>

      {/* Content */}
      {activeTab === 'posts' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-surface rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard
              title="Personal Info"
              items={[
                { label: 'Age', value: profile.personalInfo.age },
                { label: 'Gender', value: profile.personalInfo.gender },
                { label: 'Personality', value: profile.personalInfo.personality },
                { label: 'Profession', value: profile.personalInfo.profession }
              ]}
            />
            <InfoCard
              title="Interests"
              items={profile.interests.map(interest => ({
                label: interest,
                value: '🏷️'
              }))}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-primary text-white'
          : 'bg-surface text-gray-400 hover:bg-primary/20'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer"
    >
      <p className="text-gray-200 mb-4 line-clamp-3">{post.content}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-4">
          <span>👍 {post.likesCount}</span>
          <span>💬 {post.commentsCount}</span>
        </div>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
    </motion.div>
  )
}

function InfoCard({ title, items }: {
  title: string;
  items: { label: string; value: string | number }[];
}) {
  return (
    <div className="bg-dark/50 rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-gray-400">{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LoadingProfile() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="bg-surface rounded-xl p-6 mb-6">
        <div className="flex items-center gap-6">
          <div className="w-36 h-36 bg-dark rounded-full"></div>
          <div className="flex-1">
            <div className="h-8 bg-dark rounded w-48 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-dark rounded w-24"></div>
              <div className="h-4 bg-dark rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
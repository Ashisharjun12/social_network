'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/stores/useAuthStore'
import { formatDistanceToNow } from 'date-fns'
import { 
  ArrowLeft,
  Users,
  UserPlus,
  UserMinus,
  MessageCircle,
  Heart,
  Share,
  Bookmark,
  Grid,
  Info,
  Calendar,
  Briefcase,
  Brain,
  Hash,
  Award,
  MapPin,
  Mail,
  Shield
} from 'lucide-react'
import VerifiedBadge from '@/components/common/VerifiedBadge'

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
  isVerified: boolean;
  verifiedAt?: string;
  verifiedBy?: string;
  followersCount: number;
  followingCount: number;
  posts: any[];
  createdAt: string;
}

interface UserProfileProps {
  username: string;
  onBack: () => void;
  isOwnProfile: boolean;
}

export default function UserProfile({ username, onBack, isOwnProfile }: UserProfileProps) {
  const { user } = useAuthStore()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts')
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [username])

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/users/profile/${username}`)
      const data = await response.json()
      if (response.ok) {
        setProfile(data)
      } else {
        throw new Error(data.error || 'Failed to fetch profile')
      }
    } catch (error) {
      toast.error('Failed to fetch profile')
      console.error('Profile fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFollow = async () => {
    try {
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerUsername: user?.username,
          targetUsername: username
        })
      });

      if (response.ok) {
        setIsFollowing(!isFollowing);
        toast.success(isFollowing ? `Unfollowed @${username}` : `Following @${username}`);
        fetchProfile(); // Refresh profile to update counts
      } else {
        throw new Error('Failed to update follow status');
      }
    } catch (error) {
      toast.error('Failed to update follow status');
    }
  };

  if (loading) return <LoadingProfile />;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <motion.button
        onClick={onBack}
        whileHover={{ x: -4 }}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to Feed</span>
      </motion.button>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface rounded-xl overflow-hidden"
      >
        {/* Cover Image/Banner */}
        <div className="h-32 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />

        {/* Profile Info */}
        <div className="p-6 -mt-12">
          {/* Avatar */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full blur-lg opacity-50"></div>
            <Image
              src={profile.avatarUrl}
              alt={profile.username}
              width={100}
              height={100}
              className="relative rounded-full border-4 border-surface"
              unoptimized
            />
            {/* Online Status */}
            <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-surface"></div>
          </div>

          {/* User Info */}
          <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {profile.username}
                {profile.isVerified && <VerifiedBadge size="lg" />}
              </h1>
              <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  Anonymous User
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {profile.createdAt ? 
                    `Joined ${formatDistanceToNow(new Date(profile.createdAt))} ago` : 
                    'New User'
                  }
                </span>
              </div>
            </div>

            {/* Follow Button */}
            {!isOwnProfile && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFollow}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  isFollowing
                    ? 'bg-surface text-gray-400 hover:bg-red-500/10 hover:text-red-400'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus size={18} />
                    Unfollow
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Follow
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-dark/50 rounded-xl">
            <StatItem
              icon={<Grid size={18} />}
              label="Posts"
              value={profile.posts?.length || 0}
            />
            <StatItem
              icon={<Users size={18} />}
              label="Followers"
              value={profile.followersCount || 0}
            />
            <StatItem
              icon={<UserPlus size={18} />}
              label="Following"
              value={profile.followingCount || 0}
            />
          </div>

          {/* Personality & Interests */}
          <div className="mt-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              <PersonalityTag
                icon={<Brain size={14} />}
                text={profile.personalInfo.personality}
              />
              <PersonalityTag
                icon={<Briefcase size={14} />}
                text={profile.personalInfo.profession}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest: string) => (
                <InterestTag key={interest} text={interest} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/10">
        <TabButton
          active={activeTab === 'posts'}
          onClick={() => setActiveTab('posts')}
          icon={<Grid size={18} />}
          label="Posts"
        />
        <TabButton
          active={activeTab === 'about'}
          onClick={() => setActiveTab('about')}
          icon={<Info size={18} />}
          label="About"
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'posts' ? (
          <motion.div
            key="posts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-6"
          >
            {profile.posts.map((post: any) => (
              <PostCard key={post._id} post={post} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <InfoCard
              title="Personal Info"
              items={[
                { icon: <Calendar size={16} />, label: 'Age', value: profile.personalInfo.age },
                { icon: <Brain size={16} />, label: 'Personality', value: profile.personalInfo.personality },
                { icon: <Briefcase size={16} />, label: 'Profession', value: profile.personalInfo.profession }
              ]}
            />
            <InfoCard
              title="Interests"
              items={profile.interests.map((interest: string) => ({
                icon: <Hash size={16} />,
                label: interest,
                value: '🏷️'
              }))}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper Components
function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="text-center p-2">
      <div className="flex items-center justify-center gap-2 text-primary mb-1">
        {icon}
        <span className="font-medium">{value}</span>
      </div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  );
}

function PersonalityTag({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2">
      {icon}
      <span>{text}</span>
    </span>
  );
}

function InterestTag({ text }: { text: string }) {
  return (
    <span className="px-3 py-1 bg-surface rounded-full text-sm text-gray-400 flex items-center gap-1">
      <Hash size={14} />
      {text}
    </span>
  );
}

function TabButton({ active, onClick, icon, label }: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
        active
          ? 'border-primary text-primary'
          : 'border-transparent text-gray-400 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function InfoCard({ title, items }: {
  title: string;
  items: { icon: React.ReactNode; label: string; value: string | number }[];
}) {
  return (
    <div className="bg-surface rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Info size={18} className="text-primary" />
        {title}
      </h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-400">
              {item.icon}
              <span>{item.label}</span>
            </div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-xl p-6 hover:scale-[1.02] transition-transform"
    >
      <p className="text-gray-200 mb-4">{post.content}</p>
      
      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Actions */}
      <div className="flex items-center gap-6 text-gray-400">
        <button className="flex items-center gap-2 hover:text-red-400 transition-colors">
          <Heart size={18} />
          <span>{post.likesCount || 0}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <MessageCircle size={18} />
          <span>{post.commentsCount || 0}</span>
        </button>
        <button className="flex items-center gap-2 hover:text-primary transition-colors">
          <Share size={18} />
        </button>
        <button className="flex items-center gap-2 hover:text-primary transition-colors ml-auto">
          <Bookmark size={18} />
        </button>
      </div>
    </motion.div>
  );
}

function LoadingProfile() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Back Button Skeleton */}
      <div className="h-8 w-24 bg-surface rounded-lg"></div>

      {/* Profile Header Skeleton */}
      <div className="bg-surface rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Avatar Skeleton */}
          <div className="w-[100px] h-[100px] rounded-full bg-dark"></div>

          {/* Info Skeleton */}
          <div className="flex-1 space-y-4">
            <div className="h-8 w-48 bg-dark rounded-lg"></div>
            <div className="h-4 w-32 bg-dark rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 bg-surface rounded-xl"></div>
        ))}
      </div>
    </div>
  );
}
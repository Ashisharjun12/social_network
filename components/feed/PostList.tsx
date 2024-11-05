'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import toast from 'react-hot-toast'
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Flag, 
  UserPlus, 
  UserMinus,
  MessageCircle,
  Heart,
  Share,
  Bookmark,
  AlertCircle
} from 'lucide-react'
import VerifiedBadge from '@/components/common/VerifiedBadge';

interface Post {
  _id: string;
  authorId: string;
  username: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  userAvatarUrl?: string;
  userAvatarType?: 'generated' | 'uploaded';
  isVerified?: boolean;
}

interface PostListProps {
  posts: Post[];
  loading: boolean;
  onPostDeleted: (postId: string) => void;
  onPostUpdated: (post: Post) => void;
  onAvatarClick: (username: string) => void;
}

export function PostList({ 
  posts = [],
  loading, 
  onPostDeleted, 
  onPostUpdated, 
  onAvatarClick 
}: PostListProps) {
  if (loading) {
    return <LoadingPosts />
  }

  const postsArray = Array.isArray(posts) ? posts : [];

  return (
    <div className="space-y-6">
      {postsArray.length === 0 ? (
        <div className="text-center py-12 bg-surface rounded-xl">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-medium mb-2">No Posts Yet</h3>
          <p className="text-gray-400">Be the first one to post something!</p>
        </div>
      ) : (
        postsArray.map((post: Post) => (
          <PostCard 
            key={post._id} 
            post={post} 
            onPostDeleted={onPostDeleted}
            onPostUpdated={onPostUpdated}
            onAvatarClick={onAvatarClick}
          />
        ))
      )}
    </div>
  )
}

interface PostCardProps {
  post: Post;
  onPostDeleted: (postId: string) => void;
  onPostUpdated: (post: Post) => void;
  onAvatarClick: (username: string) => void;
}

export function PostCard({ post, onPostDeleted, onPostUpdated, onAvatarClick }: PostCardProps) {
  const { user } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(post.content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const isAuthor = user?.username === post.username

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowOptions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({ 
          username: user?.username 
        })
      });

      if (response.ok) {
        onPostDeleted(post._id);
        setShowOptions(false);
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleUpdate = async () => {
    if (editedContent === post.content) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content: editedContent,
          username: user?.username 
        })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        onPostUpdated(updatedPost);
        setIsEditing(false);
      } else {
        throw new Error('Failed to update post');
      }
    } catch (error) {
      toast.error('Failed to update post');
      console.error('Update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`/api/users/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: user?._id,
          followingId: post.authorId
        })
      });

      if (response.ok) {
        setIsFollowing(true);
        toast.success(`Following ${post.username}`);
      } else {
        throw new Error('Failed to follow user');
      }
    } catch (error) {
      toast.error('Failed to follow user');
      console.error('Follow error:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await fetch(`/api/users/unfollow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: user?._id,
          followingId: post.authorId
        })
      });

      if (response.ok) {
        setIsFollowing(false);
        toast.success(`Unfollowed ${post.username}`);
      } else {
        throw new Error('Failed to unfollow user');
      }
    } catch (error) {
      toast.error('Failed to unfollow user');
      console.error('Unfollow error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-surface rounded-xl p-4"
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onAvatarClick(post.username)}
        >
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden">
            {post.userAvatarUrl ? (
              <Image
                src={post.userAvatarUrl}
                alt={`${post.username}'s avatar`}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
            )}
          </div>
          
          {/* Username and Time */}
          <div>
            <div className="font-medium hover:text-primary transition-colors flex items-center gap-1">
              {post.username}
              {post.isVerified && <VerifiedBadge size="sm" />}
            </div>
            <div className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt))} ago
            </div>
          </div>
        </div>

        {/* Options Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <MoreHorizontal size={20} className="text-gray-400" />
          </button>

          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-64 bg-surface rounded-xl shadow-lg border border-white/10 overflow-hidden z-50"
                style={{ 
                  transformOrigin: 'top right',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
                }}
              >
                {isAuthor ? (
                  <>
                    <MenuItem
                      icon={<Edit size={18} />}
                      label="Edit Post"
                      onClick={() => {
                        setIsEditing(true);
                        setShowOptions(false);
                      }}
                    />
                    <MenuItem
                      icon={<Trash2 size={18} />}
                      label="Delete Post"
                      onClick={handleDelete}
                      variant="danger"
                    />
                  </>
                ) : (
                  <>
                    <MenuItem
                      icon={isFollowing ? <UserMinus size={18} /> : <UserPlus size={18} />}
                      label={isFollowing ? `Unfollow @${post.username}` : `Follow @${post.username}`}
                      onClick={() => {
                        isFollowing ? handleUnfollow() : handleFollow();
                        setShowOptions(false);
                      }}
                    />
                    <MenuItem
                      icon={<Bookmark size={18} />}
                      label="Save Post"
                      onClick={() => {
                        toast.success('Post saved');
                        setShowOptions(false);
                      }}
                    />
                    <MenuItem
                      icon={<Share size={18} />}
                      label="Share Post"
                      onClick={() => {
                        toast.success('Link copied to clipboard');
                        setShowOptions(false);
                      }}
                    />
                    <div className="h-px bg-white/10 my-1"></div>
                    <MenuItem
                      icon={<Flag size={18} />}
                      label="Report Post"
                      onClick={() => {
                        toast('Post reported', { icon: '🚨' });
                        setShowOptions(false);
                      }}
                      variant="danger"
                    />
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full px-4 py-3 bg-dark rounded-lg border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 min-h-[120px]"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⚡
                  </motion.div>
                  Saving...
                </div>
              ) : (
                <>
                  <Edit size={16} />
                  Save
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-200 mb-4 whitespace-pre-wrap">{post.content}</p>

          {/* Post Actions */}
          <div className="flex items-center gap-6 text-gray-400 mt-4">
            <button className="flex items-center gap-2 hover:text-red-400 transition-colors">
              <Heart size={20} />
              <span>{post.likesCount || 0}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <MessageCircle size={20} />
              <span>{post.commentsCount || 0}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-primary transition-colors">
              <Share size={20} />
            </button>
            <button className="flex items-center gap-2 hover:text-primary transition-colors ml-auto">
              <Bookmark size={20} />
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}

// Helper component for menu items
function MenuItem({ 
  icon, 
  label, 
  onClick, 
  variant = 'default' 
}: { 
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3
        ${variant === 'danger' ? 'text-red-400 hover:text-red-300' : 'text-gray-200 hover:text-white'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function LoadingPosts() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-surface rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-dark rounded-full"></div>
            <div className="space-y-2">
              <div className="w-32 h-4 bg-dark rounded"></div>
              <div className="w-24 h-3 bg-dark rounded"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-dark rounded"></div>
            <div className="w-3/4 h-4 bg-dark rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
} 
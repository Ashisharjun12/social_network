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
  AlertCircle,
  PenLine,
  Users
} from 'lucide-react'
import VerifiedBadge from '@/components/common/VerifiedBadge';
import LikeButton from '@/components/social/LikeButton'
import CommentSection from '@/components/social/CommentSection';

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
  isLiked: boolean;
  poll?: {
    options: {
      text: string;
      votes: number;
      voters: string[];
    }[];
    totalVotes: number;
    endsAt: string;
  };
  media?: {
    type: 'image';
    url: string;
    cloudinaryPublicId?: string;
  };
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
        <div className="text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-center">
              <div className="p-6 bg-primary/5 rounded-full">
                <PenLine size={32} className="text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-medium">No Posts Yet</h3>
            <p className="text-gray-400 max-w-sm mx-auto">
              Be the first to share something with your college community!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Users size={16} />
              <span>Connect with your peers</span>
            </div>
          </motion.div>
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
  const [showMenu, setShowMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(post.content)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef = useRef<HTMLParagraphElement>(null)
  const [shouldShowMore, setShouldShowMore] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<Comment[]>([]);

  const isAuthor = user?.username === post.username

  // Check if content needs "Show more" button
  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseInt(window.getComputedStyle(contentRef.current).lineHeight);
      const maxHeight = lineHeight * 2; // 2 lines
      setShouldShowMore(contentRef.current.scrollHeight > maxHeight);
    }
  }, [post.content]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Check follow status on mount
  useEffect(() => {
    checkFollowStatus()
  }, [post.authorId])

  const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/users/follow-status?followerId=${user?._id}&followingId=${post.authorId}`)
      const data = await response.json()
      setIsFollowing(data.isFollowing)
    } catch (error) {
      console.error('Error checking follow status:', error)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${post._id}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data);
    } catch (error) {
      toast.error('Failed to load comments');
    }
  };

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
        setShowMenu(false);
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

  const handleComment = async (content: string) => {
    try {
      const response = await fetch(`/api/posts/${post._id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          username: user?.username
        })
      });

      if (!response.ok) throw new Error('Failed to post comment');
      
      // Refresh comments
      fetchComments();
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-3 border-b border-white/5 last:border-b-0"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => onAvatarClick(post.username)}
        >
          <Image
            src={post.userAvatarUrl || '/default-avatar.png'}
            alt={post.username}
            width={40}
            height={40}
            className="rounded-full"
            unoptimized
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-medium">{post.username}</span>
              {post.isVerified && (
                <VerifiedBadge size="sm" />
              )}
            </div>
            <div className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Post Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <MoreHorizontal size={20} className="text-gray-400" />
          </button>

          {/* Menu Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface border border-white/10 shadow-lg z-50">
              {isAuthor ? (
                <>
                  <MenuItem
                    icon={<Edit size={18} />}
                    label="Edit Post"
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
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
                      setShowMenu(false);
                    }}
                  />
                  <MenuItem
                    icon={<Bookmark size={18} />}
                    label="Save Post"
                    onClick={() => {
                      toast.success('Post saved');
                      setShowMenu(false);
                    }}
                  />
                  <MenuItem
                    icon={<Share size={18} />}
                    label="Share Post"
                    onClick={() => {
                      toast.success('Link copied to clipboard');
                      setShowMenu(false);
                    }}
                  />
                  <div className="h-px bg-white/10 my-1"></div>
                  <MenuItem
                    icon={<Flag size={18} />}
                    label="Report Post"
                    onClick={() => {
                      toast('Post reported', { icon: '🚨' });
                      setShowMenu(false);
                    }}
                    variant="danger"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full bg-surface/50 border border-white/10 rounded p-3 focus:outline-none focus:border-primary/50"
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <p 
              ref={contentRef}
              className={`text-gray-200 whitespace-pre-wrap ${
                !isExpanded ? 'line-clamp-2' : ''
              }`}
            >
              {post.content}
            </p>
            {shouldShowMore && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary text-sm hover:underline mt-1"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Media Content */}
          {post.media?.url && (
            <div className="relative mb-3 ">
              <div className="max-w-[300px] mx-auto rounded-lg overflow-hidden">
                <div className="relative aspect-square ">
                  <Image
                    src={post.media.url}
                    alt="Post image"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          )}

          {/* Poll Content */}
          {post.poll && post.poll.endsAt && (
            <div className="mb-3 space-y-2">
              {post.poll.options.map((option, index) => (
                <div
                  key={index}
                  className="relative bg-surface/50 rounded-lg overflow-hidden"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 bg-primary/10"
                    style={{
                      width: `${(option.votes / (post.poll?.totalVotes || 1)) * 100}%`
                    }}
                  />
                  <div className="relative px-4 py-2 flex justify-between">
                    <span>{option.text}</span>
                    <span className="text-gray-400">
                      {((option.votes / (post.poll?.totalVotes || 1)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
              <div className="text-sm text-gray-400">
                {post.poll.totalVotes} votes • 
                {post.poll.endsAt && formatDistanceToNow(new Date(post.poll.endsAt), { addSuffix: true })}
              </div>
            </div>
          )}

          {/* Post Actions */}
          <div className="flex items-center gap-6 text-gray-400">
            <LikeButton
              postId={post._id}
              initialLikesCount={post.likesCount}
              initialIsLiked={post.isLiked}
              onLikeChange={(newCount) => {
                if (onPostUpdated) {
                  onPostUpdated({
                    ...post,
                    likesCount: newCount
                  });
                }
              }}
            />
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
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

          {/* Comments Section */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 border-t border-white/10 pt-4"
              >
                <CommentSection 
                  postId={post._id}
                  initialCommentsCount={post.commentsCount || 0}
                  onCommentAdded={(newCount) => {
                    onPostUpdated({
                      ...post,
                      commentsCount: newCount
                    });
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </motion.div>
  );
}

// Helper component for menu items
interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

function MenuItem({ icon, label, onClick, variant = 'default' }: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors flex items-center gap-3
        ${variant === 'danger' ? 'text-red-400 hover:text-red-300' : 'text-gray-200 hover:text-white'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function LoadingPosts() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-4 border-b border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-surface/50 rounded-full" />
            <div>
              <div className="h-4 w-24 bg-surface/50 rounded mb-2" />
              <div className="h-3 w-16 bg-surface/50 rounded" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-3/4 bg-surface/50 rounded" />
            <div className="h-4 w-1/2 bg-surface/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
} 
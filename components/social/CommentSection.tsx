'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import Image from 'next/image'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'
import CommentCard from './CommentCard'

interface Comment {
  _id: string;
  username: string;
  content: string;
  userAvatarUrl?: string;
  isVerified?: boolean;
  likesCount: number;
  repliesCount: number;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  initialCommentsCount: number;
  onCommentAdded: (newCount: number) => void;
}

export default function CommentSection({ postId, initialCommentsCount, onCommentAdded }: CommentSectionProps) {
  const { user } = useAuthStore()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [postId])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${postId}/comments`)
      if (!response.ok) throw new Error('Failed to fetch comments')
      const data = await response.json()
      setComments(data)
    } catch (error) {
      setError('Failed to load comments')
      toast.error('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          username: user?.username
        })
      })

      if (!response.ok) throw new Error('Failed to post comment')

      setNewComment('')
      fetchComments()
      onCommentAdded(initialCommentsCount + 1)
      toast.success('Comment posted!')
    } catch (error) {
      toast.error('Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-pulse text-gray-400">Loading comments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center py-4">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Comment Input */}
      <div className="flex items-center gap-3">
        <Image
          src={user?.avatarUrl || '/default-avatar.png'}
          alt={user?.username || 'User'}
          width={32}
          height={32}
          className="rounded-full"
          unoptimized
        />
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
            className="w-full bg-surface/50 rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting || !newComment.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary disabled:opacity-50"
          >
            <Send size={16} className="rotate-90" />
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center text-gray-400 py-4">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              postId={postId}
              onReplyAdded={fetchComments}
            />
          ))
        )}
      </div>
    </div>
  )
} 
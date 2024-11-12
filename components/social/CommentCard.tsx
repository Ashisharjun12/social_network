'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'
import VerifiedBadge from '../common/VerifiedBadge'
import ReplyInput from './ReplyInput'
import toast from 'react-hot-toast'

interface Reply {
  _id: string;
  username: string;
  content: string;
  userAvatarUrl?: string;
  isVerified?: boolean;
  likesCount: number;
  createdAt: string;
}

interface CommentCardProps {
  comment: {
    _id: string;
    username: string;
    content: string;
    userAvatarUrl?: string;
    isVerified?: boolean;
    likesCount: number;
    repliesCount: number;
    createdAt: string;
  };
  postId: string;
  onReplyAdded: () => void;
}

export default function CommentCard({ comment, postId, onReplyAdded }: CommentCardProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReplies = async () => {
    if (!showReplies) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments/${comment._id}/replies`);
      if (!response.ok) throw new Error('Failed to fetch replies');
      const data = await response.json();
      setReplies(data);
    } catch (error) {
      toast.error('Failed to load replies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showReplies) {
      fetchReplies();
    }
  }, [showReplies]);

  return (
    <div className="space-y-3">
      {/* Main Comment */}
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Image
            src={comment.userAvatarUrl || '/default-avatar.png'}
            alt={comment.username}
            width={32}
            height={32}
            className="rounded-full ring-2 ring-white/10 hover:ring-primary/50 transition-all"
            unoptimized
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium hover:text-primary transition-colors cursor-pointer">
              {comment.username}
            </span>
            {comment.isVerified && <VerifiedBadge size="sm" />}
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="text-gray-200 mt-1 break-words">{comment.content}</p>
          
          {/* Comment Actions */}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`flex items-center gap-1 hover:text-red-400 transition-colors ${
                isLiked ? 'text-red-400' : ''
              }`}
            >
              <Heart size={16} className={isLiked ? 'fill-current' : ''} />
              <span>{comment.likesCount}</span>
            </button>
            <button 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="hover:text-primary transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
      </div>

      {/* Reply Input */}
      <AnimatePresence>
        {showReplyInput && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ReplyInput
              postId={postId}
              commentId={comment._id}
              onReplySubmitted={() => {
                setShowReplyInput(false);
                onReplyAdded();
                if (showReplies) {
                  fetchReplies();
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Show Replies Button */}
      {comment.repliesCount > 0 && (
        <button
          onClick={() => setShowReplies(!showReplies)}
          className="flex items-center gap-2 text-sm text-primary hover:underline ml-10 group"
        >
          <div className="w-5 h-px bg-primary/50 group-hover:bg-primary transition-colors" />
          {showReplies ? 'Hide' : 'Show'} {comment.repliesCount} {comment.repliesCount === 1 ? 'reply' : 'replies'}
        </button>
      )}

      {/* Replies List */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-10 space-y-3"
          >
            {loading ? (
              <div className="text-sm text-gray-400 animate-pulse">Loading replies...</div>
            ) : (
              replies.map((reply) => (
                <div key={reply._id} className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Image
                      src={reply.userAvatarUrl || '/default-avatar.png'}
                      alt={reply.username}
                      width={24}
                      height={24}
                      className="rounded-full ring-2 ring-white/10 hover:ring-primary/50 transition-all"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm hover:text-primary transition-colors cursor-pointer">
                        {reply.username}
                      </span>
                      {reply.isVerified && (
                        <VerifiedBadge size="xs" />
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-200 text-sm mt-1 break-words">{reply.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                      <button 
                        className="flex items-center gap-1 hover:text-red-400 transition-colors"
                      >
                        <Heart size={14} />
                        <span>{reply.likesCount}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 
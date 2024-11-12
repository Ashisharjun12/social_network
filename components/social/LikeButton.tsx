'use client'
import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '@/stores/useAuthStore'
import toast from 'react-hot-toast'

interface LikeButtonProps {
  postId: string;
  initialLikesCount: number;
  initialIsLiked: boolean;
  onLikeChange?: (newCount: number, isLiked: boolean) => void;
}

export default function LikeButton({ 
  postId, 
  initialLikesCount, 
  initialIsLiked,
  onLikeChange 
}: LikeButtonProps) {
  const { user } = useAuthStore()
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLoading, setIsLoading] = useState(false)

  // Load persisted like state on mount
  useEffect(() => {
    const persistedLike = localStorage.getItem(`post_${postId}_liked`)
    if (persistedLike !== null) {
      setIsLiked(JSON.parse(persistedLike))
    }
  }, [postId])

  const handleLike = async () => {
    if (!user?.username || isLoading) return;

    setIsLoading(true);
    const newIsLiked = !isLiked;
    const newCount = isLiked ? likesCount - 1 : likesCount + 1;

    // Optimistic update
    setIsLiked(newIsLiked);
    setLikesCount(newCount);

    try {
      const response = await fetch('/api/posts/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, username: user.username })
      });

      if (response.ok) {
        // Persist like state in localStorage
        localStorage.setItem(`post_${postId}_liked`, JSON.stringify(newIsLiked));
        localStorage.setItem(`post_${postId}_count`, String(newCount));
        onLikeChange?.(newCount, newIsLiked);
      } else {
        // Revert optimistic update on failure
        setIsLiked(!newIsLiked);
        setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
        toast.error('Failed to update like');
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setIsLiked(!newIsLiked);
      setLikesCount(isLiked ? likesCount + 1 : likesCount - 1);
      toast.error('Error updating like');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className="group flex items-center gap-1"
    >
      <motion.div
        whileTap={{ scale: 0.8 }}
        className={`p-2 rounded-full transition-colors ${
          isLiked 
            ? 'text-red-500' 
            : 'text-gray-400 group-hover:text-red-500'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={isLiked ? 'filled' : 'outline'}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Heart
              size={20}
              className={`transition-all ${
                isLiked 
                  ? 'fill-current' 
                  : 'group-hover:fill-current'
              }`}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.span
          key={likesCount}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="text-sm text-gray-400"
        >
          {likesCount}
        </motion.span>
      </AnimatePresence>
    </button>
  );
} 
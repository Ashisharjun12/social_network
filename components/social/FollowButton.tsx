'use client'
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserPlus, UserMinus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface FollowButtonProps {
  targetUserId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing = false,
  onFollowChange,
  size = 'md',
  variant = 'primary'
}: FollowButtonProps) {
  const { user } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    checkFollowStatus();
  }, [targetUserId]);

  const checkFollowStatus = async () => {
    if (!user?._id) return;

    try {
      const response = await fetch(`/api/users/follow?followerId=${user._id}&followingId=${targetUserId}`);
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollowToggle = async () => {
    if (!user?._id || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          followerId: user._id,
          followingId: targetUserId,
          action: isFollowing ? 'unfollow' : 'follow'
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsFollowing(!isFollowing);
        onFollowChange?.(!isFollowing);
        toast.success(isFollowing ? 'Unfollowed successfully' : 'Following');
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast.error('Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const variantClasses = {
    primary: isFollowing
      ? 'bg-surface text-gray-400 hover:bg-red-500/10 hover:text-red-400'
      : 'bg-primary text-white hover:bg-primary/90',
    secondary: isFollowing
      ? 'border-2 border-gray-600 text-gray-400 hover:border-red-500/50 hover:text-red-400'
      : 'border-2 border-primary text-primary hover:bg-primary/10'
  };

  return (
    <motion.button
      onClick={handleFollowToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        rounded-lg font-medium transition-all duration-300 flex items-center gap-2
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFollowing ? (
          <>
            {isHovered ? (
              <UserMinus className="w-4 h-4" />
            ) : (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                ✓
              </motion.span>
            )}
            {isHovered ? 'Unfollow' : 'Following'}
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4" />
            Follow
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
} 
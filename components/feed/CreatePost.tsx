'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useAuthStore } from '@/stores/useAuthStore'
import toast from 'react-hot-toast'

interface CreatePostProps {
  onPostCreated: () => void;
}

export default function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user } = useAuthStore()
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getAvatarDisplay = () => {
    if (user?.avatarUrl) {
      return (
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={user.avatarUrl}
            alt={`${user.username}'s avatar`}
            width={40}
            height={40}
            className="w-full h-full object-cover"
            unoptimized
          />
        </div>
      );
    }

    return (
      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-xl">👤</span>
      </div>
    );
  };

  // Extract hashtags from content in real-time
  const handleContentChange = (value: string) => {
    setContent(value);
    const tags = value.match(/#[\w]+/g)?.map(tag => tag.slice(1)) || [];
    setHashtags(tags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || !user) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          content,
          userAvatarUrl: user.avatarUrl,
          userAvatarType: user.avatarType
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Post created successfully!')
        setContent('')
        setHashtags([])
        setShowForm(false)
        onPostCreated()
      } else {
        throw new Error(data.error || 'Failed to create post')
      }
    } catch (error) {
      toast.error('Failed to create post')
      console.error('Post creation error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-surface rounded-xl p-4 mb-6">
      {!showForm ? (
        <div className="flex gap-4 items-center">
          {getAvatarDisplay()}
          <button
            onClick={() => setShowForm(true)}
            className="flex-grow text-left px-4 py-3 bg-dark rounded-lg text-gray-400 hover:bg-primary/10 transition-colors"
          >
            Share your thoughts anonymously...
          </button>
        </div>
      ) : (
        <AnimatePresence>
          <motion.form
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 mb-4">
              {getAvatarDisplay()}
              <div>
                <div className="font-medium">{user?.username}</div>
                <div className="text-xs text-gray-400">Posting anonymously</div>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="What's on your mind? Use #hashtags to categorize..."
                className="w-full px-4 py-3 bg-dark rounded-lg border border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 min-h-[120px]"
                required
              />
              
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/20 text-primary rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || !content.trim()}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      ⚡
                    </motion.div>
                    Posting...
                  </div>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </motion.form>
        </AnimatePresence>
      )}
    </div>
  )
} 
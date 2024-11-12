'use client'
import { useState, useRef } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, X, BarChart3, Send, Users } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const { user } = useAuthStore()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [postType, setPostType] = useState<'text' | 'image' | 'poll'>('text')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [pollOptions, setPollOptions] = useState([{ text: '', votes: 0 }, { text: '', votes: 0 }])
  const [pollDuration, setPollDuration] = useState('1')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setPostType('image')
      setPollOptions([{ text: '', votes: 0 }, { text: '', votes: 0 }]) // Reset poll if exists
    }
  }

  const handlePollSelect = () => {
    setPostType(postType === 'poll' ? 'text' : 'poll')
    setSelectedImage(null)
    setImagePreview(null)
  }

  const handleSubmit = async () => {
    if (!content.trim() && !selectedImage && postType !== 'poll') return
    if (postType === 'poll' && pollOptions.some(opt => !opt.text.trim())) {
      toast.error('Please fill all poll options')
      return
    }

    setIsSubmitting(true)
    try {
      let mediaUrl = ''
      let cloudinaryPublicId = ''
      
      if (selectedImage) {
        const formData = new FormData()
        formData.append('file', selectedImage)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        if (!uploadResponse.ok) throw new Error('Failed to upload image')
        const { url, public_id } = await uploadResponse.json()
        mediaUrl = url
        cloudinaryPublicId = public_id
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          username: user?.username,
          mediaUrl,
          cloudinaryPublicId,
          poll: postType === 'poll' ? {
            options: pollOptions,
            endsAt: new Date(Date.now() + parseInt(pollDuration) * 24 * 60 * 60 * 1000)
          } : undefined
        })
      })

      if (!response.ok) throw new Error('Failed to create post')

      setContent('')
      setSelectedImage(null)
      setImagePreview(null)
      setPostType('text')
      setPollOptions([{ text: '', votes: 0 }, { text: '', votes: 0 }])
      onPostCreated()
      onClose()
      toast.success('Post created!')
    } catch (error) {
      console.error('Error creating post:', error)
      toast.error('Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg mx-4 bg-dark rounded-2xl shadow-2xl overflow-hidden z-[1000]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full">
            <X size={20} className="text-gray-400" />
          </button>
          <h2 className="text-lg font-semibold">New Thread</h2>
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex gap-4">
            {/* Avatar Column */}
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={user?.avatarUrl || '/default-avatar.png'}
                  alt={user?.username || 'User'}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1 w-px bg-white/10 my-2" />
            </div>

            {/* Input Area */}
            <div className="flex-1 space-y-4">
              <div className="font-medium text-sm">{user?.username}</div>
              <textarea
                placeholder="Start a thread..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none resize-none text-base min-h-[120px]"
              />

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative rounded-xl overflow-hidden max-w-[200px]">
                  <Image
                    src={imagePreview}
                    alt="Selected image"
                    width={200}
                    height={200}
                    className="w-full object-cover"
                    unoptimized
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null)
                      setImagePreview(null)
                      setPostType('text')
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full hover:bg-black/70"
                  >
                    <X size={16} className="text-white" />
                  </button>
                </div>
              )}

              {/* Poll Options */}
              {postType === 'poll' && (
                <div className="space-y-3">
                  {pollOptions.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option.text}
                      onChange={(e) => {
                        const newOptions = [...pollOptions]
                        newOptions[index].text = e.target.value
                        setPollOptions(newOptions)
                      }}
                      placeholder={`Option ${index + 1}`}
                      className="w-full bg-surface/50 rounded-lg px-3 py-2 border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                  ))}
                  <select
                    value={pollDuration}
                    onChange={(e) => setPollDuration(e.target.value)}
                    className="w-full bg-surface/50 rounded-lg px-3 py-2 border border-white/10 focus:border-primary/50 focus:outline-none"
                  >
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="7">7 Days</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`p-2 rounded-full hover:bg-white/5 ${
                postType === 'image' ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <ImageIcon size={20} />
            </button>
            <button
              onClick={handlePollSelect}
              className={`p-2 rounded-full hover:bg-white/5 ${
                postType === 'poll' ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <BarChart3 size={20} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {content.length}/500
            </span>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || (!content.trim() && !selectedImage && postType !== 'poll')}
              className={`flex items-center gap-2 px-4 py-2 bg-primary rounded-full text-white font-medium ${
                isSubmitting || (!content.trim() && !selectedImage && postType !== 'poll')
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-primary/90'
              }`}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Send size={18} className="rotate-90" />
                </motion.div>
              ) : (
                <Send size={18} className="rotate-90" />
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 
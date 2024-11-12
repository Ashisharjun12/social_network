'use client'
import { useState, useRef } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Image as ImageIcon, PlusCircle, X, BarChart3 } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

type PostType = 'text' | 'image' | 'poll';

interface PollOption {
  text: string;
  votes: number;
}

export default function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
  const { user } = useAuthStore()
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [postType, setPostType] = useState<PostType>('text')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    { text: '', votes: 0 },
    { text: '', votes: 0 }
  ])
  const [pollDuration, setPollDuration] = useState('1') // days
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB')
        return
      }
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setPostType('image')
    }
  }

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, { text: '', votes: 0 }])
    }
  }

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index))
    }
  }

  const handlePollOptionChange = (index: number, value: string) => {
    const newOptions = [...pollOptions]
    newOptions[index].text = value
    setPollOptions(newOptions)
  }

  const handleSubmit = async () => {
    if (!content.trim() && !selectedImage && postType !== 'poll') return;

    setIsSubmitting(true);
    try {
      let mediaUrl = '';
      let cloudinaryPublicId = '';
      
      if (selectedImage) {
        const formData = new FormData();
        formData.append('file', selectedImage);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!uploadResponse.ok) throw new Error('Failed to upload image');
        const { url, public_id } = await uploadResponse.json();
        mediaUrl = url;
        cloudinaryPublicId = public_id;
      }

      const postData = {
        content,
        username: user?.username,
        mediaUrl,
        cloudinaryPublicId,
        poll: postType === 'poll' ? {
          options: pollOptions,
          endsAt: new Date(Date.now() + parseInt(pollDuration) * 24 * 60 * 60 * 1000)
        } : undefined
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (!response.ok) throw new Error('Failed to create post');

      setContent('');
      setSelectedImage(null);
      setImagePreview(null);
      setPostType('text');
      setPollOptions([{ text: '', votes: 0 }, { text: '', votes: 0 }]);
      onPostCreated();
      toast.success('Post created!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Image
          src={user?.avatarUrl || '/default-avatar.png'}
          alt={user?.username || 'User'}
          width={40}
          height={40}
          className="rounded-full"
          unoptimized
        />
        <div className="flex-1">
          <textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none resize-none"
            rows={3}
          />

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative mt-2">
              <Image
                src={imagePreview}
                alt="Selected image"
                width={300}
                height={300}
                className="rounded-lg max-h-[300px] object-cover"
                unoptimized
              />
              <button
                onClick={() => {
                  setSelectedImage(null)
                  setImagePreview(null)
                  setPostType('text')
                }}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Poll Options */}
          {postType === 'poll' && (
            <div className="space-y-3 mt-4">
              {pollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handlePollOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1 bg-surface/50 rounded-lg px-3 py-2"
                  />
                  {index > 1 && (
                    <button
                      onClick={() => handleRemovePollOption(index)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
              {pollOptions.length < 4 && (
                <button
                  onClick={handleAddPollOption}
                  className="text-primary hover:text-primary/80 text-sm"
                >
                  + Add Option
                </button>
              )}
              <select
                value={pollDuration}
                onChange={(e) => setPollDuration(e.target.value)}
                className="bg-surface/50 rounded-lg px-3 py-2 mt-2"
              >
                <option value="1">1 Day</option>
                <option value="3">3 Days</option>
                <option value="7">7 Days</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
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
            onClick={() => setPostType(postType === 'poll' ? 'text' : 'poll')}
            className={`p-2 rounded-full hover:bg-white/5 ${
              postType === 'poll' ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <BarChart3 size={20} />
          </button>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (!content.trim() && !selectedImage && postType !== 'poll')}
          className={`px-4 py-1.5 bg-primary rounded-full text-white font-medium ${
            isSubmitting || (!content.trim() && !selectedImage && postType !== 'poll')
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary/90'
          }`}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
} 
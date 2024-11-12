'use client'
import { useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import Image from 'next/image'
import { Send } from 'lucide-react'
import toast from 'react-hot-toast'

interface ReplyInputProps {
  postId: string;
  commentId: string;
  onReplySubmitted: () => void;
}

export default function ReplyInput({ postId, commentId, onReplySubmitted }: ReplyInputProps) {
  const { user } = useAuthStore()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!content.trim() || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          username: user?.username
        })
      });

      if (!response.ok) throw new Error('Failed to post reply');

      setContent('');
      onReplySubmitted();
      toast.success('Reply posted!');
    } catch (error) {
      toast.error('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-2 pl-10">
      <div className="w-px h-full bg-white/10" />
      <Image
        src={user?.avatarUrl || '/default-avatar.png'}
        alt={user?.username || 'User'}
        width={24}
        height={24}
        className="rounded-full ring-2 ring-white/10"
        unoptimized
      />
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Write a reply..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          className="w-full bg-surface/30 rounded-full px-3 py-1.5 pr-9 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
        />
        <button
          onClick={handleSubmit}
          disabled={submitting || !content.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary disabled:opacity-50"
        >
          <Send size={14} className="rotate-90" />
        </button>
      </div>
    </div>
  );
} 
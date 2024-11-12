'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useAuthStore } from '@/stores/useAuthStore'
import { School, Users, X } from 'lucide-react'
import VerifiedBadge from '@/components/common/VerifiedBadge'

interface SuggestedUser {
  _id: string;
  username: string;
  avatarUrl: string;
  avatarType: string;
  college?: {
    id: string;
    name: string;
  };
  isVerified: boolean;
  isSameCollege: boolean;
}

export default function UserSuggestions() {
  const { user } = useAuthStore()
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([])
  const [displayedSuggestions, setDisplayedSuggestions] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSuggestions();
  }, [user?.username]);

  const fetchSuggestions = async () => {
    try {
      if (!user?.username) return;

      const response = await fetch(`/api/users/suggestions?username=${user.username}`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setSuggestions(data);
        setDisplayedSuggestions(data.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSuggestion = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDisplayedSuggestions(prev => prev.filter(s => s._id !== userId));

    const remainingSuggestions = suggestions.filter(s => 
      !displayedSuggestions.find(d => d._id === s._id) || s._id === userId
    );

    if (remainingSuggestions.length > 0 && displayedSuggestions.length <= 10) {
      const nextSuggestion = remainingSuggestions[0];
      setDisplayedSuggestions(prev => [...prev.filter(s => s._id !== userId), nextSuggestion].slice(0, 10));
    }
  };

  const handleProfileClick = (username: string) => {
    // Update URL without page reload
    window.history.pushState({}, '', `/feed?profile=${username}`);
    // Dispatch a custom event to notify Feed component
    window.dispatchEvent(new CustomEvent('profileChange', { detail: username }));
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!displayedSuggestions.length) {
    return null;
  }

  return (
    <div className="bg-surface rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users size={20} className="text-primary" />
          <h3 className="font-semibold">Suggested For You</h3>
        </div>
        <button 
          onClick={fetchSuggestions}
          className="text-sm text-primary hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {displayedSuggestions.map((suggestion) => (
            <motion.div
              key={suggestion._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              layout
              className={`flex items-center justify-between p-2 rounded-lg ${
                suggestion.isSameCollege ? 'bg-primary/5' : ''
              } hover:bg-white/5 transition-colors relative group cursor-pointer`}
              onClick={() => handleProfileClick(suggestion.username)}
            >
              <div className="flex items-center gap-3">
                <Image
                  src={suggestion.avatarUrl}
                  alt={suggestion.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                  unoptimized
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">{suggestion.username}</span>
                    {suggestion.isVerified && <VerifiedBadge size="sm" />}
                  </div>
                  {suggestion.college && (
                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      <School size={12} />
                      {suggestion.college.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add follow functionality
                  }} 
                  className="px-3 py-1 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                >
                  Follow
                </button>
                <button
                  onClick={(e) => handleRemoveSuggestion(suggestion._id, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded-full"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-surface rounded-xl p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 bg-primary/20 rounded-full animate-pulse" />
        <div className="h-4 w-32 bg-surface/50 rounded animate-pulse" />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-surface/50 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-surface/50 rounded animate-pulse" />
              <div className="h-3 w-20 bg-surface/50 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-20 bg-surface/50 rounded-lg animate-pulse" />
        </div>
      ))}
    </div>
  );
} 
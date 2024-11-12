'use client'
import { useState, useEffect } from 'react'
import { Search as SearchIcon, X, School } from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import VerifiedBadge from '@/components/common/VerifiedBadge'

interface SearchResult {
  _id: string;
  username: string;
  avatarUrl: string;
  college?: {
    name: string;
    location: string;
  };
  isVerified: boolean;
}

export default function Search({ onUserSelect }: { onUserSelect: (username: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchUsers = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchTerm)}`);
        
        if (!response.ok) {
          throw new Error('Failed to search users');
        }

        const data = await response.json();
        
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('Error searching users:', error);
        setError('Failed to search users');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setError(null);
  };

  return (
    <div className="p-4">
      {/* Search Input */}
      <div className="relative mb-6">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search by username or college..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-surface/50 rounded-full border border-white/10 focus:border-primary/50 focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 p-1 rounded-full hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Search Results */}
      <div className="space-y-2">
        <AnimatePresence>
          {loading ? (
            <div className="text-center text-gray-400 py-4">Searching...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-4">{error}</div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                onClick={() => onUserSelect(user.username)}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={user.avatarUrl}
                    alt={user.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                    unoptimized
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{user.username}</span>
                      {user.isVerified && <VerifiedBadge size="sm" />}
                    </div>
                    {user.college && (
                      <div className="text-sm text-gray-400 flex items-center gap-1">
                        <School size={12} />
                        <span>{user.college.name}</span>
                        {user.college.location && (
                          <span className="text-gray-500">• {user.college.location}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          ) : searchTerm.length >= 2 ? (
            <div className="text-center text-gray-400 py-4">
              No users or colleges found matching "{searchTerm}"
            </div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
} 
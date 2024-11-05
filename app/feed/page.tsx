'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { LeftSidebar, RightSidebar } from '@/components/feed/Sidebar'
import { PostList } from '@/components/feed/PostList'
import CreatePost from '@/components/feed/CreatePost'
import UserProfile from '@/components/feed/UserProfile'
import toast from 'react-hot-toast'

interface Post {
  _id: string;
  authorId: string;
  username: string;
  content: string;
  createdAt: string;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  userAvatarUrl?: string;
  userAvatarType?: 'generated' | 'uploaded';
  isVerified?: boolean;
}

export default function Feed() {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts(Array.isArray(data) ? data : [])
    } catch (error) {
      toast.error('Failed to fetch posts')
      console.error('Error fetching posts:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    // Add category filtering logic here
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <LeftSidebar onCategorySelect={handleCategorySelect} />
      
      <div className="col-span-12 md:col-span-6 lg:col-span-6">
        {selectedUsername ? (
          <UserProfile 
            username={selectedUsername} 
            onBack={() => setSelectedUsername(null)}
            isOwnProfile={user?.username === selectedUsername}
          />
        ) : (
          <>
            <CreatePost onPostCreated={fetchPosts} />
            <PostList 
              posts={posts} 
              loading={loading} 
              onPostDeleted={(postId) => {
                setPosts(currentPosts => currentPosts.filter(p => p._id !== postId));
              }}
              onPostUpdated={(updatedPost) => {
                setPosts(currentPosts => 
                  currentPosts.map(p => p._id === updatedPost._id ? updatedPost : p)
                );
              }}
              onAvatarClick={setSelectedUsername}
            />
          </>
        )}
      </div>

      <RightSidebar />
    </div>
  )
} 
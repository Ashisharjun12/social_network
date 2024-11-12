'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { LeftSidebar, RightSidebar, BottomNav } from '@/components/feed/Sidebar'
import { PostList } from '@/components/feed/PostList'
import UserProfile from '@/components/feed/UserProfile'
import Search from '@/components/feed/Search'
import Groups from '@/components/feed/Groups'
import CreatePostModal from '@/components/feed/CreatePostModal'
import toast from 'react-hot-toast'

export default function Feed() {
  const { user } = useAuthStore()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(false)
  const [showGroups, setShowGroups] = useState(false)
  const [showCreatePost, setShowCreatePost] = useState(false)

  useEffect(() => {
    const handleProfileChange = (event: CustomEvent<string>) => {
      setSelectedUsername(event.detail);
    };

    const handleRouteChange = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const profileParam = urlParams.get('profile');
      setSelectedUsername(profileParam);
    };

    handleRouteChange();
    window.addEventListener('profileChange', handleProfileChange as EventListener);
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('profileChange', handleProfileChange as EventListener);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    if (path === '/search') {
      setShowSearch(true);
      setSelectedUsername(null);
      setShowGroups(false);
    } else if (path === '/groups') {
      setShowGroups(true);
      setShowSearch(false);
      setSelectedUsername(null);
    } else if (path === '/create') {
      setShowCreatePost(true);
    } else {
      setShowSearch(false);
      setShowGroups(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark">
      <div className="flex">
        {/* Left Sidebar - Hidden on Mobile */}
        <div className="hidden lg:block w-[240px] flex-shrink-0 fixed left-0 h-screen">
          <LeftSidebar onNavigate={handleNavigation} />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-[240px] lg:mr-[350px] border-x border-white/5">
          {showGroups ? (
            <Groups />
          ) : showSearch ? (
            <Search onUserSelect={(username) => {
              setSelectedUsername(username);
              setShowSearch(false);
            }} />
          ) : selectedUsername ? (
            <UserProfile 
              username={selectedUsername}
              onBack={() => {
                window.history.pushState({}, '', '/feed');
                setSelectedUsername(null);
              }}
              isOwnProfile={user?.username === selectedUsername}
            />
          ) : (
            <PostList 
              posts={posts}
              loading={loading}
              onPostDeleted={fetchPosts}
              onPostUpdated={fetchPosts}
              onAvatarClick={setSelectedUsername}
            />
          )}
        </main>

        {/* Right Sidebar - Hidden on Mobile */}
        <div className="hidden lg:block w-[350px] flex-shrink-0 fixed right-0 h-screen">
          <RightSidebar />
        </div>

        {/* Bottom Navigation - Mobile Only */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t border-white/5 bg-dark">
          <BottomNav onNavigate={handleNavigation} />
        </div>
      </div>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={showCreatePost}
        onClose={() => setShowCreatePost(false)}
        onPostCreated={() => {
          setShowCreatePost(false);
          fetchPosts();
        }}
      />
    </div>
  );
} 
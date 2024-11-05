'use client'
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import TopNav from '@/components/feed/TopNav'

export default function FeedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAuthenticated } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark">
      <TopNav />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
} 
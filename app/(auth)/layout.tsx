'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Check auth state and redirect accordingly
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : '/feed';
      router.replace(redirectPath);
    }
  }, [isAuthenticated, user, router])

  // Show children while checking auth status
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        {children}
      </div>
    );
  }

  return null;
} 
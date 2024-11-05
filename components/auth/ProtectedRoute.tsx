'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    if (requireAdmin && user?.role !== 'admin') {
      router.push('/feed')
      return
    }
  }, [isAuthenticated, user, requireAdmin, router])

  if (!isAuthenticated || (requireAdmin && user?.role !== 'admin')) {
    return null
  }

  return <>{children}</>
} 
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { getAuthCookie, setAuthCookie, removeAuthCookie } from '@/lib/utils/cookies'
import { useRouter } from 'next/navigation'

interface User {
  username: string;
  tempId: string;
  avatarUrl: string;
  avatarType: 'generated' | 'uploaded';
  role: 'user' | 'admin';
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const authCookie = getAuthCookie()
    if (authCookie) {
      setIsAuthenticated(true)
      setUser({
        username: authCookie.username,
        tempId: authCookie.tempId,
        avatarUrl: authCookie.avatarUrl,
        avatarType: authCookie.avatarType,
        role: authCookie.role
      })
      
      // Redirect admin users to admin dashboard
      if (authCookie.role === 'admin' && window.location.pathname === '/feed') {
        router.push('/admin')
      }
    }
  }, [router])

  const login = (token: string, userData: User) => {
    setAuthCookie({ 
      token, 
      username: userData.username, 
      tempId: userData.tempId,
      avatarUrl: userData.avatarUrl,
      avatarType: userData.avatarType,
      role: userData.role
    })
    setIsAuthenticated(true)
    setUser(userData)
    
    // Redirect based on role
    router.push(userData.role === 'admin' ? '/admin' : '/feed')
  }

  const logout = () => {
    removeAuthCookie()
    setIsAuthenticated(false)
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
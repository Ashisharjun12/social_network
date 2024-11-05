'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/useAuthStore'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: '',
    tempId: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    toast.loading('Signing in...')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      })

      const data = await response.json()

      if (response.ok) {
        toast.dismiss()
        toast.success('Welcome back!')
        login(data.data.token, data.data.user)
      } else {
        throw new Error(data.message || 'Invalid credentials')
      }
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message || 'Something went wrong')
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-dark">
      <div className="max-w-2xl w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
              <span className="relative text-6xl">🎭</span>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="mt-2 text-gray-400 text-lg">Enter your credentials to continue your anonymous journey</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-8 rounded-2xl shadow-2xl border border-white/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                className="form-input"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="tempId" className="block text-sm font-medium text-gray-300 mb-2">
                Temporary ID
              </label>
              <input
                id="tempId"
                type="text"
                required
                className="form-input"
                placeholder="Enter your temporary ID"
                value={credentials.tempId}
                onChange={(e) => setCredentials({ ...credentials, tempId: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full relative overflow-hidden group"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              )}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark text-gray-400">Don't have an account?</span>
              </div>
            </div>

            <div className="text-center">
              <a 
                href="/register" 
                className="btn-secondary inline-block w-full hover:bg-primary/5"
              >
                Create Account
              </a>
            </div>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-4"
        >
          <p className="text-gray-400">
            Forgot your Temporary ID?{' '}
            <a href="/recover" className="text-primary hover:underline">
              Recover Account
            </a>
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <a href="/help" className="hover:text-white transition-colors">Help</a>
            <span>•</span>
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 
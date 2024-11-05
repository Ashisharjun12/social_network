import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Cookies from 'js-cookie'

interface User {
  username: string;
  tempId: string;
  avatarUrl: string;
  avatarType: 'generated' | 'uploaded';
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token: string, userData: User) => {
        try {
          // Store complete user data including role in cookie
          Cookies.set('auth_token', JSON.stringify({
            token,
            user: userData
          }), { 
            expires: 30,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });

          set({ 
            user: userData,
            token,
            isAuthenticated: true 
          });

          // Redirect based on role
          window.location.href = userData.role === 'admin' ? '/admin' : '/feed';
          return true;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      logout: () => {
        try {
          Cookies.remove('auth_token');
          set({ 
            user: null,
            token: null,
            isAuthenticated: false 
          });
          window.location.href = '/login';
        } catch (error) {
          console.error('Logout error:', error);
        }
      },

      checkAuth: () => {
        try {
          const authData = Cookies.get('auth_token');
          if (!authData) {
            get().logout();
            return false;
          }

          // Parse stored auth data
          const { token, user } = JSON.parse(authData);
          if (!token || !user) {
            get().logout();
            return false;
          }

          // Update store with saved data
          set({
            user,
            token,
            isAuthenticated: true
          });

          return true;
        } catch (error) {
          console.error('Auth check error:', error);
          get().logout();
          return false;
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);
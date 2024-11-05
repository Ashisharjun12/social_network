import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AvatarState {
  avatarUrl: string | null;
  avatarType: 'generated' | 'uploaded' | null;
  setAvatar: (url: string, type: 'generated' | 'uploaded') => void;
  clearAvatar: () => void;
}

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set) => ({
      avatarUrl: null,
      avatarType: null,
      setAvatar: (url: string, type: 'generated' | 'uploaded') => 
        set({ avatarUrl: url, avatarType: type }),
      clearAvatar: () => set({ avatarUrl: null, avatarType: null })
    }),
    {
      name: 'avatar-storage'
    }
  )
) 
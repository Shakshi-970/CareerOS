import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthUser {
  name: string
  email: string
  avatarUrl?: string
  provider: 'google' | 'email'
}

interface AuthStore {
  user: AuthUser | null
  isAuthenticated: boolean
  signIn: (user: AuthUser) => void
  signOut: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      signIn: (user) => set({ user, isAuthenticated: true }),
      signOut: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'careeros-auth-v1',
    }
  )
)

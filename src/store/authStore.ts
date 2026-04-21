import { create } from 'zustand'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
}

const AUTH_STORAGE_KEY = 'virtual-lab-auth'

export const useAuthStore = create<AuthState>((set) => {
  // 从 localStorage 恢复登录状态
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  const initialUser = stored ? JSON.parse(stored) : null

  return {
    user: initialUser,
    isAuthenticated: !!initialUser,

    login: (user) => {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      set({ user, isAuthenticated: true })
    },

    logout: () => {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      set({ user: null, isAuthenticated: false })
    },

    updateProfile: (updates) => {
      set((state) => {
        if (!state.user) return state
        const updated = { ...state.user, ...updates }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated))
        return { user: updated }
      })
    },
  }
})

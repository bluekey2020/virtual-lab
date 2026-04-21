import { create } from 'zustand'
import type { User } from '../types'
import { authApi } from '../api'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (data: { name: string; schoolId: string; role: 'student' | 'teacher'; grade?: string; classNo?: string }) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  clearError: () => void
}

const AUTH_STORAGE_KEY = 'virtual-lab-auth'
const TOKEN_STORAGE_KEY = 'vl-token'

export const useAuthStore = create<AuthState>((set) => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY)
  const initialUser = stored ? JSON.parse(stored) : null

  return {
    user: initialUser,
    isAuthenticated: !!initialUser,
    isLoading: false,
    error: null,

    login: async (data) => {
      set({ isLoading: true, error: null })
      try {
        const result = await authApi.login({
          name: data.name,
          schoolId: data.schoolId,
          role: data.role,
        })

        localStorage.setItem(TOKEN_STORAGE_KEY, result.token)
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(result.user))
        set({ user: result.user, isAuthenticated: true, isLoading: false })
      } catch (err: any) {
        set({ error: err.message, isLoading: false })
        throw err
      }
    },

    logout: () => {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      localStorage.removeItem(TOKEN_STORAGE_KEY)
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

    clearError: () => set({ error: null }),
  }
})

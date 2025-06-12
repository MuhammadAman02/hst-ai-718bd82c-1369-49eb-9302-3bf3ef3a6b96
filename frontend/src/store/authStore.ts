import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, LoginCredentials, RegisterData, AuthResponse } from '../types'
import { authApi } from '../services/api'
import toast from 'react-hot-toast'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true })
        try {
          const response = await authApi.login(credentials)
          const { access_token, user } = response
          
          set({
            user,
            token: access_token,
            isAuthenticated: true,
            isLoading: false
          })
          
          toast.success(`Welcome back, ${user.first_name}!`)
          return true
        } catch (error: any) {
          set({ isLoading: false })
          const message = error.response?.data?.detail || 'Login failed'
          toast.error(message)
          return false
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true })
        try {
          await authApi.register(data)
          set({ isLoading: false })
          
          toast.success('Registration successful! Please log in.')
          return true
        } catch (error: any) {
          set({ isLoading: false })
          const message = error.response?.data?.detail || 'Registration failed'
          toast.error(message)
          return false
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        })
        toast.success('Logged out successfully')
      },

      initializeAuth: () => {
        const state = get()
        if (state.token && state.user) {
          set({ isAuthenticated: true })
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
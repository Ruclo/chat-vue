import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),

  getters: {
    isAuthenticated: (state) => state.user != null,
    getUsername: (state) => state.user?.username,
    getUser: (state) => state.user
  },

  actions: {
    async logOut() {
      await apiClient.post('/auth/logout')

      this.user = null
    },

    setUser(user) {
      this.user = user
    },

    async refreshTokens() {
      const response = await apiClient.post('/auth/refresh')
      if (response.ok) {
        const user = await response.json()
        this.setUser(user)
      }
    }
  }
})

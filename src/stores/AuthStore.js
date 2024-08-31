import { defineStore } from 'pinia'

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
    logOut() {
      this.user = null
    },

    setUser(user) {
      this.user = user
    },

    async refreshTokens() {
      try {
        const response = await fetch('https://127.0.0.1:8443/auth/refresh', {
          method: 'GET',
          credentials: 'include'
        })
        if (response.ok) {
          const user = await response.json()
          this.setUser(user)
        } else {
          this.logOut()
        }
      } catch (error) {
        console.log('An error has occured while trying to authenticate you')
        this.logOut()
      }
    }
  }
})

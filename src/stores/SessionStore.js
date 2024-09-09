import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient'

export const useSessionStore = defineStore('session', {
  state: () => ({
    sessions: [],
    sessionIdsSet: new Set(),
    sessionsPerPage: 10,
    fetchedAll: false,
    openChat: null
  }),

  getters: {
    getSessionCount: (state) => state.sessions.length,

    getSessions: (state) => state.sessions,

    isChatOpen: (state) => state.openChat != null,

    getOpenChat: (state) => state.openChat,

    getSessionsPerPage: (state) => state.sessionsPerPage,

    allSessionsFetched: (state) => state.fetchedAll
  },

  actions: {
    updateSession(sessionId, timestamp) {
      const index = this.sessions.findIndex((session) => session.sessionId === sessionId)

      let [session] = this.sessions.splice(index, 1)

      session.latestTimestamp = timestamp

      this.sessions.unshift(session)
    },

    handleChatOpen(session) {
      this.openChat = session
    },

    appendSessions(arrayOfSessions) {
      for (let i = arrayOfSessions.length - 1; i >= 0; i--) {
        let session = arrayOfSessions[i]
        if (this.sessionIdsSet.has(session.sessionId)) {
          arrayOfSessions.splice(i, 1)
        } else {
          this.sessionIdsSet.add(session.sessionId)
        }
      }
      this.sessions.push(...arrayOfSessions)
    },

    prependSession(session) {
      if (this.sessionIdsSet.has(session.sessionId)) {
        return
      }

      this.sessionIdsSet.add(session.sessionId)
      this.sessions = [session, ...this.sessions]
    },

    deleteSession(session) {
      this.sessionIdsSet.delete(session.sessionId)
      this.sessions = this.sessions.filter((s) => s.sessionId !== session.sessionId)
      if (this.getOpenChat.sessionId === session.sessionId) {
        this.handleChatOpen(null)
      }
    },

    insertSession(session) {
      this.sessionIdsSet.add(session.sessionId)
      let left = 0
      let right = this.sessions.length

      while (left < right) {
        let middle = Math.floor((left + right) / 2)

        if (this.sessions[middle].latestTimestamp <= session.latestTimestamp) {
          left = middle + 1
        } else {
          right = middle
        }
      }

      this.sessions.splice(left, 0, session)
    },

    async fetchSessions() {
      if (this.allSessionsFetched) {
        return
      }
      let oldest_timestamp = null

      if (this.sessions[this.sessions.length - 1]) {
        oldest_timestamp = this.sessions[this.sessions.length - 1].latestTimestamp
      }

      const params = new URLSearchParams({
        count: this.sessionsPerPage,
        ...(oldest_timestamp && { timestamp: oldest_timestamp })
      })

      const endpoint = '/sessions?' + params.toString()
      const response = await apiClient.get(endpoint)
      let arr = await response.json()
      if (arr.length < this.sessionsPerPage) {
        this.fetchedAll = true
      }

      this.appendSessions(arr)
    }
  }
})

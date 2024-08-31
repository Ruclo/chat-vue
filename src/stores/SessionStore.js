import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    sessions: [],
    sessionsPerPage: 10,
    openChat: null
  }),

  getters: {
    getSessionCount: (state) => state.sessions.length,

    getSessions: (state) => state.sessions,

    isChatOpen: (state) => state.openChat != null,

    getOpenChat: (state) => state.openChat
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

    initSessions(arrayOfSessions) {
      this.sessions = arrayOfSessions
    },

    appendSessions(arrayOfSessions) {
      this.sessions.push(...arrayOfSessions)
    },

    prependSession(session) {
      this.sessions = [session, ...this.sessions]
    },

    deleteSession(session) {
      this.sessions = this.sessions.filter((s) => s.sessionId !== session.sessionId)
      if (this.getOpenChat.sessionId === session.sessionId) {
        this.handleChatOpen(null)
      }
    },

    insertSession(session) {
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
      let oldest_timestamp = null

      if (this.sessions[this.sessions.length - 1]) {
        oldest_timestamp = this.sessions[this.sessions.length - 1].latestTimestamp
      }

      const params = new URLSearchParams({
        count: this.sessionsPerPage,
        ...(oldest_timestamp && { timestamp: oldest_timestamp })
      })

      const response = await fetch('https://127.0.0.1:8443/sessions?' + params.toString(), {
        method: 'GET',
        credentials: 'include'
      })

      let arr = await response.json()

      if (this.getSessionCount == 0) {
        this.initSessions(arr)
      } else {
        this.appendSessions(arr)
      }
      return arr
    }
  }
})

import { defineStore } from 'pinia'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: {},
    moreMessagesExistMap: new Map(),
    pendingMessages: []
  }),

  getters: {
    getMessages: (state) => state.messages,

    moreMessagesExist: (state) => (sessionId) => {
      return state.moreMessagesExistMap.get(sessionId) === false ? false : true
    }
  },

  actions: {
    sendMessage(message) {
      this.addMessage(message)
      this.addPendingMessage(message)
    },

    addPendingMessage(messageObj) {
      this.pendingMessages.push(messageObj)
    },

    getFirstPendingMessage() {
      return this.pendingMessages.shift()
    },

    addMessage(messageObj) {
      console.log(messageObj)
      const sessionId = messageObj.sessionId
      delete messageObj.sessionId

      let messagesArr = this.messages[sessionId]

      if (messagesArr == undefined || messagesArr.length == 0) {
        this.messages[sessionId] = [messageObj]
        return
      }

      let last = messagesArr[messagesArr.length - 1]

      if (messageObj.id == null || last.id < messageObj.id) {
        messagesArr.push(messageObj)
      }
      console.log(this.messages[sessionId])
    },

    prependMessages(messagesArray, sessionId) {
      this.messages[sessionId] = [...messagesArray, ...(this.messages[sessionId] || [])]
    },

    async fetchMessages(sessionId, count) {
      let messages = this.getMessages[sessionId]
      const params = new URLSearchParams({
        amount: count,
        ...(messages?.[0]?.timestamp && { olderThan: messages[0].timestamp })
      })

      const queryStr = params.toString()
      console.log('z fetch: ', sessionId)
      const response = await fetch(
        `https://127.0.0.1:8443/messages/session/${sessionId}?${queryStr}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      )
      let messagesArr = await response.json()

      if (messagesArr.length < count) {
        this.moreMessagesExistMap.set(sessionId, false)
      }
      this.prependMessages(messagesArr, sessionId)
      return messagesArr
    }
  }
})

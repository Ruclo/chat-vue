import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient'
import { v4 as uuidv4 } from 'uuid'

export const useMessageStore = defineStore('message', {
  state: () => ({
    messages: {},
    messageIdsSet: new Set(),
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

    updateSentMessage(updatedMessage) {
      let message = this.pendingMessages.shift()
      message.id = updatedMessage.id
      message.timestamp = updatedMessage.timestamp
      this.messageIdsSet.add(message.id)
    },

    addMessage(messageObj) {
      const messageId = messageObj.id

      if (messageId != null && this.messageIdsSet.has(messageId)) {
        return
      }

      this.messageIdsSet.add(messageId)
      const sessionId = messageObj.sessionId

      let messagesArr = this.messages[sessionId]

      if (messagesArr == undefined) {
        this.messages[sessionId] = [messageObj]
        return
      }

      messagesArr.push(messageObj)
    },

    prependMessages(messagesArray, sessionId) {
      for (let i = messagesArray.length - 1; i >= 0; i--) {
        let message = messagesArray[i]
        if (this.messageIdsSet.has(message.id)) {
          messagesArray.splice(i, 1)
        } else {
          this.messageIdsSet.add(message.id)
          message.clientId = uuidv4()
        }
      }

      this.messages[sessionId] = [...messagesArray, ...(this.messages[sessionId] || [])]
    },

    async fetchMessages(sessionId, count) {
      let messages = this.getMessages[sessionId]
      const params = new URLSearchParams({
        amount: count,
        ...(messages?.[0]?.timestamp && { olderThan: messages[0].timestamp })
      })

      const queryStr = params.toString()
      const endpoint = `/messages/session/${sessionId}?${queryStr}`

      const response = await apiClient.get(endpoint)
      let messagesArr = await response.json()

      if (messagesArr.length < count) {
        this.moreMessagesExistMap.set(sessionId, false)
      }
      this.prependMessages(messagesArr, sessionId)
    }
  }
})

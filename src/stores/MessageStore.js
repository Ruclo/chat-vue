import { defineStore } from 'pinia'
import apiClient from '@/api/apiClient'

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
      message.Id = updatedMessage.Id
      message.timestamp = updatedMessage.timestamp
      this.messageIdsSet.add(message.Id)
    },

    addMessage(messageObj) {
      const messageId = messageObj.Id
      console.log('id', messageId)

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
      while (messagesArray.length > 0) {
        let latestMessage = messagesArray[messagesArray.length - 1]
        if (!this.messageIdsSet.has(latestMessage.Id)) {
          break
        }
        messagesArray.pop()
      }
      messagesArray.forEach((message) => {
        this.messageIdsSet.add(message.Id)
      })
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

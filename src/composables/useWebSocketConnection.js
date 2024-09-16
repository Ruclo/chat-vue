import { ref, watch } from 'vue'
import { useMessageStore } from '@/stores/MessageStore'
import { useSessionStore } from '@/stores/SessionStore'
import { useAuthStore } from '@/stores/AuthStore'
import SockJS from 'sockjs-client/dist/sockjs'
import Stomp from 'stompjs'
import { v4 as uuidv4 } from 'uuid'

const MessageTypes = {
  NEW_MESSAGE: 'chat',
  SESSION_NOTIFICATION: 'session_new'
}
const stompClient = ref(null)

const refreshIntervalInMinutes = 14

const refreshInterval = refreshIntervalInMinutes * 60000
let intervalId = null

export function useWebSocketConnection() {
  const messageStore = useMessageStore()
  const sessionStore = useSessionStore()
  const authStore = useAuthStore()

  const connect = () => {
    const handleIncommingMessage = (message) => {
      let messageJson = JSON.parse(message.body)
      const type = messageJson.headers.type

      if (type === MessageTypes.NEW_MESSAGE) {
        const senderUsername = messageJson.payload.sender.username
        if (senderUsername === authStore.getUsername) {
          messageStore.updateSentMessage(messageJson.payload)
          return
        }

        messageStore.addMessage(messageJson.payload)
        return
      }

      if (type === MessageTypes.SESSION_NOTIFICATION) {
        let session = messageJson.payload
        sessionStore.insertSession(session)
      }
    }

    if (stompClient.value != null) {
      return
    }

    const url = import.meta.env.VITE_API_WEBSOCKET_URL
    const socket = new SockJS(url)
    stompClient.value = Stomp.over(socket)

    stompClient.value.connect(
      {},
      () => {
        stompClient.value.subscribe('/queue/' + authStore.getUsername, handleIncommingMessage)
        intervalId = setInterval(authStore.refreshTokens, refreshInterval)
      },
      () => {
        console.error('Failed to connect to the ws')
      }
    )
  }

  const disconnect = () => {
    if (stompClient.value) {
      stompClient.value.disconnect()
      stompClient.value = null
      if (intervalId != null) {
        clearInterval(intervalId)
      }
    }
  }

  const sendMessage = (message) => {
    let messageObj = {
      sender: authStore.getUser,
      sessionId: sessionStore.getOpenChat.sessionId,
      timestamp: new Date().toISOString(),
      content: message,
      id: null,
      clientId: uuidv4()
    }
    stompClient.value.send('/send/session/' + messageObj.sessionId, {}, messageObj.content)
    sessionStore.updateSession(messageObj.sessionId, messageObj.timestamp)
    messageStore.sendMessage(messageObj)
  }

  if (!stompClient.value) {
    watch(
      () => authStore.isAuthenticated,
      (auth) => {
        if (auth) {
          connect()
        } else {
          disconnect()
        }
      },
      { immediate: true }
    )
  }

  return {
    sendMessage,
    connect,
    disconnect
  }
}

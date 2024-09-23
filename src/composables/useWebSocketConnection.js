import { ref } from 'vue'
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

export function useWebSocketConnection(disconnectCallback) {
  const messageStore = useMessageStore()
  const sessionStore = useSessionStore()
  const authStore = useAuthStore()

  const connectWs = () => {
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

    const url = import.meta.env.VITE_WEBSOCKET_URL
    const socket = new SockJS(url)
    stompClient.value = Stomp.over(socket)
    stompClient.value.ws.onclose = handleDisconnect
    stompClient.value.connect(
      {},
      () => {
        stompClient.value.subscribe('/queue/' + authStore.getUsername, handleIncommingMessage)
        intervalId = setInterval(authStore.refreshTokens, refreshInterval)
      },
      () => {
        console.error('Failed to connect to the ws')
        handleDisconnect()
      }
    )
  }

  const handleDisconnect = () => {
    console.log('You have been disconnected')
    console.log('Trying to reconnect')
    if (intervalId != null) {
      clearInterval(intervalId)
      intervalId = null
    }
    setTimeout(disconnectCallback, 3000)
  }

  const disconnectWs = () => {
    if (stompClient.value) {
      stompClient.value.disconnect()
      stompClient.value = null
    }
  }

  const sendWsMessage = (message) => {
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

  const socket = new SockJS(url)
  stompClient.value = Stomp.over(socket)
  console.log(stompClient.value.ws.onclose)

  return {
    sendWsMessage,
    connectWs,
    disconnectWs
  }
}

import { ref, onMounted, onUnmounted } from 'vue'
import { useMessageStore } from '@/stores/MessageStore'
import { useSessionStore } from '@/stores/SessionStore'
import { useAuthStore } from '@/stores/AuthStore'
import SockJS from 'sockjs-client/dist/sockjs'
import Stomp from 'stompjs'

const MessageTypes = {
  NEW_MESSAGE: 'chat',
  SESSION_NOTIFICATION: 'session_new'
}
const stompClient = ref(null)

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
          let messageObj = messageStore.getFirstPendingMessage()
          messageObj.id = messageJson.payload.id
          messageObj.timestamp = messageJson.payload.timestamp
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

    const socket = new SockJS('https://127.0.0.1:8443/ws')
    stompClient.value = Stomp.over(socket)

    stompClient.value.connect(
      {},
      () => {
        stompClient.value.subscribe('/queue/' + authStore.getUsername, handleIncommingMessage)
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
    }
  }

  const sendMessage = (message) => {
    let messageObj = {
      sender: authStore.getUser,
      sessionId: sessionStore.getOpenChat.sessionId,
      timestamp: new Date().toISOString(),
      content: message,
      id: null
    }
    stompClient.value.send('/send/session/' + messageObj.sessionId, {}, messageObj.content)
    sessionStore.updateSession(messageObj.sessionId, messageObj.timestamp)
    messageStore.sendMessage(messageObj)
  }

  onMounted(() => {
    connect()
  })

  onUnmounted(() => {
    disconnect()
  })

  return {
    sendMessage
  }
}

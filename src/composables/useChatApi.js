import { useAuthStore } from '@/stores/AuthStore'
import { useMessageStore } from '@/stores/MessageStore'
import { useSessionStore } from '@/stores/SessionStore'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useWebSocketConnection } from './useWebSocketConnection'

const authStore = useAuthStore()
const sessionStore = useSessionStore()
const messageStore = useMessageStore()

const stompClient = null
const loading = ref(true)
let retries = 0
const MAX_RETRIES = 3

const { sendWsMessage, connectWs, disconnectWs } = useWebSocketConnection()

export async function useChatApi() {
  const establishConnection = async () => {
    if (retries >= MAX_RETRIES) {
      return
    }

    loading.value = true
    retries++
    connectWs(establishConnection, establishConnection)
    await sessionStore.fetchSessions()
    retries = 0
    loading.value = false
  }

  const disconnect = () => {
    retries = MAX_RETRIES
    disconnectWs()
    retries = 0

    sessionStore.$reset()
    messageStore.$reset()
  }

  if (stompClient == null) {
    onMounted(async () => {
      try {
        await authStore.refreshTokens()
      } catch (error) {
        loading.value = false
      }
    })

    onBeforeUnmount(() => {
      disconnect()
    })
  }
  await establishConnection()

  return {
    loading,
    sendWsMessage
  }
}

import { useAuthStore } from '@/stores/AuthStore'
import { useMessageStore } from '@/stores/MessageStore'
import { useSessionStore } from '@/stores/SessionStore'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useWebSocketConnection } from './useWebSocketConnection'

const connected = ref(false)
const loading = ref(true)
let retries = 0
const MAX_RETRIES = 3

export function useChatApi() {
  const authStore = useAuthStore()
  const sessionStore = useSessionStore()
  const messageStore = useMessageStore()
  const { sendWsMessage, connectWs, disconnectWs } = useWebSocketConnection()

  const establishConnection = async () => {
    connected.value = false
    if (retries >= MAX_RETRIES) {
      return
    }

    loading.value = true
    retries++
    connectWs(establishConnection, establishConnection)
    await sessionStore.fetchSessions()
    retries = 0
    connected.value = true
    loading.value = false
  }

  const disconnect = () => {
    retries = MAX_RETRIES
    disconnectWs()
    retries = 0

    sessionStore.$reset()
    messageStore.$reset()
  }

  if (!connected.value) {
    onMounted(async () => {
      try {
        await authStore.refreshTokens()
        await establishConnection()
      } catch (error) {
        loading.value = false
      }
    })

    onBeforeUnmount(() => {
      disconnect()
    })
  }

  return {
    loading,
    sendWsMessage
  }
}

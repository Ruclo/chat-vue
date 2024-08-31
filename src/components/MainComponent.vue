<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import SessionBar from './SessionBar.vue'
import NoChatComponent from './NoChatComponent.vue'
import ChatComponent from './ChatComponent.vue'
import SideBarComponent from './SideBarComponent.vue'
import { useWebSocketConnection } from '@/composables/useWebSocketConnection'
import { useSessionStore } from '@/stores/SessionStore'

const sessionStore = useSessionStore()
const authStore = useAuthStore()
useWebSocketConnection()
const refreshIntervalInMinutes = 14

const refreshInterval = refreshIntervalInMinutes * 60000
let intervalId = null

onMounted(() => {
  intervalId = setInterval(authStore.refreshTokens, refreshInterval)
})

onBeforeUnmount(() => {
  if (intervalId != null) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <SessionBar />
  <main class="split">
    <ChatComponent v-if="sessionStore.isChatOpen" />
    <NoChatComponent v-else />
    <SideBarComponent />
  </main>
</template>

<style scoped>
.split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: calc(100vh - 4em);
}
</style>

<script setup>
import AuthComponent from './components/Common/AuthComponent.vue'
import LoadingComponent from './components/Common/LoadingComponent.vue'
import MainComponent from './components/Desktop/MainComponent.vue'
import MobileMainComponent from './components/Mobile/MobileMainComponent.vue'
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useAuthStore } from './stores/AuthStore'
import { useSessionStore } from './stores/SessionStore'
import { useWebSocketConnection } from './composables/useWebSocketConnection'
import { useMessageStore } from './stores/MessageStore'
import { useResponsive } from './composables/useResponsive'

const authStore = useAuthStore()
const sessionStore = useSessionStore()
const messageStore = useMessageStore()
const isLoading = ref(true)

const { isMobile } = useResponsive()

const currentComponent = computed(() => {
  if (isLoading.value) return LoadingComponent
  if (!authStore.isAuthenticated) return AuthComponent
  if (isMobile.value) return MobileMainComponent
  return MainComponent
})

watch(
  () => authStore.isAuthenticated,
  async (authenticated) => {
    isLoading.value = true
    if (authenticated) {
      useWebSocketConnection().connect()
      await sessionStore.fetchSessions()
      await sessionStore.fetchSessions()
    } else {
      useWebSocketConnection().disconnect()
      sessionStore.$reset()
      messageStore.$reset()
    }
    isLoading.value = false
  }
)

onMounted(async () => {
  try {
    await authStore.refreshTokens()
  } catch (error) {
    isLoading.value = false
  }
})

onBeforeUnmount(() => {
  useWebSocketConnection().disconnect()
})
</script>

<template>
  <component :is="currentComponent"></component>
</template>

<style></style>

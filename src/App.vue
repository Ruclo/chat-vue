<script setup>
import AuthComponent from './components/Common/AuthComponent.vue'
import LoadingComponent from './components/Common/LoadingComponent.vue'
import MainComponent from './components/Desktop/MainComponent.vue'
import MobileMainComponent from './components/Mobile/MobileMainComponent.vue'
import { computed } from 'vue'
import { useAuthStore } from './stores/AuthStore'
import { useResponsive } from './composables/useResponsive'
import { useChatApi } from './composables/useChatApi'

const authStore = useAuthStore()
const { loading } = await useChatApi()

const { isMobile } = useResponsive()

const currentComponent = computed(() => {
  if (loading.value) return LoadingComponent
  if (!authStore.isAuthenticated) return AuthComponent
  if (isMobile.value) return MobileMainComponent
  return MainComponent
})
</script>

<template>
  <component :is="currentComponent"></component>
</template>

<style></style>

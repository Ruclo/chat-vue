<script setup>
import AuthComponent from './components/AuthComponent.vue'
import LoadingComponent from './components/LoadingComponent.vue'
import MainComponent from './components/MainComponent.vue'
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from './stores/AuthStore'

const authStore = useAuthStore()

const isLoading = ref(true)

const currentComponent = computed(() => {
  if (isLoading.value) return LoadingComponent
  if (!authStore.isAuthenticated) return AuthComponent
  return MainComponent
})

onMounted(async () => {
  await authStore.refreshTokens()
  isLoading.value = false
})
</script>

<template>
  <component :is="currentComponent"></component>
</template>

<style></style>

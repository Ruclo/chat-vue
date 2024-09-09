<script setup>
import SessionBar from '../Common/SessionBar.vue'
import NoChatComponent from './NoChatComponent.vue'
import ChatComponent from '../Common/ChatComponent.vue'
import SideBarComponent from './SideBarComponent.vue'
import { useSessionStore } from '@/stores/SessionStore'

const sessionStore = useSessionStore()
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
  grid-auto-rows: 1fr;
  height: calc(100vh - 4em);
}
</style>

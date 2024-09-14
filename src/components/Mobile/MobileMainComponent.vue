<script setup>
import { useSessionStore } from '@/stores/SessionStore'

import SessionBar from '../Common/SessionBar.vue'
import MobileChatHeader from './MobileChatHeader.vue'
import ChatComponent from '../Common/ChatComponent.vue'

import { shallowRef, computed, watch } from 'vue'
import MobileCreateFirstSession from './MobileCreateFirstSession.vue'

const sessionStore = useSessionStore()
const currentOverlay = shallowRef(
  sessionStore.getSessionCount > 0 ? SessionBar : MobileCreateFirstSession
)
const slideDirection = computed(() => (currentOverlay.value ? 'slide-right' : 'slide-left'))

const changeOverlay = (overlayComponent) => {
  currentOverlay.value = overlayComponent
}

watch(
  () => sessionStore.getSessionCount,
  (count) => {
    currentOverlay.value = count > 0 ? SessionBar : MobileCreateFirstSession
  }
)
</script>

<template>
  <Transition :name="slideDirection">
    <div v-if="currentOverlay" class="overlay">
      <component :is="currentOverlay" @close="currentOverlay = null" />
    </div>
  </Transition>

  <main>
    <div class="mobile-chat" v-if="sessionStore.isChatOpen">
      <MobileChatHeader @change-overlay="changeOverlay" />
      <ChatComponent />
    </div>
  </main>
</template>

<style scoped>
.overlay {
  position: absolute;
  width: 100vw;
  z-index: 2;
  height: 100svh;
  overflow: hidden;
}

main {
  height: 100svh;
}

.chat-container {
  flex-grow: 1;
  overflow: auto;
}

.mobile-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

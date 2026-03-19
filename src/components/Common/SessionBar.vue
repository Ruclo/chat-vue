<script setup>
import { useSessionStore } from '@/stores/SessionStore'
import SessionArrow from './SessionArrow.vue'
import { computed, ref, nextTick } from 'vue'

const sessionStore = useSessionStore()

const itemsPerPage = computed(() => sessionStore.getSessionsPerPage)
const currentPage = ref(0)
const maxPage = computed(() =>
  sessionStore.getSessionCount == 0
    ? 0
    : Math.floor((sessionStore.getSessionCount - 1) / itemsPerPage.value)
)

const visibleSessions = computed(() => {
  const start = currentPage.value * itemsPerPage.value
  return sessionStore.getSessions.slice(start, start + itemsPerPage.value)
})

const slideDirection = ref('slide-right')

function slideNext() {
  slideDirection.value = 'slide-left'
  currentPage.value++
}

function slidePrevious() {
  slideDirection.value = 'slide-right'
  currentPage.value--
}

const emit = defineEmits(['close'])

const handleChatOpen = async (session) => {
  sessionStore.handleChatOpen(session)
  await nextTick()
  emit('close')
}
</script>

<template>
  <div class="session-bar">
    <SessionArrow @click="slidePrevious" :disabled="currentPage === 0" direction="PREVIOUS" />
    <div class="sessions-wrapper">
      <Transition :name="slideDirection">
        <div class="session-container" :key="currentPage">
          <div
            v-for="session in visibleSessions"
            :key="session.sessionId"
            class="session-item"
            :class="{ selected: sessionStore.getOpenChat?.sessionId == session.sessionId }"
            @click="handleChatOpen(session)"
          >
            {{ session.sessionName }}
          </div>
        </div>
      </Transition>
    </div>
    <SessionArrow @click="slideNext" :disabled="currentPage >= maxPage" direction="NEXT" />
  </div>
</template>

<style scoped>
.selected {
  color: var(--ink-900);
  text-shadow: none;
  position: relative;
}

.selected::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--accent) 0%, var(--accent-soft) 86%);
}

.session-bar {
  display: flex;
  width: 100%;
  margin: 0 auto;
  height: 4.5em;
  min-height: 25px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-soft);
}

.sessions-wrapper {
  flex: 0 0 calc(100% / 12 * 10);
  overflow: hidden;
  position: relative;
  mask-image: linear-gradient(to right, transparent, black 2%, black 98%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 2%, black 98%, transparent);
}

.session-container {
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
}

.session-item {
  flex: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  max-width: 15%;
  text-align: center;
  color: var(--ink-500);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.session-item:hover {
  color: var(--ink-900);
}

@media (max-width: 800px) {
  .session-bar {
    flex-direction: column;
    height: 100svh;
    margin: 0;
  }

  .session-container {
    flex-direction: column;
    align-items: center;
  }

  .session-item {
    max-width: none;
  }

  .sessions-wrapper {
    mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
  }

  .session-container.slide-left-enter-from {
    transform: translateY(100%);
  }

  .session-container.slide-left-leave-to {
    transform: translateY(-100%);
  }

  .session-container.slide-right-enter-from {
    transform: translateY(-100%);
  }

  .session-container.slide-right-leave-to {
    transform: translateY(100%);
  }
}
</style>

<script setup>
import { useSessionStore } from '@/stores/SessionStore'
import { computed, ref, watch, onMounted } from 'vue'

const sessionStore = useSessionStore()
const itemsPerPage = 10
const currentPage = ref(0)
const visibleSessions = computed(() => {
  const start = currentPage.value * itemsPerPage
  return sessionStore.getSessions.slice(start, start + itemsPerPage)
})
const slideDirection = ref('slide-right')
const maxPage = computed(() => Math.ceil(sessionStore.getSessions.length / itemsPerPage) - 1)
const isAtEnd = ref(false)

function slideNext() {
  slideDirection.value = 'slide-left'
  currentPage.value++
}

function slidePrevious() {
  slideDirection.value = 'slide-right'
  currentPage.value--
}

watch(currentPage, async (n) => {
  if (n == maxPage.value && !isAtEnd.value) {
    let arr = await sessionStore.fetchSessions()

    if (arr.length < itemsPerPage) {
      isAtEnd.value = true
    }
  }
})

onMounted(async () => {
  await sessionStore.fetchSessions()
  await sessionStore.fetchSessions()
})
</script>

<template>
  <div class="session-bar">
    <div
      class="arrow"
      id="backArrow"
      @click="slidePrevious"
      :class="{ disabled: currentPage === 0 }"
    >
      <img class="arrow-img left-arrow-img" src="../assets/arrow.svg" width="25" height="25" />
    </div>
    <div class="sessions-wrapper">
      <Transition :name="slideDirection">
        <div class="session-container" :key="currentPage">
          <div
            v-for="session in visibleSessions"
            :key="session.sessionId"
            class="session-item"
            :class="{ selected: sessionStore.getOpenChat?.sessionId == session.sessionId }"
            @click="sessionStore.handleChatOpen(session)"
          >
            {{ session.sessionName }}
          </div>
        </div>
      </Transition>
    </div>
    <div
      class="arrow"
      id="nextArrow"
      @click="slideNext"
      :class="{ disabled: currentPage === maxPage }"
    >
      <img class="arrow-img right-arrow-img" src="../assets/arrow.svg" width="25" height="25" />
    </div>
  </div>
</template>

<style scoped>
.selected {
  border-bottom: 1px outset aquamarine;
  color: aquamarine;
  text-shadow: 0 0 5px aquamarine;
}

.arrow-img {
  filter: invert(1);
}

.left-arrow-img {
  transform: rotate(-90deg);
}

.right-arrow-img {
  transform: rotate(90deg);
}

.session-bar {
  display: flex;
  width: 100%;
  margin: 0 auto;
  height: 4em;
  min-height: 25px;
}

.arrow {
  flex: 0 0 calc(100% / 12);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.5s ease;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

.arrow.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .session-bar {
    flex-direction: column;
  }

  .left-arrow-img {
    transform: rotate(0deg);
  }

  .right-arrow-img {
    transform: rotate(180deg);
  }
  .arrow,
  .sessions-wrapper {
    flex: 0 0 100%;
  }

  .session-container {
    flex-direction: column;
  }

  .sessions-wrapper {
    mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
    -webkit-mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent);
  }

  .slide-left-enter-from {
    transform: translateY(100%);
  }

  .slide-left-leave-to {
    transform: translateY(-100%);
  }

  .slide-right-enter-from {
    transform: translateY(-100%);
  }

  .slide-right-leave-to {
    transform: translateY(100%);
  }
}
</style>

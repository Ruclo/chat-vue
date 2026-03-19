<script setup>
import { computed, ref } from 'vue'
import CreateSessionComponent from '../Overlays/CreateSessionComponent.vue'
import CreateSessionButton from '../Common/Buttons/CreateSessionButton.vue'
const overlayOpen = ref(true)

const slideDirection = computed(() => {
  return overlayOpen.value ? 'slide-right' : 'slide-left'
})
</script>

<template>
  <div class="no-sessions-display">
    <div class="empty-title">You have no sessions</div>
    <div class="btn-container">
      <CreateSessionButton @click="overlayOpen = true" />
    </div>
  </div>
  <Transition :name="slideDirection">
    <CreateSessionComponent v-if="overlayOpen" @close="overlayOpen = false" />
  </Transition>
</template>

<style scoped>
.btn-container {
  margin: 0 auto;
  width: 100px;
}

.no-sessions-display {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  align-items: center;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  margin: 1rem;
  box-shadow: var(--shadow);
}

.empty-title {
  font-size: 1.4rem;
  color: var(--ink-900);
  font-weight: 600;
  font-family: var(--font-display);
}
</style>

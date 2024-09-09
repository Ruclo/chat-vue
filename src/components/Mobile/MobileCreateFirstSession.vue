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
    <div style="text-align: center; font-size: xx-large; color: white">You have no sessions</div>
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
}
</style>

<script setup>
import { useResponsive } from '@/composables/useResponsive'

const props = defineProps({
  width: {
    type: String,
    required: false,
    defualt: 'auto'
  },
  height: {
    type: String,
    required: false,
    default: 'auto'
  }
})

const { isMobile } = useResponsive()
</script>

<template>
  <div class="overlay-container">
    <div
      v-if="!isMobile"
      class="overlay-box-desktop"
      :style="{ width: props.width, height: props.height }"
    >
      <div class="wrap">
        <slot></slot>
      </div>
    </div>
    <div v-else class="overlay-box-mobile">
      <div class="wrap">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay-box-desktop {
  background: var(--surface);
  z-index: 0;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  font-size: 1.2em;
  box-shadow: var(--shadow);
}
.wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 1em;
  gap: 0.5em;
  height: 100%;
  width: 100%;
  align-items: center;
}
.overlay-box-mobile {
  background: var(--surface);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
}

.overlay-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>

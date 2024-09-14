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
  background-image: linear-gradient(135deg, rgba(0, 0, 0, 1), rgba(83, 83, 83, 1)),
    linear-gradient(135deg, #53c3c3, transparent);
  z-index: 0;
  border-radius: 1em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1.5em;
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
  background: var(--color-background-mute);
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
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

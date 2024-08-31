<script setup>
import { defineProps } from 'vue'
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
</script>

<template>
  <div class="overlay-container">
    <div class="overlay" :style="{ width: props.width, height: props.height }">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  background-image: linear-gradient(135deg, rgba(0, 0, 0, 1), rgba(83, 83, 83, 1)),
    linear-gradient(135deg, #53c3c3, transparent);
  z-index: 0;
  border-radius: 1em;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1.5em;
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

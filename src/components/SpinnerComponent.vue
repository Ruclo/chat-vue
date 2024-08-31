<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  width: {
    type: Number,
    default: 100
  },

  height: {
    type: Number,
    default: 100
  }
})

const spinnerStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  borderTop: `${0.16 * props.width}px solid aquamarine`
}))
</script>

<template>
  <div class="flex-center-height">
    <div class="spinner" :style="spinnerStyle"></div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.flex-center-height {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>

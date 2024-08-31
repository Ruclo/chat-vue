<script setup>
import { ref, watch, defineEmits, onUnmounted } from 'vue'
import Spinner from './SpinnerComponent.vue'
const sentinelElement = ref(null)

const emit = defineEmits(['intersect'])

function handleIntersect(entries) {
  for (const { isIntersecting } of entries) {
    if (isIntersecting) {
      emit('intersect')
    }
  }
}
let observer = new IntersectionObserver(handleIntersect, {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
})

watch(
  sentinelElement,
  (newEl, oldEl) => {
    if (oldEl && observer) {
      observer.unobserve(oldEl)
    }

    if (newEl && observer) {
      observer.observe(newEl)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div ref="sentinelElement" class="loading-sentinel">
    <Spinner :width="20" :height="20" />
  </div>
</template>

<style scoped></style>

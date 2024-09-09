<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },

  direction: {
    type: String,
    required: true,
    validator: (value) => ['PREVIOUS', 'NEXT'].includes(value)
  }
})

const computedClass = computed(() => ({
  'previous-arrow': props.direction === 'PREVIOUS',
  'next-arrow': props.direction === 'NEXT',
  disabled: props.disabled
}))
</script>

<template>
  <div class="arrow" :class="computedClass">
    <img class="arrow-img" src="@/assets/arrow.svg" width="25" height="25" />
  </div>
</template>

<style scoped>
.arrow {
  flex: 0 0 calc(100% / 12);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.arrow.disabled {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}

.previous-arrow {
  transform: rotate(-90deg);
}

.next-arrow {
  transform: rotate(90deg);
}

@media (max-width: 800px) {
  .previous-arrow {
    transform: rotate(0deg);
  }

  .next-arrow {
    transform: rotate(180deg);
  }
}
</style>

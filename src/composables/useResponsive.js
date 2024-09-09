import { ref, computed, onBeforeUnmount } from 'vue'

let addedEventListener = false
const windowWidth = ref(window.innerWidth)
const mobileBreakpoint = 800
const isMobile = computed(() => windowWidth.value <= mobileBreakpoint)

export function useResponsive() {
  const updateWidth = () => {
    windowWidth.value = window.innerWidth
  }

  if (!addedEventListener) {
    window.addEventListener('resize', updateWidth)
    onBeforeUnmount(() => {
      window.removeEventListener('resize', updateWidth)
    })
    addedEventListener = true
  }

  return { isMobile, windowWidth }
}

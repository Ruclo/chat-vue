import { ref, reactive } from 'vue'

export function useImageCrop(container, image) {
  const cropPosition = reactive({ x: 0, y: 0 })
  const isDragging = ref(false)
  const startPosition = reactive({ x: 0, y: 0 })

  const getEventCoordinates = (event) => {
    if (event.touches && event.touches.length) {
      return { x: event.touches[0].clientX, y: event.touches[0].clientY }
    }

    return { x: event.clientX, y: event.clientY }
  }

  const startCrop = (event) => {
    event.preventDefault()
    isDragging.value = true

    const { x, y } = getEventCoordinates(event)
    startPosition.x = x
    startPosition.y = y
    window.addEventListener('mousemove', moveCrop)
    window.addEventListener('mouseup', stopCrop)

    window.addEventListener('touchmove', moveCrop)
    window.addEventListener('touchend', stopCrop)
  }

  const moveCrop = (event) => {
    event.preventDefault()

    if (!isDragging.value) return
    const { x, y } = getEventCoordinates(event)

    const mouseXDiff = x - startPosition.x
    const mouseYDiff = y - startPosition.y

    const containerRect = container.value.getBoundingClientRect()
    const imageRect = image.value.getBoundingClientRect()

    const newImageTopLeft = {
      x: imageRect.x + mouseXDiff,
      y: imageRect.y + mouseYDiff
    }

    const newImageBottomRight = {
      x: newImageTopLeft.x + imageRect.width,
      y: newImageTopLeft.y + imageRect.height
    }

    const containerTopleft = {
      x: containerRect.x,
      y: containerRect.y
    }

    const containerBottomRight = {
      x: containerTopleft.x + containerRect.width,
      y: containerTopleft.y + containerRect.height
    }

    if (
      newImageTopLeft.x <= containerTopleft.x &&
      newImageBottomRight.x >= containerBottomRight.x
    ) {
      cropPosition.x += mouseXDiff
    }

    if (
      newImageTopLeft.y <= containerTopleft.y &&
      newImageBottomRight.y >= containerBottomRight.y
    ) {
      cropPosition.y += mouseYDiff
    }

    startPosition.x = x
    startPosition.y = y
  }

  const stopCrop = (event) => {
    event.preventDefault()
    window.removeEventListener('mousemove', moveCrop)
    window.removeEventListener('mouseup', stopCrop)
    window.removeEventListener('touchmove', moveCrop)
    window.removeEventListener('touchend', stopCrop)

    isDragging.value = false
  }

  return {
    cropPosition,
    startCrop
  }
}

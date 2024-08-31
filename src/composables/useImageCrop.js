import { ref, reactive } from 'vue'

export function useImageCrop(container, image) {
  const cropPosition = reactive({ x: 0, y: 0 })
  const isDragging = ref(false)
  const startPosition = reactive({ x: 0, y: 0 })

  const startCrop = (event) => {
    isDragging.value = true
    startPosition.x = event.clientX
    startPosition.y = event.clientY
    window.addEventListener('mousemove', moveCrop)
    window.addEventListener('mouseup', stopCrop)
  }

  const moveCrop = (event) => {
    if (!isDragging.value) return

    const mouseXDiff = event.clientX - startPosition.x
    const mouseYDiff = event.clientY - startPosition.y

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

    startPosition.x = event.clientX
    startPosition.y = event.clientY
  }

  const stopCrop = () => {
    window.removeEventListener('mousemove', moveCrop)
    window.removeEventListener('mouseup', stopCrop)
    isDragging.value = false
  }

  return {
    cropPosition,
    startCrop
  }
}

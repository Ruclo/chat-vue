<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useImageCrop } from '@/composables/useImageCrop'
import GeneralOverlay from './GeneralOverlay.vue'
import BorderButton from '../Common/Buttons/BorderButton.vue'
import apiClient from '@/api/apiClient'
import { useAuthStore } from '@/stores/AuthStore'

const fileInput = ref(null)
const imageEl = ref(null)
const imageContainer = ref(null)

let imageNaturalHeight, imageNaturalWidth

const authStore = useAuthStore()

const image = ref(null)
const zoom = ref(null)

const minZoom = ref(null)
const maxZoom = computed(() => (minZoom.value != null ? minZoom.value * 3 : null))

const dropZone = ref(null)

let dropZoneWidth, dropZoneHeight

const zoomStep = computed(() => {
  if (minZoom.value == null || maxZoom.value == null) {
    return null
  }
  return (maxZoom.value - minZoom.value + 1) / 30
})

const { cropPosition, startCrop } = useImageCrop(imageContainer, imageEl)

const emit = defineEmits(['close'])

const imageStyle = computed(() => ({
  top: `${cropPosition.y}px`,
  left: `${cropPosition.x}px`,
  width: `${imageNaturalWidth * zoom.value}px`,
  height: `${imageNaturalHeight * zoom.value}px`
}))

const cropStyle = computed(() => ({
  width: `${dropZoneWidth}px`,
  height: `${dropZoneHeight}px`,
  borderRadius: '50%',
  position: 'absolute',
  top: 0,
  left: 0,
  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
  pointerEvents: 'none'
}))

const onDrop = (e) => {
  const file = e.dataTransfer.files[0]
  handleFile(file)
}

const onFileSelected = (e) => {
  const file = e.target.files[0]
  handleFile(file)
}

const handleFile = async (file) => {
  if (file && file.type.match('image.*')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      dropZoneWidth = dropZone.value.clientWidth
      dropZoneHeight = dropZone.value.clientHeight
      console.log('dzw', dropZoneWidth)
      console.log('dzh', dropZoneHeight)
      image.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const fitImage = () => {
  imageNaturalWidth = imageEl.value.naturalWidth
  imageNaturalHeight = imageEl.value.naturalHeight

  const containerRect = imageContainer.value.getBoundingClientRect()

  const containerWidth = containerRect.width
  const containerHeight = containerRect.height

  let x, y, scale

  if (imageNaturalWidth > imageNaturalHeight) {
    scale = containerHeight / imageNaturalHeight + 0.01
    x = (imageNaturalWidth * scale - containerWidth) / 2
    y = 0
  } else {
    scale = containerWidth / imageNaturalWidth + 0.01
    x = 0
    y = (imageNaturalHeight * scale - containerHeight) / 2
  }
  zoom.value = scale
  minZoom.value = scale
  cropPosition.x = -x
  cropPosition.y = -y
}

const updateZoom = async () => {
  await nextTick()
  const imageRect = imageEl.value.getBoundingClientRect()
  const containerRect = imageContainer.value.getBoundingClientRect()

  if (imageRect.x > containerRect.x) {
    cropPosition.x -= imageRect.x - containerRect.x
  }

  const imageRightX = imageRect.x + imageRect.width
  const containerRightX = containerRect.x + containerRect.width
  if (imageRightX < containerRightX) {
    cropPosition.x += containerRightX - imageRightX
  }

  if (imageRect.y > containerRect.y) {
    cropPosition.y -= imageRect.y - containerRect.y
  }

  const imageBottomY = imageRect.y + imageRect.height
  const containerBottomY = containerRect.y + containerRect.height

  if (imageBottomY < containerBottomY) {
    cropPosition.y += containerBottomY - imageBottomY
  }
}

watch(zoom, updateZoom)

const sendToApi = async () => {
  if (!image.value) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const canvasSize = 512
  canvas.width = canvasSize
  canvas.height = canvasSize

  const img = new Image()
  img.onload = async () => {
    const scale = zoom.value
    const sx = -cropPosition.x / scale
    const sy = -cropPosition.y / scale
    const sWidth = dropZoneWidth / scale
    const sHeight = dropZoneHeight / scale

    ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvasSize, canvasSize)

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'))

    let formData = new FormData()
    formData.append('file', blob, 'profile.jpg')

    const endpoint = '/users/profilePicture'

    try {
      const response = await apiClient.post(endpoint, formData)
      const pfpUrl = await response.text()
      authStore.user.pfpUrl = pfpUrl
      emit('close')
    } catch (error) {
      console.error('Error updating profile picture:', error)
    }
  }
  img.src = image.value
}
</script>

<template>
  <GeneralOverlay>
    <div class="profile-picture-uploader">
      <BorderButton style="margin-left: auto; margin-bottom: 0.5em" @click="emit('close')"
        >X</BorderButton
      >
      <div
        class="drop-zone"
        :class="{ 'has-image': image }"
        @drop.prevent="onDrop"
        @dragover.prevent
        @click="$refs.fileInput.click()"
        ref="dropZone"
      >
        <input
          type="file"
          ref="fileInput"
          @change="onFileSelected"
          accept="image/*"
          :disabled="image"
          style="display: none"
        />
        <p v-if="!image">Drag & Drop or Click to Upload Profile Picture</p>
        <div v-else class="image-container" ref="imageContainer">
          <img
            @mousedown.prevent="startCrop"
            @touchstart.prevent="startCrop"
            draggable="false"
            :src="image"
            ref="imageEl"
            @load="fitImage"
            :style="imageStyle"
          />

          <div class="crop-overlay" :style="cropStyle"></div>
        </div>
      </div>

      <div v-if="image" class="controls">
        <input type="range" v-model="zoom" :min="minZoom" :max="maxZoom" :step="zoomStep" />
        <div style="display: flex; justify-content: center">
          <BorderButton @click="sendToApi">Set as Profile Picture</BorderButton>
        </div>
      </div>
    </div>
  </GeneralOverlay>
</template>

<style scoped>
.profile-picture-uploader {
  color: white;
  margin: 0 auto;
  text-align: center;
}

.drop-zone {
  aspect-ratio: 1/1;
  width: 20vw;
  max-width: 300px;
  max-height: 300px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.drop-zone.has-image {
  border: none;
}

.image-container {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: grab;
}

.img-wrap {
  overflow: visible;
}

.image-container img {
  overflow: visible;
  transform-origin: 0 0;
  position: absolute;
  touch-action: none;
  user-select: none;
}

.controls {
  margin-top: 20px;
}

input[type='range'] {
  width: 100%;
  margin: 10px 0;
}

@media (max-width: 800px) {
  .drop-zone {
    width: 70vw;
    font-size: 1em;
  }
}
</style>

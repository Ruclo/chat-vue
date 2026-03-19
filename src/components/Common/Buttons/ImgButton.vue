<template>
  <div class="img-button-wrap">
    <button class="img-button" :title="buttonTitle">
      <img :src="imageSrc" :alt="buttonTitle" :style="imageStyle" />
    </button>
  </div>
</template>

<script setup>
defineProps({
  imageSrc: {
    type: String,
    required: true
  },
  buttonTitle: {
    type: String,
    default: ''
  },
  imageStyle: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style scoped>
.img-button-wrap {
  aspect-ratio: 1/1;
}

.img-button {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  box-shadow: var(--shadow-soft);
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-button:hover {
  cursor: pointer;
  border-color: var(--border-strong);
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

img {
  max-width: 100%;
  max-height: 100%;
  filter: brightness(0.35);
}
</style>

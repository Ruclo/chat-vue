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
  background: rgb(0, 65, 255);
  background: linear-gradient(90deg, rgba(0, 65, 255, 1) 0%, rgba(127, 255, 212, 1) 86%);
  border-radius: 50%;
  border: none;
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.img-button:hover {
  cursor: pointer;
}

img {
  max-width: 100%;
  max-height: 100%;
}
</style>

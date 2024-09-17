<script setup>
import ImgButton from './ImgButton.vue'
import { ref, computed } from 'vue'

const rotate = ref(0)

const imageStyle = computed(() => ({
  transition: 'transform 0.5s ease',
  transform: `rotate(${rotate.value}deg)`
}))
</script>

<template>
  <ImgButton
    imageSrc="/assets/gear.svg"
    buttonTitle="Change profile picture"
    :imageStyle="imageStyle"
    @click="rotate += 180"
  />
</template>

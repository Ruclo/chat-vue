<script setup>
import SessionBar from './SessionBar.vue'
import CreateSessionComponent from './CreateSessionComponent.vue'
import { ref } from 'vue'

const overlayOpen = ref(true)
</script>

<template>
  <SessionBar v-if="haveAnySessions" />
  <div v-else>
    <div>You have no sessions yet</div>
    <CreateSessionComponent v-if="overlayOpen" @close="overlayOpen = false" />
  </div>
</template>

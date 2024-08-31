<script setup>
import { useSessionStore } from '@/stores/SessionStore'
import { defineEmits, ref } from 'vue'
import GeneralOverlay from './GeneralOverlay.vue'
import BorderButton from './BorderButton.vue'

const sessionStore = useSessionStore()

const emits = defineEmits(['close'])

const inputValue = ref('')

function closeOverlay() {
  emits('close')
}

async function handleCreateNewSession() {
  const url = 'https://127.0.0.1:8443/sessions/'
  const opts = {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: inputValue.value })
  }

  const response = await fetch(url, opts)
  if (response.ok) {
    let session = await response.json()
    sessionStore.prependSession(session)
    closeOverlay()
  }
}
</script>

<template>
  <GeneralOverlay>
    <div class="input-label">Session name</div>
    <div class="input-wrap">
      <input
        class="overlay-input"
        v-model="inputValue"
        autocomplete="off"
        placeholder="Enter session name"
      />
    </div>
    <div class="buttons">
      <BorderButton @click="handleCreateNewSession">Create a new session</BorderButton>
      <BorderButton @click="closeOverlay">Close</BorderButton>
    </div>
  </GeneralOverlay>
</template>

<style scoped>
.input-label {
  margin: 1em 1em 0 1em;
  color: white;
  font-weight: bold;
  text-align: center;
}
.input-wrap {
  margin: 0 1em 1em 1em;
  min-width: 200px;
  text-align: center;
}

.overlay-input {
  padding: 0.5em;
  background: #101010;
  border-radius: 1em;
  color: white;
  text-align: center;
  border: none;
}

.buttons {
  margin: 0 1em 1em 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

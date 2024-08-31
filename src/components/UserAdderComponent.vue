<script setup>
import { useSessionStore } from '@/stores/SessionStore'
import { ref, defineEmits } from 'vue'
import GeneralOverlay from './GeneralOverlay.vue'
import BorderButton from './BorderButton.vue'

const sessionStore = useSessionStore()

const emits = defineEmits(['close'])

const inputValue = ref('')

const invalidUser = ref(false)

function closeOverlay() {
  emits('close')
}

async function handleAddUser() {
  const url =
    'https://127.0.0.1:8443/sessions/' +
    sessionStore.getOpenChat.sessionId +
    '/user/' +
    inputValue.value
  const opts = {
    method: 'POST',
    credentials: 'include'
  }

  let response = await fetch(url, opts)

  if (!response.ok) {
    invalidUser.value = true
  } else {
    invalidUser.value = false
    closeOverlay()
  }
}
</script>

<template>
  <GeneralOverlay>
    <div class="input-label">Add user to {{ sessionStore.getOpenChat.sessionName }}</div>
    <div class="input-wrap">
      <input
        class="overlay-input"
        autocomplete="off"
        v-model="inputValue"
        placeholder="Enter a username"
      />
    </div>
    <div class="buttons">
      <BorderButton @click="handleAddUser">Add user</BorderButton>
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
  text-overflow: ellipsis;
  max-width: 400px;
  overflow: hidden;
  white-space: nowrap;
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

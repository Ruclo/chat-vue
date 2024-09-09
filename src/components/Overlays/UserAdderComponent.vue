<script setup>
import { useSessionStore } from '@/stores/SessionStore'
import { ref, defineEmits } from 'vue'
import GeneralOverlay from './GeneralOverlay.vue'
import BorderButton from '../Common/Buttons/BorderButton.vue'

import apiClient from '@/api/apiClient'

const sessionStore = useSessionStore()

const emits = defineEmits(['close'])

const inputValue = ref('')

const invalidUser = ref(false)

function closeOverlay() {
  emits('close')
}

async function handleAddUser() {
  const endpoint = '/sessions/' + sessionStore.getOpenChat.sessionId + '/user/' + inputValue.value

  const response = await apiClient.post(endpoint)

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
  color: white;
  font-weight: bold;
  text-align: center;
  text-overflow: ellipsis;
  max-width: 400px;
  overflow: hidden;
  white-space: nowrap;
}
.input-wrap {
  min-width: 200px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em 0;
  width: 100%;
}
</style>

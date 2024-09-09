<script setup>
import { useSessionStore } from '@/stores/SessionStore'
import { ref } from 'vue'
import GeneralOverlay from './GeneralOverlay.vue'
import BorderButton from '../Common/Buttons/BorderButton.vue'
import apiClient from '@/api/apiClient'

const sessionStore = useSessionStore()

const emits = defineEmits(['close'])

const inputValue = ref('')

function closeOverlay() {
  emits('close')
}

async function handleCreateNewSession() {
  const endpoint = '/sessions/'

  const response = await apiClient.post(endpoint, { name: inputValue.value })
  if (response.ok) {
    let session = await response.json()
    sessionStore.prependSession(session)
    closeOverlay()
  }
}
</script>

<template>
  <GeneralOverlay>
    <div class="input-label">Create a new session</div>
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
  color: white;
  font-weight: bold;
  text-align: center;
}

.input-wrap {
  min-width: 200px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
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

@media (max-width: 800px) {
  .overlay-input {
    width: 100%;
    font-size: 1em;
    height: 1.5em;
  }

  .input-label {
    margin: 0;
  }
  .input-wrap {
    margin: 0;
  }

  .buttons {
    margin: 0;
  }
}
</style>

<script setup>
import { useSessionStore } from '@/stores/SessionStore'
import { computed } from 'vue'
import BorderButton from '../Common/Buttons/BorderButton.vue'
import GeneralOverlay from './GeneralOverlay.vue'
import apiClient from '@/api/apiClient'

const emit = defineEmits(['close'])
const sessionStore = useSessionStore()
const session = computed(() => sessionStore.getOpenChat)

const sessionName = computed(() => session.value.sessionName)

const leaveSession = async () => {
  const endpoint = '/sessions/' + session.value.sessionId + '/leave'

  const response = await apiClient.delete(endpoint)

  if (response.ok) {
    sessionStore.deleteSession(session.value)
    emit('close')
  }
}
</script>

<template>
  <GeneralOverlay>
    <div class="message">Are you sure you want to leave the session {{ sessionName }}?</div>
    <div class="buttons">
      <BorderButton @click="leaveSession">Yes</BorderButton>
      <BorderButton @click="emit('close')">Cancel</BorderButton>
    </div>
  </GeneralOverlay>
</template>

<style scoped>
.message {
  margin: 1em;
  color: white;
  text-align: center;
  text-overflow: ellipsis;
  max-width: 400px;
  overflow: hidden;
  max-height: 100px;
}

.buttons {
  margin: 0 1em 1em 1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
</style>

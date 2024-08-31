<script setup>
import { useSessionStore } from '@/stores/SessionStore'
import { computed } from 'vue'
import BorderButton from './BorderButton.vue'
import GeneralOverlay from './GeneralOverlay.vue'

const emit = defineEmits(['close'])
const sessionStore = useSessionStore()
const session = computed(() => sessionStore.getOpenChat)

const sessionName = computed(() => session.value.sessionName)

const leaveSession = async () => {
  const url = 'https://127.0.0.1:8443/sessions/' + session.value.sessionId + '/leave'
  const opts = {
    method: 'DELETE',
    credentials: 'include'
  }

  const response = await fetch(url, opts)

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
}
</style>

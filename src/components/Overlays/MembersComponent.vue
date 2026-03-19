<script setup>
import { useSessionStore } from '@/stores/SessionStore'
import { reactive, onMounted, ref } from 'vue'
import GeneralOverlay from './GeneralOverlay.vue'
import BorderButton from '../Common/Buttons/BorderButton.vue'
import LoadMoreSentinel from '../Common/LoadMoreSentinel.vue'
import SpinnerComponent from '../Common/SpinnerComponent.vue'
import apiClient from '@/api/apiClient'

const emit = defineEmits(['close'])
const members = reactive([])
const sessionStore = useSessionStore()
let currentPage = 0
const COUNT_PER_FETCH = 10

const moreToFetch = ref(true)
const loading = ref(true)

const fetchMembers = async () => {
  const params = new URLSearchParams()
  params.append('page', currentPage)
  params.append('count', COUNT_PER_FETCH)

  currentPage += 1

  const endpoint =
    '/sessions/' + sessionStore.getOpenChat.sessionId + '/members?' + params.toString()

  const response = await apiClient.get(endpoint)

  if (response.ok) {
    let data = await response.json()
    members.push(...data)
    if (data.length < COUNT_PER_FETCH) {
      moreToFetch.value = false
    }
  }
}

onMounted(async () => {
  await fetchMembers()
  loading.value = false
})
</script>

<template>
  <GeneralOverlay width="300px" height="60%">
    <SpinnerComponent v-if="loading" />
    <div v-else style="display: flex; flex-direction: column; height: 100%; width: 100%">
      <div class="buttons">
        <div class="members-label">Members</div>
        <BorderButton style="margin-left: auto" @click="emit('close')">X</BorderButton>
      </div>
      <div class="members-wrap">
        <div v-for="member in members" :key="member.username" class="member">
          <div class="pfp-wrap">
            <img class="pfp-image" :src="member.pfpUrl" />
          </div>
          <div class="username">
            {{ member.username }}
          </div>
        </div>
        <LoadMoreSentinel @intersect="fetchMembers" v-if="moreToFetch" />
      </div>
    </div>
  </GeneralOverlay>
</template>

<style scoped>
.members-wrap::-webkit-scrollbar {
  width: 6px;
}

.members-wrap::-webkit-scrollbar-track {
  background: transparent;
  margin-bottom: 15px;
}

.members-wrap::-webkit-scrollbar-thumb {
  background: var(--accent-soft);
  border-radius: 999px;
}

.pfp-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.member {
  display: flex;
  color: var(--ink-900);
}

.members-label {
  position: absolute;
  left: 50%;
  color: var(--ink-900);
  transform: translateX(-50%);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.8rem;
}
.buttons {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5em;
}

.pfp-wrap {
  width: 50px;
  height: 50px;
  margin: 0.5em;
}

.username {
  margin: auto 0;
  font-weight: 600;
}
.members-container {
  height: 100%;
  overflow: hidden;
}

.members-wrap {
  overflow-y: scroll;
  padding: 0.5rem;
}
</style>

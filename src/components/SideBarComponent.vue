<script setup>
import { shallowRef } from 'vue'
import UserAdderComponent from './UserAdderComponent.vue'
import CreateSessionComponent from './CreateSessionComponent.vue'
import SquaresComponent from './SquaresComponent.vue'
import LeaveSessionComponent from './LeaveSessionComponent.vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useSessionStore } from '@/stores/SessionStore'
import MembersComponent from './MembersComponent.vue'
import PfpChanger from './PfpChanger.vue'

const authStore = useAuthStore()
const sessionStore = useSessionStore()

const currentOverlay = shallowRef(null)

async function handleLogOut() {
  const url = 'https://127.0.0.1:8443/auth/logout'
  const opts = {
    method: 'POST',
    credentials: 'include'
  }

  let response = await fetch(url, opts)

  if (!response.ok) {
    console.log('an error occured while loging you out')
  }
  authStore.logOut()
}

function closeOverlay() {
  currentOverlay.value = null
}
</script>

<template>
  <div class="sidebar">
    <div class="buttons-container">
      <div class="left">
        <button
          class="btn"
          title="Create a new session"
          @click="currentOverlay = CreateSessionComponent"
        >
          <img src="../assets/plus.svg" />
        </button>

        <button
          v-if="sessionStore.isChatOpen"
          title="Add user to session"
          class="btn"
          @click="currentOverlay = UserAdderComponent"
        >
          <img src="../assets/add.svg" />
        </button>

        <button
          v-if="sessionStore.isChatOpen"
          title="Show chat members"
          class="btn"
          @click="currentOverlay = MembersComponent"
        >
          <img src="../assets/members.svg" />
        </button>
      </div>
      <div class="right">
        <button
          v-if="sessionStore.isChatOpen"
          title="Leave session"
          class="btn"
          @click="currentOverlay = LeaveSessionComponent"
        >
          <img src="../assets/leave.svg" />
        </button>

        <button title="Edit profile" class="btn" @click="currentOverlay = PfpChanger">
          <img src="../assets/edituser.svg" />
        </button>
        <button id="logout-button" title="Log out" class="btn" @click="handleLogOut">
          <img src="../assets/off.svg" />
        </button>
      </div>
    </div>

    <div class="container">
      <SquaresComponent />
      <Transition name="bigbang">
        <component :is="currentOverlay" @close="closeOverlay" />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.bigbang-enter-active,
.bigbang-leave-active {
  transition: all 0.3s ease;
}

.bigbang-enter-from,
.bigbang-leave-to {
  opacity: 0;
  transform: scale(0.3);
}

.buttons-container {
  display: flex;
  justify-content: space-between;
}
.btn {
  margin: 0.5em;
  width: 72px;
  height: 72px;
  background: rgb(0, 65, 255);
  background: linear-gradient(90deg, rgba(0, 65, 255, 1) 0%, rgba(127, 255, 212, 1) 86%);
  border-radius: 50%;
  border: none;
  overflow: hidden;
  cursor: pointer;
}

img {
  height: 100%;
  width: 100%;
}
.container {
  height: 100%;
}

.sidebar {
  border-left: 1px solid black;
  display: flex;
  flex-direction: column;
  position: relative;
}
</style>

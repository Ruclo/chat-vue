<script setup>
import { useAuthStore } from '@/stores/AuthStore'
import { useSessionStore } from '@/stores/SessionStore'
import MobileSideMenu from './MobileSideMenu.vue'
import SessionBar from '../Common/SessionBar.vue'

import LogOutButton from '../Common/Buttons/LogOutButton.vue'
import HamburgerButton from '../Common/Buttons/HamburgerButton.vue'
import RotatingGearButton from '../Common/Buttons/RotatingGearButton.vue'

const authStore = useAuthStore()
const sessionStore = useSessionStore()

const emit = defineEmits(['change-overlay'])

const openSessionBar = () => emit('change-overlay', SessionBar)
const openSideMenu = async () => {
  emit('change-overlay', MobileSideMenu)
}
</script>

<template>
  <div class="chat-header">
    <div class="left">
      <HamburgerButton @click="openSessionBar" />
    </div>

    <div class="middle">
      {{ sessionStore.getOpenChat.sessionName }}
    </div>
    <div class="right">
      <RotatingGearButton @click="openSideMenu" />
      <LogOutButton @click="authStore.logOut" />
    </div>
  </div>
</template>

<style scoped>
.chat-header {
  flex: 0 0 5%;
  min-height: 50px;
  background: #131313;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px;
  width: auto;
  height: auto;
  aspect-ratio: 1 / 1;
}

.left,
.right {
  height: 100%;
  display: flex;
}

.middle {
  color: aquamarine;
  font-size: large;
  text-align: center;
}
.icon {
  height: 100%;
  width: 100%;
}

:deep(.img-button-wrap) {
  padding: 2px;
}
</style>

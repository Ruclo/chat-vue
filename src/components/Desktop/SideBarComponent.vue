<script setup>
import { shallowRef } from 'vue'

import { useAuthStore } from '@/stores/AuthStore'
import { useSessionStore } from '@/stores/SessionStore'

import UserAdderComponent from '../Overlays/UserAdderComponent.vue'
import CreateSessionComponent from '../Overlays/CreateSessionComponent.vue'
import LeaveSessionComponent from '../Overlays/LeaveSessionComponent.vue'
import MembersComponent from '../Overlays/MembersComponent.vue'
import PfpChanger from '../Overlays/PfpChanger.vue'

import SquaresComponent from './SquaresComponent.vue'
import CreateSessionButton from '../Common/Buttons/CreateSessionButton.vue'
import AddUserButton from '../Common/Buttons/AddUserButton.vue'
import ShowMembersButton from '../Common/Buttons/ShowMembersButton.vue'
import LeaveSessionButton from '../Common/Buttons/LeaveSessionButton.vue'
import EditPfpButton from '../Common/Buttons/EditPfpButton.vue'
import LogOutButton from '../Common/Buttons/LogOutButton.vue'

const authStore = useAuthStore()
const sessionStore = useSessionStore()

const currentOverlay = shallowRef(null)

function closeOverlay() {
  currentOverlay.value = null
}
</script>

<template>
  <div class="sidebar">
    <div class="buttons-container">
      <div class="left">
        <CreateSessionButton @click="currentOverlay = CreateSessionComponent" />

        <AddUserButton
          v-if="sessionStore.isChatOpen"
          @click="currentOverlay = UserAdderComponent"
        />

        <ShowMembersButton
          v-if="sessionStore.isChatOpen"
          @click="currentOverlay = MembersComponent"
        />
      </div>
      <div class="right">
        <LeaveSessionButton
          v-if="sessionStore.isChatOpen"
          @click="currentOverlay = LeaveSessionComponent"
        />

        <EditPfpButton @click="currentOverlay = PfpChanger" />

        <LogOutButton @click="authStore.logOut" />
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
.container {
  height: 100%;
}

.left,
.right {
  flex: 0 0 50%;
  display: flex;
  flex-wrap: wrap;
}

.right {
  justify-content: flex-end;
}

:deep(.img-button-wrap) {
  padding: 0.5em;
  min-height: 65px;
  height: 10vh;
}

.sidebar {
  border-left: 1px solid black;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
}
</style>

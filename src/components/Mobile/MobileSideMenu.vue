<script setup>
import { shallowRef, computed } from 'vue'
import CreateSessionButton from '../Common/Buttons/CreateSessionButton.vue'
import CreateSessionComponent from '../Overlays/CreateSessionComponent.vue'
import AddUserButton from '../Common/Buttons/AddUserButton.vue'
import UserAdderComponent from '../Overlays/UserAdderComponent.vue'
import MembersComponent from '../Overlays/MembersComponent.vue'
import ShowMembersButton from '../Common/Buttons/ShowMembersButton.vue'
import EditPfpButton from '../Common/Buttons/EditPfpButton.vue'
import PfpChanger from '../Overlays/PfpChanger.vue'
import LeaveSessionButton from '../Common/Buttons/LeaveSessionButton.vue'
import LeaveSessionComponent from '../Overlays/LeaveSessionComponent.vue'
const emit = defineEmits(['close'])

const currentOverlay = shallowRef(null)
const slideDirection = computed(() => (currentOverlay.value ? 'slide-right' : 'slide-left'))
</script>

<template>
  <div class="overlay-grid">
    <div class="side-menu">
      <CreateSessionButton @click="currentOverlay = CreateSessionComponent" />
      <AddUserButton @click="currentOverlay = UserAdderComponent" />
      <ShowMembersButton @click="currentOverlay = MembersComponent" />
      <EditPfpButton @click="currentOverlay = PfpChanger" />
      <LeaveSessionButton @click="currentOverlay = LeaveSessionComponent" />
    </div>

    <div class="open-overlay-wrap">
      <div @click="emit('close')" class="close-overlay"></div>
      <Transition :name="slideDirection">
        <component @close="currentOverlay = null" :is="currentOverlay" />
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.open-overlay-wrap {
  position: relative;
}
.side-menu {
  height: 100%;
  width: 100%;
  background: var(--color-background-mute);
  display: flex;
  flex-direction: column;
  z-index: 2;
  padding: 2px;
  gap: 10px;
}

.overlay-grid {
  display: grid;
  grid-template-columns: 1fr 8fr;
  height: 100%;
  width: 100%;
}

.close-overlay {
  width: 100%;
  height: 100%;
}
</style>

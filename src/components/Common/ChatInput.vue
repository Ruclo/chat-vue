<script setup>
import { ref, nextTick } from 'vue'
import { useWebSocketConnection } from '@/composables/useWebSocketConnection'

const textArea = ref(null)
const chatInput = ref('')
const { sendMessage } = useWebSocketConnection()

function updateRowCount() {
  if (textArea.value == null) {
    return
  }

  textArea.value.style.height = 'auto'
  const computedStyle = window.getComputedStyle(textArea.value)
  const padding = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)

  const height = textArea.value.scrollHeight - padding
  textArea.value.style.height = height + 'px'
}

async function handleSendMessage() {
  if (chatInput.value.trim() === '') {
    return
  }
  sendMessage(chatInput.value)
  chatInput.value = ''
  await nextTick()
  updateRowCount()
}
</script>

<template>
  <div id="input-container">
    <div class="border">
      <textarea
        placeholder="Send a message"
        @keydown.enter.exact.prevent="handleSendMessage"
        ref="textArea"
        @input="updateRowCount"
        rows="1"
        v-model="chatInput"
        id="chat-input"
      ></textarea>
    </div>
    <button id="chat-button" @click="handleSendMessage">
      <img src="../../assets/send.svg" />
    </button>
  </div>
</template>

<style scoped>
#chat-input {
  font-family: inherit;
  resize: none;
  border: none;
  border-radius: 1em;
  background-image: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(83, 83, 83, 0.9)),
    linear-gradient(135deg, #53c3c3, transparent);
  color: white;
  overflow: hidden;
  font-size: 1.2em;
  padding: 0.2em;
  padding-left: 0.5em;
  box-sizing: content-box;
  flex-grow: 1;
  z-index: 1;
}

#chat-input:focus {
  outline: none;
}

#chat-button {
  margin: 1em;
  margin-left: 0;
  background: none;
  border: none;
  cursor: pointer;
}

#input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  bottom: 0;
  background: #202020;
  border-radius: 1em;
  border: 1px solid black;
  min-height: 4em;
  height: fit-content;
}

.border {
  --border-width: 2px;
  --gradient: linear-gradient(90deg, rgb(0, 65, 255) 0%, rgb(127, 255, 212) 86%);
  margin: 1em;
  position: relative;
  flex-grow: 1;
  display: flex;
}

.border::before {
  content: '';
  position: absolute;
  top: calc(-1 * var(--border-width));
  left: calc(-1 * var(--border-width));
  height: calc(100% + var(--border-width) * 2);
  width: calc(100% + var(--border-width) * 2);
  background: var(--gradient);
  border-radius: 1em;
  z-index: 0;
}
</style>

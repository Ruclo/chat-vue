<script setup>
import { ref, nextTick } from 'vue'
import { useChatApi } from '@/composables/useChatApi'

const textArea = ref(null)
const chatInput = ref('')
const { sendWsMessage } = useChatApi()

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
  sendWsMessage(chatInput.value)
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
      <img src="/assets/send.svg" />
    </button>
  </div>
</template>

<style scoped>
#chat-input {
  font-family: inherit;
  resize: none;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--ink-900);
  overflow: hidden;
  font-size: 1rem;
  padding: 0.6em 0.7em;
  box-sizing: content-box;
  flex-grow: 1;
  z-index: 1;
}

#chat-input:focus {
  outline: none;
}

#chat-input::placeholder {
  color: var(--ink-300);
}

#chat-button {
  margin: 0.75em;
  margin-left: 0;
  background: var(--ink-900);
  border: 1px solid var(--ink-900);
  border-radius: 999px;
  cursor: pointer;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
}

#chat-button:hover {
  background: var(--ink-700);
  border-color: var(--ink-700);
}

#chat-button img {
  filter: brightness(5);
  width: 18px;
  height: 18px;
}

#input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  bottom: 0;
  background: var(--surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  min-height: 3.5em;
  height: fit-content;
  box-shadow: var(--shadow-soft);
}

.border {
  --border-width: 2px;
  --gradient: linear-gradient(120deg, var(--accent) 0%, var(--accent-soft) 100%);
  margin: 0.75em;
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
  border-radius: var(--radius-md);
  z-index: 0;
}
</style>

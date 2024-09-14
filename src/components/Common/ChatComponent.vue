<script setup>
import { watch, ref, computed, nextTick } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useMessageStore } from '@/stores/MessageStore'
import { useSessionStore } from '@/stores/SessionStore'
import MessageComponent from './MessageComponent.vue'
import LoadMoreSentinel from './LoadMoreSentinel.vue'
import ChatInput from './ChatInput.vue'
import Spinner from './SpinnerComponent.vue'

const messageStore = useMessageStore()
const sessionStore = useSessionStore()
const authStore = useAuthStore()

const sessionId = computed(() => sessionStore.getOpenChat.sessionId)

const messages = computed(() => messageStore.getMessages[sessionId.value])

const MIN_CHAT_COUNT = 20

const messageCount = computed(() => (messages.value != undefined ? messages.value.length : 0))

const isLoading = ref(true)

const messagesWrap = ref(null)

const moreMessagesExist = computed(() => messageStore.moreMessagesExist(sessionId.value))

//fetch messages on chat change
watch(
  sessionId,
  async (sessionId) => {
    isLoading.value = true
    if (sessionId != null && moreMessagesExist.value && !messages.value) {
      await messageStore.fetchMessages(sessionId, MIN_CHAT_COUNT)
    }

    isLoading.value = false
    await nextTick()
    if (messagesWrap.value != null) {
      messagesWrap.value.scrollTo(0, messagesWrap.value.scrollHeight)
    }
  },
  { immediate: true }
)

//autoscroll on new message
watch(messageCount, async (count) => {
  if (count < 2) {
    return
  }

  await nextTick()
  const messagesArr = document.querySelectorAll('.message-container')
  const latestMessagePreSend = messagesArr[messagesArr.length - 2]

  if (messagesWrap.value && isElementInView(messagesWrap.value, latestMessagePreSend)) {
    messagesWrap.value.scrollTo(0, messagesWrap.value.scrollHeight)
  }
})

function throttle(func, wait) {
  let called = false
  let lastMessageCount

  return async function (...args) {
    if (!called || lastMessageCount !== messageCount.value) {
      called = true
      lastMessageCount = messageCount.value
      await func.apply(this, args)
      setTimeout(() => {
        called = false
      }, wait)
    }
  }
}

const throttledFetch = throttle(messageStore.fetchMessages, 1000)

async function handleIntersect() {
  const scrollContainer = messagesWrap.value
  const scrollHeight = scrollContainer.scrollHeight

  await throttledFetch(sessionId.value, MIN_CHAT_COUNT)
  await nextTick()

  const newScrollHeight = scrollContainer.scrollHeight
  const heightDifference = newScrollHeight - scrollHeight
  scrollContainer.scrollTo(0, heightDifference)
}

function isElementInView(container, element) {
  const containerRect = container.getBoundingClientRect()
  const elementRect = element.getBoundingClientRect()

  return (
    elementRect.top >= containerRect.top &&
    elementRect.left >= containerRect.left &&
    elementRect.bottom <= containerRect.bottom &&
    elementRect.right <= containerRect.right
  )
}
</script>

<template>
  <div class="chat-component">
    <Spinner v-if="isLoading" />

    <div v-else class="chat">
      <div ref="messagesWrap" class="messages">
        <LoadMoreSentinel @intersect="handleIntersect" v-if="moreMessagesExist" />
        <MessageComponent
          :class="{ 'users-message': message.sender.username == authStore.getUsername }"
          v-for="message in messages"
          :key="message.clientId"
          :sender="message.sender"
          :timestamp="message.timestamp"
          :content="message.content"
        />
      </div>
      <div>
        <ChatInput />
      </div>
    </div>
  </div>
</template>

<style>
.chat {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
}

.chat-component {
  flex-grow: 1;
  overflow: auto;
}

.messages {
  overflow-y: auto;
  padding: 1em;
}

.messages::-webkit-scrollbar {
  width: 3px;
}

.messages::-webkit-scrollbar-track {
  background: black;
}

.messages::-webkit-scrollbar-thumb {
  background: aquamarine;
}
</style>

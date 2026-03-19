<script setup>
const props = defineProps({
  sender: {
    type: Object,
    required: true,
    validator: (value) => 'username' in value && 'pfpUrl' in value
  },

  timestamp: {
    type: String,
    required: true
  },

  content: {
    type: String,
    required: true
  }
})

function formatTimestamp(utcTimestamp) {
  const date = new Date(utcTimestamp)
  const now = new Date()

  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()

  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')

  const isToday =
    day == now.getUTCDate() && month == now.getUTCMonth() && year == now.getUTCFullYear()

  return isToday
    ? `Today at ${hours}:${minutes}`
    : `${hours}:${minutes} ${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`
}
</script>

<template>
  <div class="message-wrap">
    <div class="message-container">
      <div class="message-header">
        <div class="message-timestamp">
          {{ formatTimestamp(props.timestamp) }}
        </div>
        <div class="message-sender">
          {{ props.sender.username }}
        </div>
      </div>

      <div class="message-content">
        {{ props.content }}
      </div>
    </div>

    <div class="pfp-wrap">
      <img class="pfp" alt="profile picture" :src="props.sender.pfpUrl" />
    </div>
  </div>
</template>

<style scoped>
.message-wrap {
  display: flex;
  justify-content: space-between;
  opacity: 0;
  animation: fade 0.2s forwards;
  gap: 0.5rem;
}

@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.pfp-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pfp {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid var(--surface);
  box-shadow: var(--shadow-soft);
}

.message-container {
  flex-grow: 1;
  margin: 0.75em 0.5em;
  padding: 0.75em 1em;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.message-header {
  padding: 0.25em 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid var(--border);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-500);
}

.message-content {
  padding: 0.5em;
  white-space: pre-wrap;
  color: var(--ink-900);
  font-size: 1rem;
}

.users-message .message-content {
  text-align: right;
}

.users-message .message-container {
  border-left: 2px solid var(--accent);
  background: #fdfaf6;
}

.message-timestamp {
  order: 2;
}

.message-sender {
  order: 1;
}
.users-message .message-header .message-timestamp {
  order: 1;
}

.users-message .message-header .message-sender {
  order: 2;
  color: var(--accent-strong);
}

.message-container {
  order: 2;
}

.pfp-wrap {
  order: 1;
}

.users-message .message-container {
  order: 1;
}

.users-message .message-container ~ .pfp-wrap {
  order: 2;
}
</style>

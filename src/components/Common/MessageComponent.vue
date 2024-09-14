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
}

.message-container {
  flex-grow: 1;
  margin: 1em;
}

.message-header {
  padding: 0.5em;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px groove rgb(156, 156, 156);
}

.message-content {
  padding: 0.5em;
  white-space: pre-wrap;
  color: white;
}

.users-message .message-content {
  text-align: right;
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
  color: aquamarine;
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

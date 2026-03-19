<script setup></script>

<template>
  <button class="auth-button">
    <slot> </slot>
  </button>
</template>

<style scoped>
.auth-button {
  width: 100%;
  padding: 12px 16px;
  margin-top: 10px;
  border: 1px solid var(--ink-900);
  border-radius: var(--radius-sm);
  background-color: var(--ink-900);
  color: var(--surface);
  font-size: 0.95rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    transform 0.2s ease;
}

.auth-button:hover {
  background-color: var(--ink-700);
  border-color: var(--ink-700);
  transform: translateY(-1px);
}
</style>

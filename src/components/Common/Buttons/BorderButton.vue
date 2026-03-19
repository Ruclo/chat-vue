<script setup></script>

<template>
  <div class="border">
    <button class="border-btn">
      <slot></slot>
    </button>
  </div>
</template>

<style scoped>
.border {
  --border-width: 2px;
  --gradient: linear-gradient(120deg, var(--accent) 0%, var(--accent-soft) 100%);
  position: relative;
  display: flex;
  width: fit-content;
}
.border-btn {
  z-index: 1;
  cursor: pointer;
  padding: 0.55em 1em;
  background: var(--surface);
  border: 1px solid transparent;
  border-radius: 999px;
  color: var(--ink-900);
  font-weight: 600;
  letter-spacing: 0.02em;
}

.border::before {
  content: '';
  position: absolute;
  top: calc(-1 * var(--border-width));
  left: calc(-1 * var(--border-width));
  height: calc(100% + var(--border-width) * 2);
  width: calc(100% + var(--border-width) * 2);
  background: var(--gradient);
  border-radius: 999px;
  z-index: 0;
}
</style>

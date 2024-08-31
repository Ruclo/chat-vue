<script setup></script>

<template>
  <div class="border">
    <button class="btn">
      <slot></slot>
    </button>
  </div>
</template>

<style scoped>
.border {
  --border-width: 3px;
  --gradient: linear-gradient(90deg, rgb(0, 65, 255) 0%, rgb(127, 255, 212) 86%);
  position: relative;
  display: flex;
  width: fit-content;
}
.btn {
  z-index: 1;
  cursor: pointer;
  padding: 0.5em;
  background: white;
  border: none;
  border-radius: 1em;
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
  z-index: -1;
}
</style>

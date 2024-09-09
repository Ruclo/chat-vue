<script setup></script>

<template>
  <button class="auth-button">
    <slot> </slot>
  </button>
</template>

<style scoped>
.auth-button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  background-color: #1e1e1e;
  color: white;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-button:hover {
  background-color: #49b0b0;
}
</style>

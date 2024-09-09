<script setup></script>

<template>
  <div class="art-container">
    <div class="tree left-tree"></div>
    <div class="tree right-tree"></div>
  </div>
</template>

<style scoped>
.split-screen {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: calc(100vh - 4em);
}

.chat-component {
  height: inherit;
}

.art-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.tree {
  position: absolute;
  bottom: 0;
  width: 2px;
  height: 60%;
  background-color: black;
}

.left-tree {
  left: 25%;
}

.right-tree {
  right: 25%;
}

.tree::before,
.tree::after {
  content: '';
  position: absolute;
  width: 80px;
  height: 2px;
  background-color: black;
}

.tree::before {
  top: 30%;
  left: 0;
  transform: rotate(30deg);
}

.tree::after {
  top: 30%;
  right: 0;
  transform: rotate(-30deg);
}

.tree::before::before,
.tree::after::before,
.tree::before::after,
.tree::after::after {
  content: '';
  position: absolute;
  width: 40px;
  height: 2px;
  background-color: black;
}

.tree::before::before,
.tree::after::before {
  top: -10px;
  left: 10px;
  transform: rotate(-30deg);
}

.tree::before::after,
.tree::after::after {
  top: 10px;
  right: 10px;
  transform: rotate(30deg);
}
</style>

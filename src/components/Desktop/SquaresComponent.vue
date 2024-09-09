<script setup></script>

<template>
  <ul class="background">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
</template>

<style scoped>
@keyframes animate {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 0;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
}

.background {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding-inline-start: 0;
}

.background li {
  position: absolute;
  display: block;
  list-style: none;
  width: 5%;
  height: 5%;
  background: rgba(0, 65, 255, 0.5);
  background: linear-gradient(90deg, rgba(0, 65, 255, 0.5) 0%, rgba(127, 255, 212, 0.5) 86%);
  animation: animate 19s linear infinite;
}

.background li:nth-child(1) {
  left: 73%;
  width: 20%;
  height: 20%;
  bottom: -20%;
  animation-delay: 1s;
}

.background li:nth-child(2) {
  left: 2%;
  width: 15%;
  height: 15%;
  bottom: -15%;
  animation-delay: 3s;
}
.background li:nth-child(3) {
  left: 22%;
  width: 12%;
  height: 12%;
  bottom: -12%;
  animation-delay: 6s;
}
.background li:nth-child(4) {
  left: 12%;
  width: 19%;
  height: 19%;
  bottom: -19%;
  animation-delay: 5s;
}
.background li:nth-child(5) {
  left: 63%;
  width: 11%;
  height: 11%;
  bottom: -11%;
  animation-delay: 16s;
}
.background li:nth-child(6) {
  left: 25%;
  width: 13%;
  height: 13%;
  bottom: -13%;
  animation-delay: 17s;
}
.background li:nth-child(7) {
  left: 51%;
  width: 18%;
  height: 18%;
  bottom: -18%;
  animation-delay: 6s;
}
.background li:nth-child(8) {
  left: 33%;
  width: 16%;
  height: 16%;
  bottom: -16%;
  animation-delay: 11s;
}
</style>

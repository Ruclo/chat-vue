<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import Spinner from './SpinnerComponent.vue'

const username = ref('')
const password = ref('')
const authStore = useAuthStore()
const loading = ref(false)
const minimumDuration = 1500

const sendAuthRequest = async (url, opts) => {
  loading.value = true
  const startTime = Date.now()

  try {
    const response = await fetch(url, opts)

    const elapsed = Date.now() - startTime
    if (elapsed < minimumDuration) {
      await new Promise((resolve) => {
        setTimeout(resolve, minimumDuration - elapsed)
      })
    }

    if (response.ok) {
      const user = await response.json()
      authStore.setUser(user)
    }
  } catch (error) {
    console.error('Authentication error:', error)
  } finally {
    loading.value = false
  }
}

const login = async () => {
  const url = 'https://127.0.0.1:8443/auth/login'
  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username: username.value, password: password.value }),
    credentials: 'include'
  }

  await sendAuthRequest(url, opts)
}

const register = async () => {
  const url = 'https://127.0.0.1:8443/auth/register'
  const opts = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ username: username.value, password: password.value })
  }

  await sendAuthRequest(url, opts)
}
</script>

<template>
  <div class="main-container" v-if="!loading">
    <div class="auth-container">
      <h1>Auth</h1>
      <div class="input-container">
        <fieldset>
          <legend>Username</legend>

          <input
            @keydown.enter="login"
            type="text"
            v-model="username"
            id="username"
            class="auth-input"
            required
          />
        </fieldset>
      </div>
      <div class="input-container">
        <fieldset>
          <legend>Password</legend>

          <input
            @keydown.enter="login"
            type="password"
            v-model="password"
            id="password"
            class="auth-input"
            required
          />
        </fieldset>
      </div>
      <button class="auth-button" @click="login">Login</button>
      <button class="auth-button" @click="register">Register</button>
    </div>
  </div>
  <div class="main-container" v-else>
    <Spinner />
  </div>
</template>

<style>
.auth-input {
  border: none;
  width: 100%;
}

.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212;
}

.auth-container {
  width: 50%;
  max-width: 400px;
  padding: 20px;
  border-radius: 10px;
  background-image: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(83, 83, 83, 0.9)),
    linear-gradient(135deg, #53c3c3, transparent);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  color: white;
  text-align: center;
}

.input-container {
  position: relative;
  margin-bottom: 20px;
}

.auth-input {
  width: 100%;
  padding: 5px;
  background: none;
  color: white;
  font-size: 2em;
}

.auth-input:focus {
  outline: none;
  border-color: aquamarine;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  transition: background-color 5000s ease-in-out 0s;
}

.input-container legend {
  color: aquamarine;
  text-align: left;
  font-size: 14px;
}

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

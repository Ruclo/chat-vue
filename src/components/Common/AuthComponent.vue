<script setup>
import apiClient from '@/api/apiClient'

import { ref } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import Spinner from './SpinnerComponent.vue'
import LegendBorderInput from './LegendBorderInput.vue'
import AuthButton from './Buttons/AuthButton.vue'

const username = ref('')
const password = ref('')
const authStore = useAuthStore()
const loading = ref(false)
const minimumDuration = 1500

const sendAuthRequest = async (endpoint, body) => {
  loading.value = true
  const startTime = Date.now()

  try {
    const response = await apiClient.post(endpoint, body)

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
  const endpoint = '/auth/login'
  await sendAuthRequest(endpoint, { username: username.value, password: password.value })
}

const register = async () => {
  const endpoint = '/auth/register'

  await sendAuthRequest(endpoint, { username: username.value, password: password.value })
}
</script>

<template>
  <div class="main-container" v-if="!loading">
    <div class="auth-container">
      <h1>Auth</h1>

      <LegendBorderInput legend="Username" :onSubmit="login" v-model="username" />
      <LegendBorderInput
        legend="Password"
        inputType="password"
        :onSubmit="login"
        v-model="password"
      />
      <AuthButton @click="login"> Login </AuthButton>
      <AuthButton @click="register"> Register </AuthButton>
    </div>
  </div>
  <div class="main-container" v-else>
    <Spinner />
  </div>
</template>

<style>
.main-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #121212;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  border-radius: 10px;
  background-image: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(83, 83, 83, 0.9)),
    linear-gradient(135deg, #53c3c3, transparent);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  color: white;
  text-align: center;
}
</style>

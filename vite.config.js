import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const keyPath = path.resolve(__dirname, './key.pem')
const certPath = path.resolve(__dirname, './cert.pem')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8000,
    proxy: {
      '/api': {
        target: 'https://chemical-gerladina-ruclo-f549699a.koyeb.app',
        changeOrigin: true,
        secure: true
      }
    }
  }
})

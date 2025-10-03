import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom', // Use JSDOM for browser-like environment
  },
  server: {
    // Only use proxy in development mode, not in Docker
    proxy: process.env.NODE_ENV === 'development' ? {
      '/api': 'http://localhost:3001'
    } : undefined
  }
})
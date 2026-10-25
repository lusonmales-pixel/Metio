import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev proxy: the browser talks to Vite on :5173, Vite forwards /api/*
// to the existing Go backend on :8090. This avoids CORS without touching
// the backend. In production the same /api -> backend proxy must be
// configured on the web server (e.g. nginx).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8090',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})

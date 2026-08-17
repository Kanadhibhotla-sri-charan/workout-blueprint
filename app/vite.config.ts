import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/workout-blueprint/ (a GitHub
  // Pages project page, not a custom domain), so all built asset URLs
  // need this subpath prefix.
  base: '/workout-blueprint/',
  plugins: [react()],
})

import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [], // pure TS tests; avoid React/Vite transforms to keep it simple
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
})


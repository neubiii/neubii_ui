import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Separate from vite.config.ts, which Storybook and Vitest also load.
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/library.ts',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'style',
    },
    rolldownOptions: {
      external: ['vue'],
    },
  },
})

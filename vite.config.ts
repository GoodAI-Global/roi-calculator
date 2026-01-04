import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate recharts into its own chunk (largest dependency)
          charts: ['recharts'],
          // Separate React into its own chunk
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})

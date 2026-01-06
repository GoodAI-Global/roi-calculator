import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate recharts into its own chunk (largest dependency)
          charts: ['recharts'],
          // Separate PDF libraries into own chunk (lazy loaded)
          pdf: ['jspdf', 'html2canvas'],
          // Separate React into its own chunk
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});

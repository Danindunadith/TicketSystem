import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3002', // Replace with your backend URL
        changeOrigin: true,
        secure: false
      }
    }
  }
});
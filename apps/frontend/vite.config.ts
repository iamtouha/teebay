import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API_URL = 'http://localhost:4000';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': API_URL,
      '/graphql': API_URL,
    },
  },
});

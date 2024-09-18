import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 6001, // Defina a porta desejada aqui
  },
  server: {
    host: '0.0.0.0', // Escuta em todas as interfaces
    port: 3000, // Ou qualquer porta desejada
  }
})
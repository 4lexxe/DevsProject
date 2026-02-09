import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174, // Puerto diferente para el dashboard admin
  },

  /* Configuracion de alias */
  resolve: { 
    alias: {
      '@': '/src'
    }
  },

  /* Optimización de dependencias */
  optimizeDeps: {
    include: ['@uiw/react-md-editor'],
    force: true // Forzar re-optimización si es necesario
  }
})

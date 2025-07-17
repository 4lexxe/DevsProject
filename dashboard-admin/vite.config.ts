import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // Puerto diferente para el dashboard admin
  },

  // Configuracion para produccion
  build: {
    outDir: 'dist',
    sourcemap: false, // Deshabilita los sourcemaps para producción
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },

  /* Configuracion de alias */
  resolve: { 
    alias: {
      '@': '/src'
    }
  }
})

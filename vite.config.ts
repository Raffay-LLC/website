import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    babel({ presets: [reactCompilerPreset()] }),
  ],

  build: {
    // Target modern browsers — smaller, faster output
    target: 'es2020',

    // Enable CSS code splitting so each chunk loads only its styles
    cssCodeSplit: true,

    // Raise the warning threshold a bit (default 500 kB)
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // Split vendor chunks so the browser can cache React and icons separately
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'icons'
          }
        },
        // Predictable filenames for long-term caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})

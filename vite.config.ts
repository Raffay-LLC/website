import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],

  build: isSsrBuild
    ? {
        // Build-time prerender bundle, consumed by scripts/prerender.mjs.
        target: 'es2022',
        copyPublicDir: false,
        rollupOptions: {
          output: { entryFileNames: '[name].js' },
        },
      }
    : {
        target: 'es2020',
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
                return 'react'
              }
            },
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
          },
        },
      },
}))

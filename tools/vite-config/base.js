import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'
import { configDefaults } from 'vitest/config'

export default defineConfig(({ command, mode }) => ({
  plugins: [
    react(),
    tsconfigPaths(),
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap'
    })
  ].filter(Boolean),
  build: {
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        }
      }
    }
  },
  test: {
    globals: true,
    css:true,
    environment: 'jsdom', // Simulates the browser environment
    setupFiles: './vitest.setup.ts', // For mocking or setting up test-specific utilities
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'], // Generates coverage reports
    },
    exclude: [...configDefaults.exclude, 'node_modules/**/*'] // Exclude unnecessary files
  },
  setupFiles: './vitest.setup.ts',
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext'
    }
  }
}))

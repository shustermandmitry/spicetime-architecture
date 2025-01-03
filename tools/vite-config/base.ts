import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'
import { configDefaults } from 'vitest/config'

export default defineConfig(({ command, mode }) => ({
  // Plugins
  plugins: [
    react(), // Adds React fast-refresh, JSX, and HMR support
    tsconfigPaths(), // Allows using "paths" defined in tsconfig.json for cleaner imports
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // Displays the bundle size visually as treemap
    })
  ].filter(Boolean),

  // Build-specific settings
  build: {
    sourcemap: true, // Generate full source maps for easier debugging
    outDir: 'dist', // Output directory for the build
    emptyOutDir: true, // Clear the output directory before building
    target: 'esnext', // Use modern JavaScript syntax
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor' // Extract third-party dependencies into a "vendor" chunk
          }
        }
      }
    }
  },

  // Vitest test runner configuration
  test: {
    globals: true, // Use Vitest's global methods (e.g., `it`, `describe`)
    css: true, // Allows testing CSS
    environment: 'jsdom', // Simulates the browser environment for tests
    setupFiles: './vitest.setup.ts', // Runs setup code before tests (e.g., mocking)
    coverage: {
      provider: 'v8', // Use the V8 engine for code coverage
      reporter: ['text', 'json', 'html'] // Generate different formats of coverage reports
    },
    exclude: [...configDefaults.exclude, 'node_modules/**/*'] // Exclude unnecessary files and folders from tests
  },

  // Optimized dependency handling
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext' // Use modern syntax for optimized dependencies
    }
  },
  
  // tsconfig support for IDEs and aliases
  setupFiles: './vitest.setup.ts' // Required for Vitest setup script support
}))
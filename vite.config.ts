import react from '@vitejs/plugin-react'; // React plugin for Vite
import tsconfigPaths from 'vite-tsconfig-paths'; // Support for tsconfig.json path aliases
import * as path from 'path';
import { defineConfig } from 'vite';

// Vite Configuration
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: true, // Generate source maps for better debugging
    outDir: 'dist', // Output directory for built files
    emptyOutDir: true, // Clear the output directory before building
    target: 'esnext', // Target modern JavaScript standards
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // Split vendor code into a separate chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@context": "/src/context", // Alias for context directory
      "@scope": "/src/context", // Alias for scope
      "@components": "/src/components", // Alias for components
      "@utils": "/src/utils", // Alias for utils
      "@models": "/src/models", // Alias for models
    },
  },
  test: {
    globals: true, // Use global APIs like `describe` and `it` without importing
    environment: 'jsdom', // Simulate a browser environment
    setupFiles: path.resolve(__dirname, './vitest.setup.js'), // Setup file for test configuration
    coverage: {
      provider: 'v8', // Collect coverage using V8
      reporter: ['text', 'json', 'html'], // Generate multiple coverage report formats
    },
    exclude: [
      'node_modules', // Exclude node_modules from tests
      'dist', // Exclude built files
      'claude/**/*', // Exclude claude folder
      '.git', // Exclude git folder
      '.cache', // Exclude cache folder
    ],
  },
});
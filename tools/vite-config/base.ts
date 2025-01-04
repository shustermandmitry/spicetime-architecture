import react from '@vitejs/plugin-react' // React plugin for Vite
import tsconfigPaths from 'vite-tsconfig-paths' // Support for tsconfig.json path aliases
import * as path from 'path'

export const baseConfig=({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
  build: {
    sourcemap: true,
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  test: {
    globals: true, // Use global APIs like `describe` and `it` without importing
    environment: 'jsdom', // Simulate a browser environment
    setupFiles: path.resolve(__dirname, './vitest.setup.js'),
    coverage: {
      provider: 'v8', // Collect coverage using V8
      reporter: ['text', 'json', 'html'], // Output coverage reports in multiple formats
    },
    exclude: [
      'node_modules', // Never include test files in node_modules
      'dist',         // Exclude built files
      'claude/**/*',  // Exclude claude folder and all its contents
      '.git',         // Avoid running tests for committed files
      '.cache',       // Exclude caching folders
    ],
  },
});
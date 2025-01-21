import react from '@vitejs/plugin-react'; // React plugin for Vite
import tsconfigPaths from 'vite-tsconfig-paths'; // Support for tsconfig.json path aliases
import * as path from 'path';
import {defineConfig} from 'vite';


const excludePaths = [
  '**/node_modules',
  '**/dist',
  '**/claude/**/*',
  '**/.git',
  '**/.cache/**',
  '**/docs/**/*',
];

// Log the `exclude` paths to ensure they're being applied
console.log("Excluding the following test paths:", excludePaths);
// Vite Configuration
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths({
      ignoreConfigErrors: true,
    }),
  ],
  build: {
    sourcemap: true, // Generate source maps for better debugging
    outDir: path.resolve(__dirname, './dist'), // Output directory for built files
    emptyOutDir: true, // Clear the output directory before building
    target: 'esnext', // Target modern JavaScript standards
    rollupOptions: {
      input: {
        // Define all possible global entry points
        main: path.resolve(__dirname, 'src/index.ts'),
        server: path.resolve(__dirname, 'src/server/index.ts'),
        client: path.resolve(__dirname, 'src/client/index.ts'),
      },
      external: [/.*\.test\.ts$/],// Exclude test files by pattern
      output: {
        manualChunks: (id) => {
          // Split vendor code into a separate chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {

    extensions: ['.js', '.jsx', '.ts', '.tsx'],

    alias: {
      "@context": path.resolve(process.cwd(), "./src/context"), // Alias for context directory
      "@scope": path.resolve(process.cwd(), "./src/context"), // Alias for scope
      "@components": path.resolve(process.cwd(), "./src/component"), // Alias for components
      "@utils": path.resolve(process.cwd(), "./src/utils"), // Alias for utils
      "@models": path.resolve(process.cwd(), "./src/models"), // Alias for models
    },
  },
  test: {
    globals: true, // Use global APIs like `describe` and `it` without importing
    environment: 'jsdom', // Simulate a browser environment
    coverage: {
      provider: 'v8', // Collect coverage using V8
      reporter: ['text', 'json', 'html'], // Generate multiple coverage report formats
    },
    exclude: excludePaths,
    setupFiles: path.resolve(__dirname, "./setupTests.ts") // Path to your setup file
  },
});


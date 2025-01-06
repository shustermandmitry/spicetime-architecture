# **Project Configuration Overview**

This document provides a consolidated overview of your project configuration, including Vite, TypeScript, and Vitest-related files. It explains the purpose and interrelation of each file in a clear and concise manner.

---

## **Vite Configuration**

### **File: `root/tools/vite-config/vite.config.ts`**

This file defines the **base Vite configuration** for building and serving the application, including plugins, optimizations, and test-related settings.

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { visualizer } from 'rollup-plugin-visualizer'
import { configDefaults } from 'vitest/config'

export default defineConfig(({ command, mode }) => ({
  plugins: [
    react(), // Adds React fast-refresh, JSX, and HMR support
    tsconfigPaths(), // Resolves TypeScript path aliases from tsconfig.json
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap' // Generates a treemap visualization of the bundle
    })
  ].filter(Boolean),

  build: {
    sourcemap: true, // Generate source maps for easier debugging
    outDir: 'dist', // Output directory for built files
    emptyOutDir: true, // Removes old files in the output directory before building
    target: 'esnext', // Uses the latest JavaScript syntax
    rollupOptions: {
      output: {
        manualChunks: (id) =>
          id.includes('node_modules') ? 'vendor' : undefined // Chunking third-party dependencies
      }
    }
  },

  test: {
    globals: true, // Enables using global methods in tests like `it` and `describe`
    css: true, // Enables testing styles in your components
    environment: 'jsdom', // Simulates a browser environment for tests
    setupFiles: './vitest.setup.js', // Points to the Vitest setup file
    coverage: {
      provider: 'v8', // Uses V8 for coverage
      reporter: ['text', 'json', 'html'] // Generates text, JSON, and HTML reports
    },
    exclude: [...configDefaults.exclude, 'node_modules/**/*'] // Excludes irrelevant files
  },

  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext' // Ensures dependencies are optimized with modern syntax
    }
  }
}))
```

---

## **Vitest Test Setup**

### **File: `root/tools/vite-config/vitest.setup.js`**

This file initializes **Vitest** with custom behaviors, such as mocking browser APIs, setting globals, or configuring any one-time utilities before tests run.

```javascript
import { vi } from 'vitest'

// Mock browser APIs (e.g., `localStorage`) for tests
vi.stubGlobal('localStorage', {
  getItem: () => null,
  setItem: () => {}
})

// Add more mocks or global configurations as necessary
```

**How It’s Used**:
- Referenced by the `setupFiles` property in `vite.config.ts`, ensuring it runs before any test file:
  ```typescript
  setupFiles: './vitest.setup.js'
  ```

---

## **TypeScript Configuration**

### **File: `root/tools/tsconfig/base.json`**

This file defines reusable TypeScript configuration for the entire project. It's an extendable base intended to be referenced by sub-project configs (via the `extends` key).

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ESNext", // Use the latest JavaScript features
    "lib": ["DOM", "DOM.Iterable", "ESNext"], // Include DOM and modern JS features
    "allowJs": true, // Allows importing and compiling .js files
    "strict": true, // Enforce strict type checking
    "skipLibCheck": true, // Skip type-checking declaration files for performance
    "moduleResolution": "node", // Use Node.js-style resolution for modules
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"] // Map @/* to ./src/* for cleaner imports
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts" // Includes Next.js types
  ],
  "exclude": [
    "node_modules",
    "dist" // Excludes build artifacts and dependencies
  ]
}
```

---

### **File: `tsconfig.node.json`**

A special configuration for TypeScript, scoped specifically to **Node.js contexts**, such as `vite.config.ts`.

```json
{
  "compilerOptions": {
    "module": "ESNext", // Use modern ES modules
    "moduleResolution": "bundler", // Resolves modules optimized for bundlers like Vite
    "allowSyntheticDefaultImports": true, // Eases interoperability with CommonJS modules
    "composite": true, // Enables incremental builds
    "skipLibCheck": true // Speeds up type compilation
  },
  "include": ["vite.config.ts"] // Limits scope to the Vite configuration
}
```

---

## **File Summary**

| **File**                                | **Purpose**                                                                                     |
|-----------------------------------------|-------------------------------------------------------------------------------------------------|
| `tools/vite-config/vite.config.ts`             | Sets up the main Vite configuration, including plugins, build options, and Vitest setup.       |
| `tools/vite-config/vitest.setup.js`     | Configures Vitest by mocking APIs, globals, and defining any setup needed by the test suite.   |
| `tools/tsconfig/base.json`              | Base TypeScript configuration shared across the app and tools.                                 |
| `tools/tsconfig/tsconfig.node.json`     | Specific TypeScript configuration for Node.js environments (used by `vite.config.ts`).         |

---

## **How It All Connects**

1. **Vite Build Process**:
   - `tools/vite-config/vite.config.ts` is the primary configuration for Vite.
   - Plugins like `vite-tsconfig-paths` read the `base.json` file to resolve module aliases (`@/*` => `src/*`).
   - `rollupOptions` enables optimized builds with third-party dependency chunking.

2. **Testing with Vitest**:
   - `tools/vite-config/vitest.setup.js` sets up the environment for all tests, including any necessary global mocks.

3. **TypeScript Composition**:
   - **Base Config** (`tools/tsconfig/base.json`): Shared settings for application-level TypeScript configurations.
   - **Node Config** (`tsconfig.node.json`): Ensures compatibility when Node.js executes Vite config.

---

## **Common Commands**

Here are some commands to work with your setup:

### **Start Development**
```bash
pnpm dev
```

### **Build Production**
```bash
pnpm build
```

### **Run Tests**
```bash
pnpm test
```

---
/**
 * Vitest configuration
 * Location: packages/tools/st-cli/vitest.config.ts
 */
import { defineConfig } from 'vitest/config';
import * as path from 'path';

// Shared exclude paths for maintainability
const BASE_EXCLUDE_PATHS = ['**/node_modules/**', '**/dist/**'];
const COVERAGE_EXCLUDE = [...BASE_EXCLUDE_PATHS, '**/*.test.ts'];

// Alias for code readability and maintainability
const SRC_ALIAS = path.resolve(__dirname, './src');

export default defineConfig({
  test: {
    globals: true, // Use global variables in tests
    environment: 'node', // Run in a Node.js-like environment
    coverage: {
      provider: 'v8', // Test coverage using V8
      reporter: ['text', 'json', 'html'], // Specify coverage report formats
      exclude: COVERAGE_EXCLUDE, // Exclude specific paths from coverage
    },
    include: ['src/**/*.test.ts'], // Include all TypeScript test files in "src/"
  },
  resolve: {
    alias: {
      '@': SRC_ALIAS, // Alias "@" to the "src" directory
    },
  },
});
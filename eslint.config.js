/**
 * @file ESLint configuration for the monorepo project.
 * This file defines the linting rules and environment settings for all packages in the project.
 * Converts to JavaScript to enable dynamic logic and modularity within the config.
 *
 * @type {import('eslint').Linter.Config}
 */

module.exports = {
  // Marks this file as the root ESLint configuration in a monorepo.
  root: true,

  /**
   * Defines the global environments available so ESLint understands the globals.
   * - `browser`: Enables browser globals like `window` and `document`.
   * - `es2022`: Modern JavaScript syntax such as top-level `await`.
   * - `node`: Enables Node.js globals like `global` and `process`.
   * - `jest`: Permits Jest testing functions like `describe`, `test`, etc.
   */
  env: {
    browser: true,
    es2022: true,
    node: true,
    jest: true,
  },

  /** Globals that ESLint should treat as read-only (e.g., for Vitest). */
  globals: {
    vi: "readonly", // Global for Vitest testing framework
  },

  /**
   * Overrides specific settings for certain files or file patterns.
   * Excludes certain directories like `node_modules`, `dist`, or `.cache` during linting.
   */
  overrides: [
    {
      files: ["**/*"],
      excludedFiles: [
        "node_modules/**",
        "dist/**",
        "claude.project/**",
        ".cache/**",
        ".git/**",
      ],
    },
  ],

  /**
   * Base configurations extended from supported ESLint plugins.
   * This ensures React, TypeScript, and Testing Library best practices.
   */
  extends: [
    "eslint:recommended", // Core ESLint recommended rules
    "plugin:testing-library/react", // Testing Library guidelines for React
    "plugin:@typescript-eslint/recommended", // Recommended rules for TypeScript
    "plugin:react/recommended", // React-specific linting rules
    "plugin:react-hooks/recommended", // Rules for React hooks
  ],

  /** Adds additional plugins for functionality, e.g., Testing Library. */
  plugins: ["testing-library"],

  /**
   * ESLint parser definition:
   * - Uses the `@typescript-eslint/parser` to parse TypeScript syntax.
   * - Configured for modern ECMAScript modules and JSX.
   */
  parser: "@typescript-eslint/parser",

  /**
   * Parser options to define the supported syntax and features.
   * - `ecmaVersion`: Enables the use of ES2022+ features.
   * - `sourceType`: Enables the use of ES Modules (`import/export` syntax).
   * - `ecmaFeatures`: Enables parsing of JSX for React.
   */
  parserOptions: {
    ecmaVersion: "latest", // Match modern JS features
    sourceType: "module", // Use ECMAScript modules
    ecmaFeatures: {
      jsx: true, // Parse JSX syntax
    },
  },

  /**
   * React-specific settings:
   * - Auto-detect React version based on the installed React package version.
   */
  settings: {
    react: {
      version: "detect",
    },
  },

  /**
   * Project-specific linting rules to enforce code quality.
   * - Adjust or modify as needed to reflect team preferences or enforce best practices.
   */
  rules: {
    "no-console": "warn", // Warn about `console.log` usage
    "@typescript-eslint/explicit-function-return-type": "off", // Turn off enforced return types
    "@typescript-eslint/explicit-module-boundary-types": "off", // Same for module boundaries
    "@typescript-eslint/no-explicit-any": "warn", // Warn when `any` is used
    "react/react-in-jsx-scope": "off", // Not needed with React 17+
    "testing-library/no-debug": "warn", // Warn if debug() statements are left in tests
    "testing-library/prefer-screen-queries": "error", // Enforce the use of `screen.query` APIs
  },
};
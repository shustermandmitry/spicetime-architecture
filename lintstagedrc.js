/**
 * @file Centralized configuration for formatting and linting commands for use with GitHub Workflows.
 * This configuration replicates the behavior of lint-staged but applies it in CI pipelines.
 * Executes lint/format for only the files changed in each Git push or pull request.
 *
 * @module lintstagedrc
 */

module.exports = {
  // Lint and format JavaScript and TypeScript files
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix", // Fix lint issues with ESLint
    "prettier --write", // Format files with Prettier
  ],
  // Format configuration and documentation files
  "*.{json,md,yml,yaml}": [
    "prettier --write", // Format with Prettier for consistency
  ],
};
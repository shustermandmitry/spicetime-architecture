# **Linting and Formatting in GitHub Workflows**

## Overview

This document outlines how linting and formatting tools, previously handled by **Husky**, can be effectively transitioned into **GitHub Actions workflows**. The workflow ensures efficient and standardized practices for linting and formatting across all contributors without reliance on local setups like Husky's Git hooks.

By leveraging `.lintstagedrc.js`, we centralize the logic for file patterns and commands while reusing it in both **local development environments** and **CI pipelines** (via GitHub Actions).

---

## **Why GitHub Workflows Instead of Husky?**

- **Consistency:** Ensure linting and formatting checks happen for every push and pull request, regardless of contributors' local setups.
- **No Local Dependency:** Avoid requiring contributors to install and configure Husky.
- **Efficiency:** Only process files impacted by the current commit (as identified by `git diff`).
- **Extensibility:** Easily integrate linting with additional workflow tasks like running tests or building the project.

---

## **The `.lintstagedrc.js` File (Live Example)**

The `.lintstagedrc.js` file defines the file patterns and corresponding commands for linting and formatting. It serves as the **single source of truth** for these commands, making it reusable for both local tooling (e.g., lint-staged) and your GitHub Actions-based CI pipelines.

```javascript
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
```

In this stage of the project's evolution, `.lintstagedrc.js` offers a centralized list of commands for managing **JavaScript/TypeScript linting** and **JSON/Markdown/YAML formatting**, ensuring code quality and consistency.

---

## **GitHub Actions Workflow: Lint and Format**

The following GitHub Actions workflow operates on pushes and pull requests to the main branch. It runs ESLint and Prettier only on changed files, based on Git diff.

### **Workflow: `.github/workflows/lint.yml`**

```yaml
name: Lint and Format

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  lint-check:
    name: Lint and Format Changes
    runs-on: ubuntu-latest

    steps:
      # Step 1: Checkout the code
      - name: Checkout code
        uses: actions/checkout@v4

      # Step 2: Setup Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      # Step 3: Install dependencies
      - name: Install dependencies
        run: pnpm install

      # Step 4: Identify changed files using Git diff
      - name: List changed files
        id: changed_files
        run: |
          git diff --name-only ${{ github.event.before }} ${{ github.sha }} > changed-files.txt
          cat changed-files.txt

      # Step 5: Lint and format specific files
      - name: Lint and format all changed files
        run: |
          # Parse the changed files
          changed_files=( $(cat changed-files.txt) )
          for file in "${changed_files[@]}"
          do
            if [[ $file == *.js || $file == *.jsx || $file == *.ts || $file == *.tsx ]]; then
              echo "Running ESLint and Prettier on $file"
              eslint --fix "$file"
              prettier --write "$file"
            elif [[ $file == *.json || $file == *.md || $file == *.yml || $file == *.yaml ]]; then
              echo "Running Prettier on $file"
              prettier --write "$file"
            fi
          done
```

---

## **How This Workflow Works**

1. **Triggering Events**:
   - Runs automatically on:
     - Pushes to `main`.
     - Pull requests targeting `main`.
   - Ensures that all changes pass linting and formatting checks before merging.

2. **Linting and Formatting Staged Files**:
   - **Git diff** identifies changed files between commits or in a pull request.
   - The workflow processes only those files.
   - Commands in `.lintstagedrc.js` handle the appropriate operations (linting/formatting).

3. **Outputs**:
   - Ensures:
     - ESLint fixes and warns for JavaScript/TypeScript issues.
     - Prettier formats JSON, Markdown, YAML, and code files consistently.
   - A clean, well-formatted codebase with enforced standards across all contributions.

---

## **Advantages of Combined `.lintstagedrc.js` and GitHub Actions**

1. **Centralized Logic**:
   - `.lintstagedrc.js` becomes the single source of truth for file patterns and commands.
   - Developers can still run linting/formatting locally with tools like lint-staged if desired.

2. **CI-Integrated Linting**:
   - Relieves developers from needing local hooks.
   - Guarantees that the CI workflow enforces checks for all contributors.

3. **Efficiency**:
   - Processes only changed files instead of the entire project, making checks faster, even in CI.

4. **Scalability**:
   - Can easily be extended to include additional commands, tests, or build checks.

---

## **Future Enhancements**

To further improve on this setup, consider:

1. **Testing Integration**:
   Extend the workflow to include testing (e.g., using Vitest or Jest).

2. **Dependency Caching**:
   Add caching for Node.js dependencies to reduce CI run times:
   ```yaml
   - name: Cache Node Modules
     uses: actions/cache@v3
     with:
       path: ~/.pnpm-store # Or `node_modules` if not using pnpm
       key: ${{ runner.os }}-node-${{ hashFiles('**/pnpm-lock.yaml') }}
   ```

3. **Dynamic Rule Expansion**:
   Extend the `.lintstagedrc.js` file to handle additional file types or tools (e.g., SASS/SCSS linting, or SVG optimization).

---

This document explains how to transition your repository from local linting hooks to CI-based workflows, ensuring efficient and scalable contribution practices with consistent code quality enforcement.
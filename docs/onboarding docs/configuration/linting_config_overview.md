# **Linting Configuration System**

## Overview

This document describes the centralized linting and formatting configuration used in the project, as well as how it integrates with **GitHub Actions workflows** to ensure a consistent and automated code quality process.

---

## **Linting Configuration with `.lintstagedrc.js`**

The `.lintstagedrc.js` file defines the commands for linting and formatting. It simplifies management and provides a single source of truth for file patterns and actions.

### **Configuration Example**

```javascript
/**
 * @file Centralized configuration for formatting and linting commands.
 * Executes lint/format only for the files changed in each Git push or pull request.
 */
module.exports = {
  // Lint and format JavaScript and TypeScript files
  "*.{js,jsx,ts,tsx}": [
    "eslint --fix", // Apply ESLint fixes
    "prettier --write", // Format files with Prettier
  ],
  // Format JSON, Markdown, and configuration files
  "*.{json,md,yml,yaml}": [
    "prettier --write", // Format files with Prettier
  ],
};
```

This configuration uses:

- **ESLint** to fix and check JavaScript/TypeScript files for code quality.
- **Prettier** to format all applicable file types, ensuring consistent styles.

---

## **Integration with GitHub Actions**

The commands in `.lintstagedrc.js` integrate directly into GitHub Actions workflows, ensuring linting and formatting tasks run automatically on every push or pull request.

### **Key Workflow Steps**

1. **Identify Changed Files**:
   GitHub Actions runs `git diff` to detect files that were modified in the current Git push or pull request.

2. **Use `.lintstagedrc.js`**:
   The workflow references `.lintstagedrc.js` to determine the appropriate actions for each file type.

3. **Run Lint/Format Commands**:
   - ESLint runs for JavaScript/TypeScript files.
   - Prettier formats JSON, Markdown, YAML, and other supported files.

---

## **Advantages**

1. **Centralized Commands**:
   - `.lintstagedrc.js` ensures developers and CI systems use the same rules without duplication.
   
2. **Automated Checks**:
   - GitHub Actions guarantees that code quality checks run for all contributions.
   
3. **File-Specific Processing**:
   - Only changed files are linted or formatted, ensuring efficiency and speed.

---

## **How to Modify the Configuration**

To expand or customize the linting system, edit the `.lintstagedrc.js` file. For example, add support for CSS or SCSS files:

```javascript
"*.{css,scss}": [
  "stylelint --fix", // Fix linting issues in CSS/SCSS files
  "prettier --write", // Format CSS/SCSS with Prettier
],
```

---

## **Local Usage**

Although primarily designed for CI pipelines, developers can also use tools like `lint-staged` to lint and format files locally during pre-commit hooks.

To install and use locally:
```sh
pnpm install lint-staged husky
```

Integrate with Husky scripts (optional):
```sh
npx husky add .husky/pre-commit "npx lint-staged"
```

With this setup, the same `.lintstagedrc.js` will run both locally and in CI.

---

## **Summary**

The linting configuration system ensures that all contributors adhere to consistent code quality practices by:

1. Centralizing linting commands in `.lintstagedrc.js`.
2. Automating checks via GitHub Actions.
3. Providing optional pre-commit linting for local use.

This approach balances simplicity, scalability, and efficiency.
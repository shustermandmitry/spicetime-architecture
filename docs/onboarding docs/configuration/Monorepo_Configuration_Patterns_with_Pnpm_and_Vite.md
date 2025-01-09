# Monorepo Configuration Patterns with `pnpm` and Vite

## Overview

This guide discusses various configuration patterns and approaches to managing Vite in a monorepo environment. It
explains the tools and machinery involved, different strategies for building packages and handling configurations, as
well as when and why certain approaches might be suitable.

### **Goal**

- Provide insights into configuring multiple packages in a monorepo environment using `pnpm` and Vite.
- Explore options for centralized, package-specific, and hybrid configuration patterns.
- Highlight the flexibility of the tools (`vite.config.ts`, `process.cwd()`, and `pnpm`) to adapt to specific needs.
- Foster long-term scalability by enabling independent package growth while minimizing complexity.

---

## Configuration Patterns

Below are patterns commonly used for configuring **pnpm + Vite** in multirepository or monorepo-like environments.

---

### **1. Centralized Vite Configuration**

With a shared `vite.config.ts` in the root directory, aliases and settings adjust dynamically based on the current
working directory.

#### **When to Use This Pattern:**

- Best for small, tightly coupled monorepos where consistency is prioritized over package independence.
- Suitable for scenarios that don’t require significant per-package customizations.

#### **Setup Example**:

```typescript
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
    const packageRoot = process.cwd(); // Current package directory.

    return {
        resolve: {
            alias: {
                '@src': path.resolve(packageRoot, './src'),
                '@components': path.resolve(packageRoot, './components'),
                '@shared': path.resolve(__dirname, './shared'), // Shared global alias
            },
        },
    };
});
```

---

### **2. Package-Specific Configuration with Shared Base**

Each package has its own `vite.config.ts`, inheriting from a shared `vite.base.config.ts`.

#### **When to Use This Pattern:**

- Ideal for monorepos needing **package-specific customizations** with shared common settings.
- Good balance for medium-to-large monorepos that combine shared patterns with flexible independence.

#### **Setup Example**:

1. **Shared Base Config (`vite.base.config.ts`):**
   ```typescript
   import path from 'path';

   export const baseConfig = {
     resolve: {
       alias: {
         '@shared': path.resolve(__dirname, './shared'),
       },
     },
   };
   ```

2. **Package-Specific Overrides (`packages/package-a/vite.config.ts`):**
   ```typescript
   import { mergeConfig } from 'vite';
   import baseConfig from '../../vite.base.config';
   import path from 'path';

   export default mergeConfig(baseConfig, {
     resolve: {
       alias: {
         '@src': path.resolve(process.cwd(), './src'),
       },
     },
   });
   ```

---

### **3. Build All Packages with Workspace Scripts**

For orchestrating builds across all workspace packages.

#### **When to Use This Pattern:**

- Recommended for large or highly modular projects where all packages need to be built together.

#### **Setup**:

1. **Workspace Configuration (`pnpm-workspace.yaml`):**
   ```yaml
   packages:
     - "packages/*"
   ```

2. **Add `build` Script to `package.json` for Each Package:**
   ```json
   {
     "scripts": {
       "build": "vite build"
     }
   }
   ```

3. **Root `package.json` to Handle All Builds:**
   ```json
   {
     "scripts": {
       "build": "pnpm -r run build"
     }
   }
   ```

---

### **4. Shared TypeScript Configuration**

To avoid repetitive path aliases and settings, centralize shared TypeScript configurations in the root `tsconfig.json`.

#### **Setup Example**:

1. **Root TypeScript Config (`tsconfig.json`):**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@shared/*": ["shared/*"]
       }
     }
   }
   ```

2. **Per-Package Overrides:**
   ```json
   {
     "extends": "../../tsconfig.json",
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@src/*": ["src/*"]
       }
     }
   }
   ```

---

## Choosing the Right Pattern

| **Scenario**                         | **Recommended Pattern**                                    |
|--------------------------------------|------------------------------------------------------------|
| Small monorepo, shared config only   | Centralized `vite.config.ts`.                              |
| Packages needing flexibility         | Package-specific `vite.config.ts` extending a common base. |
| Build all packages automatically     | Workspace-wide scripts using `pnpm -r run build`.          |
| Define shared paths and dependencies | Centralized root `tsconfig.json`.                          |
| Highly independent packages          | Isolated configs without shared dependencies.              |

---

## Addendum: Understanding Path Resolution

Path resolution is foundational for all aliasing and tooling setups in projects. Here’s a concise breakdown:

### **How Path Resolution Works**

1. **Relative Paths**:
    - Begin with `./` or `../`, resolving relative to the file’s location.
    - Example: `import helper from './utils/helper'`.

2. **Absolute Paths**:
    - Start from the root of the filesystem, like `/home/project/src`.
    - Rarely used for portability concerns.

3. **Aliases**:
    - Custom paths mapped to directories via `vite.config.ts` or `tsconfig.json`.
    - Example alias in `vite.config.ts`: `@src` → `/src`.

4. **Node.js Module Resolution**:
    - When no relative or absolute paths match, Node.js searches for modules in `node_modules`.

---

### **Key Path Utilities**

| **Utility**         | **Purpose**                                                            | **Example**                                                                     |
|---------------------|------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **`path.resolve`**  | Resolves paths into an absolute file path, combining segments.         | `path.resolve('/root', './src')` → `/root/src`                                  |
| **`process.cwd()`** | Returns the *current working directory* at runtime.                    | `process.cwd()` → `/absolute/path/to/current/directory`                         |
| **Glob Patterns**   | Matches files or directories using wildcards (`**/*`).                 | Example: Find all `.ts` files → `glob.sync("**/*.ts", { cwd: process.cwd() })`. |
| **Alias Configs**   | Simplifies imports with predefined mappings (`vite`, `tsconfig.json`). | `@src/helper` → `/absolute/path/src/helper`.                                    |

---

### **Comparison of Techniques**

| **Technique**       | **Best Use Case**                                                                            |
|---------------------|----------------------------------------------------------------------------------------------|
| **`path.resolve`**  | Consistently building absolute paths when known base paths (e.g., root) are required.        |
| **`process.cwd()`** | Adapting paths dynamically to different working environments (e.g., per-package resolution). |
| **Aliases**         | Improving readability, portability, and reducing relative path complexity.                   |
| **Glob Patterns**   | Pattern-matching files or directories for bulk operations.                                   |

---

### **Best Practices**

1. Centralize path handling strategies based on your project’s size and requirements.
2. Adopt aliases early to minimize brittle relative paths.
3. Use `path.resolve` for deterministic builds, and `process.cwd()` for dynamic resolutions.

---

## Summary

Path resolution is a vital aspect of organizing files, managing dependencies, and ensuring consistent behavior across
packages. By following the patterns and utilities outlined in this guide, you can enable both the flexibility and
scalability required for your specific project setup.
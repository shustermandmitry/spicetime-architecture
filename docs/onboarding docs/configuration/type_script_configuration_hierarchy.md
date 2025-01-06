# TypeScript Configuration and Environment Framework for Universal Applications

## Overview

This documentation outlines how to structure, organize, and manage TypeScript configuration for universal applications that target **multiple environments**, such as Node.js and the browser. The goal is to maintain clarity, consistency, and scalability across packages using **TypeScript** and **TypeDoc**.

---

## 1. Goals

- Define a streamlined and consistent **TypeScript configuration framework** for managing universal applications.
- Centralize default/common configurations while enabling environment-specific needs and local overrides.
- Optimize for scalability in monorepos with multiple packages (e.g., `server`, `client`, and `shared`).
- Automate package creation using predefined templates to ensure consistency and speed.
- Create structured documentation to provide insights into how configurations are managed.

---

## 2. Design Components

To address diverse requirements in a scalable and maintainable way, the configuration system follows a **hierarchical structure** with centralized TypeScript configurations that support **environment-specific extensions**.

### 2.1. Key Configurations

1. **Root TypeScript Configuration (`tsconfig.json`)**:
   - Contains base settings that are shared across the entire project (Node.js + browser).

2. **Environment-Specific Configurations**:
   - `tsconfig.node.json`: Fine-tuned for backend and server-side builds.
   - `tsconfig.web.json`: Fine-tuned for frontend/browser builds.

3. **Per-Package Overrides**:
   - Each package includes its own `tsconfig.json` that extends the shared and environment-specific configs.

4. **Templates for New Packages**:
   - A standardized folder structure and pre-built configurations reduce effort and help maintain uniformity when adding new packages.

---

## 3. Directory Structure

The following directory layout ensures the project is modular, scalable, and clean:

```plaintext
root/
├── tsconfig.json             # Root config for shared/default behavior
├── tsconfig.node.json        # Node.js-specific extensions
├── tsconfig.web.json         # Browser-specific extensions
├── dist/                     # Compiled distribution for all environments
│   ├── node/
│   └── web/
├── packages/                 # All packages in the monorepo
│   ├── shared/               # Shared utilities
│   │   ├── src/
│   │   └── tsconfig.json     # Local override for shared logic
│   ├── client/               # Frontend app
│   │   ├── src/
│   │   └── tsconfig.json     # Local override blending root & web-specific
│   ├── server/               # Backend app
│       ├── src/
│       └── tsconfig.json     # Local override reflecting root & node-specific
├── template/                 # Template for automating new package creation
├── scripts/                  # Automation and build scripts
└── README.md                 # General documentation
```

---

## 4. Hierarchy of TypeScript Configurations

The configuration system uses **inheritance** across three levels:

### 4.1. Root Configuration (`tsconfig.json`)

The root TypeScript configuration file provides defaults that all packages inherit.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "declaration": true
  },
  "include": ["packages/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

- Applies to **all packages**.
- Defines sane defaults for both **Node.js** and **Browser** builds.

---

### 4.2. Environment-Specific Configurations

#### Example: `tsconfig.node.json`

For **Node.js Runtime Environments**:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "CommonJS",
    "lib": ["ES2022"],
    "types": ["node"],
    "outDir": "dist/node"
  },
  "include": ["server/**/*", "shared/**/*"]
}
```

Features:
- Ensures **CommonJS compatibility** for backend scripts.
- Includes `node` typings.
- Focuses on backend and SSR tasks.

#### Example: `tsconfig.web.json`

For **Browser Environments**:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "module": "ESNext",
    "lib": ["DOM", "ES2022"],
    "types": ["browser"],
    "outDir": "dist/web"
  },
  "include": ["client/**/*", "shared/**/*"]
}
```

Features:
- Supports **modern module systems** (ESModules).
- Encourages modern browser compatibility (e.g., DOM typings).
- Designed for client-side build tools.

---

### 4.3. Local Overrides for Packages

Each package contains its own `tsconfig.json` that extends the appropriate environment-specific configuration and customizes options as needed.

Example: `packages/server/tsconfig.json`

```json
{
  "extends": "../../tsconfig.node.json",
  "compilerOptions": {
    "outDir": "../../dist/server"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

Example: `packages/client/tsconfig.json`

```json
{
  "extends": "../../tsconfig.web.json",
  "compilerOptions": {
    "outDir": "../../dist/client"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 5. Automating Package Creation

### 5.1. Template Folder

The `template` folder provides the boilerplate files required for creating a new package. It includes:
- `src/index.ts`: Starter code.
- `tsconfig.json`: Extends the appropriate base configuration for the environment.
- `package.json`: Includes package-specific metadata and base dependencies.

### 5.2. Automation Workflow

An automated workflow leverages the `template` directory, copying it for new packages while modifying `tsconfig.json` to extend the proper TypeScript configuration (e.g., `node` or `web`). This approach minimizes manual errors and ensures consistency across packages.

---

## 6. Documenting Configurations

Structured documentation defines how the various TypeScript configurations—root, environment-specific, and package-level—work together to streamline both runtime environments and developer productivity.

### 6.1. Root Configurations

Centralized settings in `tsconfig.json` define the foundation on which the entire system is built. They work as the default across projects to ensure maximum compatibility and uniformity.

### 6.2. Environment-Specific Configurations

Configs such as `tsconfig.node.json` and `tsconfig.web.json` provide domain-specific adjustments:
- Node.js uses features like `CommonJS` for compatibility, while Browser builds emphasize `ESModules`.
- Adjustments to libraries (`lib`) match each environment's needs.

### 6.3. Package-Level Overrides

Each package’s `tsconfig.json` inherits shared configurations and environment settings while also defining its specific requirements. Adjustments for output directories (`outDir`) or included files streamline each package's responsibilities within the larger application architecture.

---

## 7. Summary

By combining **root-level configs**, **environment-specific extensions**, and **package-level overrides**, this configuration system achieves:
- Consistency across environments (Node.js, Browser) with minimal duplication.
- Scalability for large **monorepos** and **universal applications**.
- Ease of onboarding through predefined templates and harmonious configurations.
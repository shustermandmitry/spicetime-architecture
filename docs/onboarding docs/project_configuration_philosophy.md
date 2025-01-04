# **Project Configuration Philosophy**

## **Overview**

This document outlines the philosophy, motivation, and benefits behind the centralized configuration approach used in
this project. By simplifying and centralizing configs for key tools like ESLint, TypeScript, Vite, and others, this
approach aims to enhance developer productivity, maintain consistency, and eliminate the hidden pitfalls of scattered or
complex configurations.

Our goal is a **clear, efficient, and predictable developer experience**.

---

## **Philosophy**

### **1. Centralization Over Fragmentation**

All shared development and build tool configurations are stored at the **root of the repository**. There are no hidden,
scattered, or extendable configurations buried in sub-packages by default. Centralization ensures a single source of
truth for tooling rules, reducing cognitive overhead and debugging time.

### **2. Visible, Predictable Configurations**

By keeping configurations visible, new and existing developers can easily inspect and understand how tools like ESLint,
TypeScript, or Vite are set up. There are no surprises when debugging or updating. Clear and predictable setups prevent
rules or behaviors from "biting back" unexpectedly during development.

### **3. Lightweight Customization**

While centralization is the default, the system still allows **package-specific overrides** where necessary. These
overrides are explicitly handled via extensible mechanisms (e.g., `extends` in TypeScript or `mergeConfig` in Vite),
ensuring that the relationship between the root configuration and local adjustments remains clear and intentional.

---

## **Motivations**

### **1. Avoid Hidden Traps** 🕵️‍♂️

- Scattered configs in a monorepo create debugging nightmares when a config hidden somewhere deep in the folder
  structure overrides or contradicts global defaults.
- Developers new to the project could waste hours wondering why a tool behaves differently in one package vs. another.

### **2. Streamline Maintenance** 🔧

- Updating multiple configurations across packages is error-prone and time-consuming. A single root configuration file
  ensures that changes are applied project-wide with minimal effort.

### **3. Improve Onboarding Time** 🚀

- New team members can dive into the project without needing to decipher or track down how each individual package is
  configured.
- A centralized philosophy fosters **immediate clarity** so developers can focus on building features instead of
  fighting configurations.

### **4. Standardize Best Practices** ✨

- Root-level configs enforce **uniform tooling standards** across packages, ensuring everyone writes code that adheres
  to shared rules.
- This prevents drift in development practices, even as the team grows or the project scales.

### **5. Reduce Tool Conflicts** 🔒

- Scattered configs can lead to conflicting or out-of-sync tool behavior, especially when using tools that depend on
  inter-package builds (e.g., TypeScript project references). Centralization eliminates these issues.

---

## **Implementation**

### **1. Centralized Config Files**

All shared tooling configurations are located at the **root of the repository** and apply universally to all packages in
the monorepo.

| **Tool**   | **Config Path**   | **Purpose**                                  |
|------------|-------------------|----------------------------------------------|
| ESLint     | `/.eslintrc.json` | Centralized linting rules for all packages.  |
| TypeScript | `/tsconfig.json`  | Shared compiler options for all TS projects. |
| Vite       | `/vite.config.ts` | Shared Vite build settings for all packages. |

Each package automatically inherits these configurations unless explicitly extended or overridden.

### **2. Package-Specific Adjustments**

If a package has unique requirements, it can extend or modify the root configuration.

- **TypeScript**: Use `extends` in a sub-package `tsconfig.json` to inherit and tweak the root rules.
- **Vite**: Use `mergeConfig` in a local `vite.config.ts` to modify the shared Vite settings.
- **ESLint**: Add a lightweight `.eslintrc.js` that extends the root config if package-level overrides are required.

**Example: Extending the Root Configs**

```json
// tsconfig.json in a sub-package
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

```typescript
// vite.config.ts in a sub-package
import { defineConfig, mergeConfig } from 'vite';
import baseConfig from '../../vite.config';

export default mergeConfig(baseConfig, defineConfig({
  build: {
    lib: { entry: './src/index.ts' }
  },
}));
```

### **3. Linting Command**

From the root of the repository, you can lint all files across all packages with a single command:

```bash
pnpm run lint
```

The linting command is configured in the root `package.json`:

```json
"lint": "eslint './packages/**' --ext .js,.ts,.tsx"
```

---

## **Advantages**

### **1. Consistency Across the Codebase**

All packages follow the same rules and conventions, minimizing discrepancies and surprises during development or review.

### **2. Clarity for Onboarding**

New team members can understand the configurations by simply reviewing the root files—they don't need to dig into each
package to figure out what’s happening.

### **3. Faster Maintenance**

Updates to rules or standards, like adding a new ESLint plugin or enabling a TypeScript compiler option, affect the
entire monorepo instantly without having to modify each package individually.

### **4. Avoids Redundancy**

Eliminates duplication of configuration logic across packages, keeping the codebase DRY.

### **5. Customizability Where Needed**

Packages can still tailor their tool configurations in **clear, explicit, and isolated files**, without affecting global
behavior or creating unforeseen conflicts.

---

## **Key Takeaways**

### 1. **Centralization is Default**

Tools like ESLint, TypeScript, and Vite use a single, root-level configuration that applies universally unless
explicitly overridden.

### 2. **Overrides are Explicit**

Any package-specific adjustments are clearly and intentionally handled using `extends` (TypeScript, ESLint) or
`mergeConfig` (Vite).

### 3. **Benefits to the Team**

- Faster onboarding, easier debugging, and consistent behavior.
- Less cognitive overhead maintaining multiple, scattered configurations.

---

## **For New Team Members: What You Need to Know**

### **Do I need to configure anything?**

No. All shared configuration is handled at the root of the project. You only need to extend configs if your package has
unique requirements.

### **How do I extend a configuration?**

Follow the examples provided in this document using `extends` (TypeScript, ESLint) or `mergeConfig` (Vite).

### **What commands should I know about?**

Use the root scripts (`pnpm run lint`, `pnpm start`, etc.). These are designed to work across the entire monorepo,
streamlining your development workflow.

---

By following this philosophy, our development process becomes more **consistent, maintainable, and predictable**,
ensuring that everyone can focus on building great software rather than wrestling with hidden and fragmented
configuration issues.
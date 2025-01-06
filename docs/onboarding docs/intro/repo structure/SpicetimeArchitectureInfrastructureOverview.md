# Spicetime Architecture: Infrastructure Overview and Roadmap

## 1. Overview

The `spicetime-architecture` monorepo supports the development of a React-based SaaS app (`spicetime-react-app`) and its ecosystem. The repository harmonizes modularity, context-driven architecture, and tools for efficient development workflows, documentation automation, and testing.

The infrastructure caters to:
- **Modular development** of reusable React components.
- **Context-driven scopes** for organizing domain knowledge and linking context hierarchies with documentation.
- **Advanced documentation pipelines** using multiple tools—`TypeDoc`, `C4Builder`, `Mermaid`, `GraphQL Docs`, `Redoc`, and others.
- **Future expansion** with scalability and tooling flexibility in mind.

---

## 2. Existing Repo Structure

The current repository structure is designed for modularity and organized documentation aggregation. Future expansions will adhere to this structure while adding domain hierarchies and organized `scope` for linking components, routes, and documentation.

(insert folder structure)

---

## 3. Key Commands and Workflows

### **Build and Dev Commands**
- **Development:** `turbo run dev` – Runs the development tasks across packages.
- **Testing:** `turbo run test` – Executes tests (e.g., Vitest-based test runner).
- **Clean:** `turbo run clean` – Cleans output directories.

---

### **Docker Commands**
- **Build All Docker Images:** `docker:build:all` – Builds both dev and test environment containers.
- **Run Development Environment:** `docker:dev` – Spins up containers for local dev.
- **Stop All Running Docker Containers:** `docker:down` – Stops both dev and test containers.

---

### **Documentation Commands**

The documentation pipeline orchestrates various tools using structured commands. These include:

#### **Generation**
- **API Docs:** `docs:generate:api` – Uses `typedoc` to generate TypeScript API documentation.
- **GraphQL Docs:** `docs:generate:graphql` – Generates GraphQL-related documentation.
- **OpenAPI Docs:** `docs:generate:openapi` – Bundles OpenAPI specs using `redoc-cli`.
- **Diagrams:** `docs:generate:diagrams` – Uses `c4builder` and `mermaid` for visual diagrams.

#### **Validation**
- **Markdown Linting:** `docs:validate:markdown` – Uses `markdownlint-cli` to check for markdown errors.
- **Link Validation:** `docs:validate:links` – Validates all internal/external markdown links.

#### **Gatsby Docs**
- **Docs Development:** `docs:dev` – Runs `gatsby develop` to serve the docs locally.
- **Docs Build:** `docs:build` – Builds Gatsby docs for production hosting.
- **Docs Serve:** `docs:serve` – Serves the Gatsby-built production site.

#### **Aggregation**
- **Docs Aggregation:** `aggregate` – Uses `utils/aggregatorUtils.js` to link and format docs.

---

## 4. Roadmap

This roadmap ensures the infrastructure can scale and evolve while remaining compatible with the existing ecosystem and tooling.

### **4.1. Modular TypeScript Configurations**
- **Goal:** Split TypeScript configurations to support multiple environments.
- **Steps:**
    - Create `ts.base.config.json` for shared settings (e.g., strictness, paths).
    - Extend the base for Node (`ts.node.config.json`) and Web (`ts.web.config.json`).
    - Update per-package `tsconfig.json` to use the appropriate base.

**Proposed Structure:**

root/ts.base.config.json # Shared config 
* ts.node.config.json # Node overrides
* ts.web.config.json #web overrides

---

### **4.2. Refined Documentation Workflow**
Enhance the documentation pipeline by expanding support for new tools.

#### Tools Involved:
1. **TypeDoc**: Generate TypeScript API docs.
2. **C4Builder/Mermaid**: Create architecture diagrams and flow visuals.
3. **GraphQL Docs**: Automatically document GraphQL schemas and queries.
4. **Redoc**: Document RESTful APIs using OpenAPI specs.
5. **Markdown Validation**: Lint and validate markdown formatting and links.

---

### **4.3. Scopes and Domain Hierarchies**
Introduce a **scope mechanism** to semantically link:
- React components (e.g., via `packages/components/scope/`).
- Documentation (e.g., routes tied to their components/scopes under `docs/routes/`).
- Context objects (`context.ts`) for state or data sharing across the hierarchy.

---

### **4.4. Future Expansions**
- **Toolchain Enhancements:** Add plugins or tools as needed (e.g., Gatsby plugins for advanced routing, analytics).
- **Testing Workflow:** Expand Vitest and MSW integration to improve mock testing coverage.

---

## 5. Immediate Action Items

1. **Organize TypeScript configs**:
    - Split `tsconfig.json` per the proposed structure (`base`, `node`, `web`).

2. **Streamline Vite Setup**:
    - Align `vite.config.ts` with future expansions (ESM target, shared configs).

3. **Enhance Doc Aggregation**:
    - Update `utils/aggregatorUtils.js` to properly link `scope` files.
    - Create a draft structure for `scope` linking between `docs/routes/*` and components.

4. **Validate Current Docs**:
    - Run `docs:validate:*` and fix outstanding lint or link issues, ensuring aggregation works seamlessly.

---

## 6. Summary

This document consolidates the current structure and workflows while defining a pathway toward future expansions. With enhancements to TypeScript configurations, Vite setup, documentation pipelines, and scope mechanisms, the infrastructure will scale to support new features with ease.

---

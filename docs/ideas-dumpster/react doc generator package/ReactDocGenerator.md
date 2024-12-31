# React Doc Generator

## **Package Overview**

The `react-doc-generator` package is a **self-contained, reusable package** designed to generate documentation React components, along with **routers and sub-routers** to organize and ship documentation content to its foster destinations efficiently. It integrates directly into the project workflow, generating documentation dynamically **at build time** with high modularity and alignment to modern bundling tools like `vite`.

> **Core Philosophy**: No more chaotic, piecemeal crawling and manual collection of documentation crumbs—we're building an organic, cohesive system that organizes and structures all documentation automatically. This is where clients hand over their **firstborn configurations (schema, queries, file definitions, etc.)** into a structured foster care system that arranges components, routes, and destinations seamlessly.

---

## **Package Goals**

1. **Self-Contained Package**:
   - The `react-doc-generator` is completely encapsulated and exports all **doc-generator components** as compound React components.
   - Each component is flexible and accepts a clearly defined configuration file or GraphQL schema as props.

2. **Modular Design**:
   - Compound components are **tree-structured**, handling individual aspects of documentation but passing processed configurations to child components.
   - Supports the addition of routers and sub-routers that define preset routing flows for specific doc generation workflows or external tool integrations.

3. **Routing System**:
   - Nested routers automatically generate routes from the internal tree structure of components.
   - Used by packages across the monorepo to manage documentation entries for tools like **Typedoc**, **Gatsby**, **Mermaid**, and custom tools.

4. **Vite-Optimized Build Process**:
   - Built and executed **at documentation generation time during the workflow**—only when necessary to avoid redundant builds. Includes potential caching for performance optimization.
   - Vite handles recompilation and build triggers based on changes.

5. **Pluggable and Extendable**:
   - Allows for future documentation types to be added easily (REST APIs, workflows, pipelines).
   - Provides hooks or plugin points for extending functionality, styles, and destinations without modifying the core structure.

---

## **Design and Implementation**

### **1. Components**

The package primarily exports compound React components that **consume configuration files/schemas as props**, process them internally, and propagate them as digested, structured data to their child components.

**Core Components:**
- **`GQLDoc`**:  
  - Generates documentation for GraphQL schemas, queries, and mutations.
  - Accepts a `GraphQLSchema`, compiled query modules, SDL strings, or introspection outputs as props.
  - Features:
    - Supports linkable schema relationships and nested type navigation.
    - Processes Markdown for descriptions.

- **`APIDoc`** (Future Work):  
  - Handles REST API documentation based on OpenAPI specs or custom config files.
  - Generates routers and endpoints, embedding sample requests and responses.

- **`MermaidDoc`**:
  - Generates documentation and diagrams leveraging **mermaid.js** for visual representations.

Each compound component has **the following modular structure**:
- Provides high-level parsing/processing of data passed via props.
- Propagates the processed data to a logical tree of child components.
- Child components render specific sections of the documentation, improving readability and maintainability.

---

### **2. Configuration File Passing**

All components in the package respect the design principle of **top-level configuration that maps to hierarchical documentation outputs**.

Props for each compound component vary based on type:

For example, the GQLDoc configuration file structure may look like this:
```ts
type GQLDocConfig = {
  schema?: GraphQLSchema;  // GQL schema object
  queries?: string;        // Module or individual query definitions
  theme?: "light" | "dark";
  cacheKey?: string;       // Optional key for cache validation
};
```

Other doc generators like `APIDoc` or `MermaidDoc` will follow similar models tailored to their use cases.

---

### **3. Routers and Sub-Routers**

#### **Purpose:**
- Manage routes and foster destinations for documentation types across the monorepo.
- Organize routes based on **preset patterns and use cases**.
- Push routes dynamically during the build step.

#### **Tree-Based Router System:**
Routers work as a **tree structure** where parent routers collect all the children routes built by the components. This ensures every documented section finds its place without explicit manual intervention.

```tsx
import { createMainRouter, SubRouter } from "react-doc-generator/router";

const mainRouter = createMainRouter();

// Sub-router for Typedoc
const typedocRouter = SubRouter.create({
  pattern: "/typedoc/*",
  children: <TypedocComponent />
});

// Sub-router for Gatsby
const gatsbySubRouter = SubRouter.create({
  pattern: "/gatsby-docs/*",
  children: <GatsbyComponent />
});

// Add them to the main router
mainRouter.add(typedocRouter);
mainRouter.add(gatsbySubRouter);
```

During execution, these routers will dynamically organize, assign, and build **all routes** within individual packages.

---

### **4. Execution Timing**

The `react-doc-generator` is executed at *doc generation time* in the workflow. Here's how it integrates:

1. Triggered during **build or compilation** (via `vite` pipeline).
2. The package **detects changes** in relevant files/configurations to rebuild only if new documentation is required (leveraging hashing and cache keys for verification).
3. Dynamically embeds the generated documentation into the appropriate package or entry point across the monorepo.

### **5. Vite Integration**

The package uses Vite to handle bundling, building, and hot-reload capabilities (if needed for local previews).

- Vite ensures production builds are as fast as possible.
- Its cache system prevents unnecessary rebuilds unless specific changes are detected.

---

## **Usage**

1. **Installation**
   Add the package to your monorepo:
   ```bash
   npm install react-doc-generator
   ```

2. **Components**
   Import any doc-generating components as needed:
   ```tsx
   import { GQLDoc, APIDoc, MermaidDoc } from "react-doc-generator";

   <GQLDoc schema={schema} theme="dark" />;
   ```

3. **Router Integration**
   In any package:
   ```tsx
   import { SubRouter } from "react-doc-generator/router";

   <SubRouter pattern="/docs/*">
     {/* Add relevant children */}
   </SubRouter>;
   ```

4. **Caching (Optional but Recommended)**
   Pass caching keys or cache handlers for efficient recompilation:
   ```tsx
   <GQLDoc schema={schema} cacheKey="my-schema-v1" />;
   ```

---

## **Future Extensions**

1. **Additional Documentation Types**:
   - REST APIs, workflows/pipelines, etc.
2. **Enhanced Tree Router**:
   - Auto-generate routing based on component structures dynamically.
3. **Stateful Execution**:
   - Maintain a central context aware of all monorepo requirements for intelligent routing.

---

This package ensures that clients **submit their firstborn configurations** directly into a well-oiled, AI-first documentation system—and no one crawls on their knees begging for working docs anymore.

Let’s make this work beautifully! 🚀
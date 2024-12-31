# Overview of content-aggregator

## Objective
The `content-aggregator` package is designed to aggregate and summarize content from distributed and remote sources with the flexibility of React-driven pipelines. It is a part of the broader Spicetime framework, aimed at supporting distributed systems, communities, and economics.

---

## Key Concepts

### 1. React-Inspired Pipelines
- The core idea is to use **JSX pipelines** defined as strings.
- These pipelines are specified interactively by the client and executed on the server.
- Pipelines:
  - Define **sources** of content (e.g., GitHub repositories).
  - Specify how files are processed based on types (`.md`, `.json`, etc.).
  - Define how results are aggregated into summaries.

---

### 2. Monorepo Structure
The `content-aggregator` package is organized under three directories:
1. **shared/**:
   Shared code used by both `client` and `server` (e.g., utilities, type definitions, GraphQL schema objects).
2. **client/**:
   - A browser-based interactive builder platform, allowing users to define and send JSX pipelines as GraphQL queries.
   - Uses React for the front-end UI.
3. **server/**:
   - A back-end service built with Apollo Server and GraphQL.
   - Interprets the JSX pipeline string and dynamically renders it, processing the specified sources and producing summaries.

---

## Use Cases

### **Version 1 (GitHub Integration)**
1. Access public or authorized repositories and fetch content.
2. Process file content to generate summaries using the JSX pipelines.
3. Handle file types like Markdown (`.md`), JSON, and other custom structures.

### Future Integrations:
- Local file systems.
- Databases or distributed DB systems.

---

## Features

### GraphQL-Enabled Architecture
- The **client** sends JSX pipeline queries to the **server**.
- JSX pipelines allow for flexible and dynamic query parameters (beyond schema constraints).

### Annotations
- All code and workflows are well-documented with tooling:
  - TypeScript: **Typedoc**
  - GraphQL: **gql-docs** and **graphQL codegen**
- A **storybook** documents UI React components for client interactivity.

---

## Workflow Summary
### **Developer Workflow**:
1. Define pipelines interactively via the client.
2. Use `npm run generate-all` to:
   - Generate GraphQL documentation.
   - Update TypeScript resolver skeletons and types.

### **Test-Driven Development**:
- Local testing handled by **Vitest**.
- Orchestrated by **Turbo** for repo-wide system integration.

---

Let me know if you'd like any changes, or I'll move on to drafting the **design document**!
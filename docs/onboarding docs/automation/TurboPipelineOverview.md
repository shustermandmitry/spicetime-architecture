## Turbo Pipeline Overview

The monorepo uses a **Turbo pipeline** for task orchestration, ensuring an efficient workflow with caching and dependency management. Below is the pipeline defined in the `turbo.json`:

### Turbo Tasks Overview

| **Task**       | **Depends On**     | **Outputs**              | **Cache** |
|-----------------|--------------------|--------------------------|-----------|
| **test**        | `^build`           | `coverage/**`            | ✅         |
| **dev**         | `^generate-all`    | None                     | ❌         |
| **build**       | `^generate-all`    | `dist/**`                | ✅         |
| **lint**        | None               | None                     | ✅         |
| **clean**       | None               | None                     | ❌         |
| **generate-all**| None               | `src/generated/**`       | ✅         |

---

### Explanation of the Pipeline

1. **test**:
   - Depends on the **build** task (and its recursive dependencies), ensuring tests always run against the latest build.
   - Produces test coverage reports in the `coverage` directory.
   - Input files include:
     - Application source files: `src/**/*.{js,jsx,ts,tsx}`.
     - Test files: `test/**/*.{js,jsx,ts,tsx}`.
     - Vitest setup file: `tools/vite-config/vitest.setup.js`.

2. **dev**:
   - Executes the development server but depends on **generate-all** tasks, ensuring any code generation (e.g., GraphQL, TypeScript types) is completed beforehand.
   - Caching is disabled for this task to reflect all incremental code changes immediately.

3. **build**:
   - Produces compiled artifacts in the `dist` directory from application packages or libraries.
   - Depends on **generate-all**, ensuring code artifacts like GraphQL schema clients or TypeScript types are generated before building.

4. **lint**:
   - Lints the codebase, targeting:
     - All files in the `src` directory.
     - Config files like `.eslintrc.json` and `package.json`.
   - Caches results to avoid redundant linting of unchanged files.

5. **clean**:
   - A utility task to remove generated outputs like `dist` or artifacts in build directories.
   - Doesn’t cache results since cleaning should always execute, regardless of prior runs.

6. **generate-all**:
   - Executes code generation tasks such as:
     - GraphQL client code generation.
     - TypeScript type generation.
   - Caching is enabled, so generated files are reused unless underlying inputs change.
   - Inputs include:
     - Schema or API definition files: `schemas/**/*.graphql`.
     - Source code for type generation: `src/**/*.{ts,tsx}`.
     - Test setup file: `tools/vite-config/vitest.setup.js`.
     - Related configs such as `codegen.config.js` or `typedoc.config.js`.

---

### Turbo and pnpm Together

This Turbo pipeline is fully integrated with **pnpm** to efficiently manage dependencies and orchestrate tasks across the monorepo. Key points include:

#### 1. **Task Dependencies with pnpm Workspaces**
In our monorepo structure, Turbo ensures task dependencies are resolved based on `pnpm`'s workspaces. For instance:
   - The **test** task depends on the **build** task, which in turn relies on shared libraries found in `packages/*`.

#### 2. **Caching and Speed**
   - With **Turbo caching**, unchanged files or tasks are skipped, significantly speeding up repetitive builds, tests, and generation tasks across projects.

#### 3. **pnpm Workspaces Context**
   - Local shared libraries are linked using pnpm's workspace feature (`workspace:*`). For example, the local library `@myorg/shared-ui` in `packages/shared-ui` is linked directly into consuming applications (`apps/frontend`) without duplicating or downloading dependencies.

   Example of adding a local dependency:
   ```bash
   pnpm add @myorg/shared-ui --filter apps/frontend
   ```

By combining **pnpm** and **Turbo**, the monorepo achieves blazing-fast builds, reduced duplication, and a streamlined developer workflow.
# Design Document: Modular Spacetime Documentation and Workflow System

## Summary

This document outlines a structure and methodology for organizing and documenting **components in a flat folder structure**, while linking components into **spatial-hierarchical scopes** via **symlinks**. Scopes act as nodes in a **spacetime tree structure**, where lifelines are temporal and spatial paths that define the lineage and behavior of components. 

Additionally, **extensions for project state** (e.g., `.todo`, `.active`) and **subtasks or patches** (e.g., `Github.added test automation.active`) allow finer granularity in representing progress and influence CI/CD workflows directly.

Key features of the system:
1. **Flat Physical Component Structure**: Components exist in a flat hierarchy at the root level.
2. **Spatial-Hierarchical Scopes**: Special folders act as scopes with symlinks to components they encompass, pointing to their positions in spacetime.
3. **Lifelines (Dot Tags)**: `.`-tags in component names or lifeline files defining lineage and scope relationships.
4. **State Indicators**: `.todo`, `.active`, and other states define the project stage (e.g., planning, active development, or complete).
5. **Subtasks and Patches**: Represent finer-grained work items tied to a component or scope.

---

## Folder Structure

### 1. Physical Flat Folder Structure
All components exist in a **flat structure** under a root directory (`components`), regardless of scope, lineage, or project state.

```plaintext
components/
  Test.tsx                     # Free-range Test component (baseline).
  Test.Github.tsx              # Test component that acquired Github flavor.
  Github.Test.tsx              # Newly created Github-parent Test component, no lineage.
  Github.todo.tsx              # Github scope, in the planning stage.
  Test.Github.active.tsx       # Test component under Github scope, active phase.
  Github.added test automation.active.tsx  # A subtask with partial implementation.
```

### 2. Spatial-Hierarchical Scope Structure
Scopes act as folders with symlinks, defining spatial-temporal arrangements (hierarchies) of components. State indicators and subtasks are explicitly tracked here.

#### Example Scope Tree for `Github`:
```plaintext
scopes/
  Github/
    Github.todo -> ../../components/Github.todo.tsx
    Github.Test -> ../../components/Github.Test.tsx
    Test.Github.active -> ../../components/Test.Github.active.tsx
    Github.added test automation.active -> ../../components/Github.added test automation.active.tsx
```

#### Example Scope Tree for `Tests`:
```plaintext
scopes/
  Tests/
    Test -> ../../components/Test.tsx
    Test.Github -> ../../components/Test.Github.tsx
    Test.Github.active -> ../../components/Test.Github.active.tsx
```

### 3. Lifeline Representation
In addition to using **`.` tags and state indicators** in component names, a **special file** in each scope folder (e.g., `lifeline.json`) tracks explicit metadata about component lifelines, state indicators, and subtasks.

---

## Lifeline File

Each **scope folder** contains a `lifeline.json` file that documents the spacetime relationships of its linked components. This file captures:
- **Lineage**: Parent scope and relationships.
- **State**: Current project state (e.g., `.todo`, `.active`, or `.completed`).
- **Subtasks and Patches**: Work items representing partial or ongoing changes.

#### Example `lifeline.json` for `Github` Scope:
```json
{
  "scope": "Github",
  "lifelines": [
    {
      "component": "Github.Test",
      "parent": null,
      "state": "completed",
      "description": "A Github-native Test component, no baseline lineage."
    },
    {
      "component": "Test.Github.active",
      "parent": "Test",
      "state": "active",
      "description": "Test component with Github flavor; actively in development under this scope."
    },
    {
      "component": "Github.todo",
      "parent": null,
      "state": "todo",
      "description": "Initial planning for Github component, no implementation.unstructured yet."
    },
    {
      "component": "Github.added test automation.active",
      "parent": "Github",
      "state": "active",
      "description": "Partial implementation.unstructured of Github-specific test automation features."
    }
  ]
}
```

---

## Documentation System

### 1. Philosophy
- **Flat Component Docs**: Baseline API/docs for components live next to the source files in the flat hierarchy.
- **Scope-Level and State-Aware Docs**: Higher-level documentation resides in the **scope folders**, linking or summarizing behavior, state, and any subtasks.

---

### 2. Structure of Documentation
Using the previous folder structure, documentation is organized as:

```plaintext
components/
  Test.tsx                     # Component source.
  Test.md                      # Free-range Test API/design doc.

  Test.Github.tsx              # Component source.
  Test.Github.md               # Github-flavored Test behavior.

  Github.Test.tsx              # Component source.
  Github.Test.md               # Completely Github-flavored Test.

  Github.todo.tsx              # Source file in planning stage.
  Github.todo.md               # Planning and design phase doc.

  Test.Github.active.tsx       # Component source actively in development phase.
  Test.Github.active.md        # Doc for the active implementation.

  Github.added test automation.active.tsx  # Partial feature implementation.
  Github.added test automation.active.md   # Doc for partially implemented component.

scopes/
  Github/
    README.md                  # High-level Github system documentation.
    lifeline.json              # Lifeline for Github scope.
    Github.todo -> ../../components/Github.todo.tsx
    Github.Test -> ../../components/Github.Test.tsx
    Test.Github.active -> ../../components/Test.Github.active.tsx
    Github.added test automation.active -> ../../components/Github.added test automation.active.tsx

  Tests/
    README.md                  # High-level testing system documentation.
    lifeline.json              # Lifeline for Tests scope.
    Test -> ../../components/Test.tsx
    Test.Github -> ../../components/Test.Github.tsx
    Test.Github.active -> ../../components/Test.Github.active.tsx
```

---

### 3. Docs Workflow
Documentation generation now incorporates **project state** and **subtasks**, influencing outputs and workflows.

#### Example PNPM Workflow for State-Aware Docs
```json
"scripts": {
  "docs": "pnpm docs:generate --all",
  "docs:generate": "node ./scripts/docs-generator.js",
  "docs:state": "node ./scripts/docs-state.js --state active",
  "docs:scope": "node ./scripts/docs-scope.js --scope $1"
}
```

---

## Git Workflows Based on Lifelines and States

### 1. Lifeline and State-Aware Workflows
GitHub workflows now incorporate **state indicators** and **subtasks**, allowing more subtle workflows for `.todo`, `.active`, and `.completed` states.

#### Example Workflow
```yaml
name: Lifeline and State-Aware Workflow

on:
  push:
    branches:
      - '**'
  workflow_dispatch:

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Generate Docs for Active Work
        run: |
          node ./scripts/docs-state.js --state active

      - name: Test Active Subtasks
        run: |
          pnpm run test --scope "Github.added test automation.active"
```

---

## Next Steps

1. **Manually Update Folder Structure**:
   - Incorporate `.todo`, `.active`, and subtasks for appropriate components within the flat `components` folder and scopes.

2. **Write State-Aware Documentation**:
   - Add `.md` documentation for each state and subtask.

3. **Iterate on Lifelines and Workflow Automation**:
   - Extend `lifeline.json` usage and GitHub Action workflows to accommodate states and subtasks.
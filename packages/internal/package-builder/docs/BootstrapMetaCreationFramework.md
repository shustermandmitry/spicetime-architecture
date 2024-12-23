# Bootstrap Meta-Creation Framework

## Overview
This is a React-based framework for **meta-application creation** focused on recursive and semantic bootstrapping. The system:
- Takes an initial verbal spec (JSS).
- Generates folder structures, files, and skeleton code.
- Handles development interactively and incrementally, allowing updates/mutations.
- Outputs self-documenting doc sites based on history, structure, and Git workflows.

## Core Components
### 1. Executor
Root-level driver of the creation process.

```jsx
<Executor>
  <FolderManager spec="Creates the structure for a React application">
    ...
  </FolderManager>
</Executor>
```

### 2. FolderManager
Manages hierarchical folders and infers relationships/events from specs.

### 3. Folder
Defines directory structurhe app and **creation history/process**.e. Child folders and files expand functionality.

### 4. File
Atomic code structure, with:
- `spec`: Verbal description.
- `code`: Optional inline JS content.

## Recursive Workflow
1. Start from Spec → Generate Structure.
2. Interact (e.g., update specs, folders/files).
3. Rerun bootstrap cycle (generate code/tests and run them).
4. Incrementally evolve.

## Docs and Git Integration
Updated Gatsby docs site visualizing t
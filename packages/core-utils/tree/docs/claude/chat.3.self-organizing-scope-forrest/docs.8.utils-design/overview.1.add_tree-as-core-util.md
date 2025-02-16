# Core Packages Documentation

## Overview

This document describes the core packages that compose the domain-driven development environment. All packages expose action functions that:
- Are pure functions acting as resolvers
- Take a sequence of args with state tree as last argument
- Compose into GQL-like executable schemas

### Package Structure

```
packages/
├── utils/
│   ├── core/
│   │   └── tree/          # Core tree functionality
│   ├── executableTree/    # Reactive tree functionality
│   ├── forest/            # Tree registry and orchestration
│   ├── process/           # Process tree composition
│   ├── time/             # Tic management
│   ├── space/            # Space formation and management
│   ├── executableSchema/ # Schema composition
│   ├── designProcess/    # Design process patterns
│   └── semanticAggregator/ # Semantic summarization
└── domain/               # Domain implementation package
```

## tree (Core Utility)

Location: utils/core/tree
Primary responsibility: Foundational tree functionality for all other packages

```typescript
// Core Types
type Tree<T = any> = {
  value: T;
  branches?: Map<string, Tree<T>>;
};

// Actions always take state tree as last argument
type Action<T, S> = (args: T, state: Tree<S>) => Tree<S>;

// Core API - all functions are pure and take state as last arg
const tree = {
  // Create new tree
  create: Action<{
    value: any
  }, any>;

  // Add branch to existing tree
  branch: Action<{
    id: string,
    value: any
  }, any>;

  // Resolve path in tree
  resolve: Action<{
    path: string[]
  }, any>;

  // Transform tree value
  transform: Action<{
    fn: (value: any) => any
  }, any>;
};
```

Key Characteristics:
1. Pure functional interface
2. All operations preserve tree immutability 
3. State tree as last argument
4. Prepares for TreeRPC integration
5. Core building block for all other packages

### Usage Example

```typescript
// Create new tree
const state = tree.create({ value: 'root' }, initialState);

// Add branch
const newState = tree.branch({
  id: 'child',
  value: 'leaf'
}, state);

// Resolve path
const value = tree.resolve({
  path: ['child']
}, state);

// Transform value
const transformed = tree.transform({
  fn: v => v.toUpperCase()
}, state);
```

### Integration Notes

1. All other packages build on this core tree functionality
2. Provides foundation for executableTree
3. Forest package uses this for registration
4. Process package extends this pattern
5. Time and Space operate on these structures

[Rest of package documentation remains the same...]
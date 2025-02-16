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
│   ├── tree/               # Base tree functionality
│   ├── executableTree/     # Reactive tree functionality
│   ├── forest/             # Tree registry and orchestration
│   ├── process/           # Process tree composition
│   ├── time/              # Tic management
│   ├── space/             # Space formation and management
│   ├── executableSchema/  # Schema composition
│   ├── designProcess/     # Design process patterns
│   └── semanticAggregator/# Semantic summarization
└── domain/                # Domain implementation package
```

## tree (Core Utility)

Primary responsibility: Basic tree functionality

```typescript
type Tree = {
  id: string;
  value: any;
  branches: Map<string, Branch>;
};

// Core API
const tree = {
  create: (id: string, value: any) => Tree;
  branch: (tree: Tree, id: string, value: any) => Branch;
  resolve: (tree: Tree, path: string[]) => any;
};
```

## executableTree (Utility)

Primary responsibility: Reactive tree driven by functional patterns

```typescript
type ExecutableTree = Tree & {
  reducers: Map<string, Function>;
  effects: Map<string, Function>;
};

// Core API
const executableTree = {
  create: (tree: Tree, reducers: Map<string, Function>) => ExecutableTree;
  dispatch: (tree: ExecutableTree, action: Action) => ExecutableTree;
  subscribe: (tree: ExecutableTree, listener: Function) => () => void;
};
```

## forest (Utility)

Primary responsibility: Tree registry and hierarchical scopes

```typescript
type Forest = {
  trees: Map<string, Tree>;
  scopes: Map<string, Scope>;
};

type Scope = {
  root: Tree;
  visible: Set<string>;  // Visible tree IDs
};

// Core API
const forest = {
  register: (tree: Tree) => void;
  createScope: (root: Tree) => Scope;
  resolve: (scope: Scope, path: string[]) => any;
};
```

## process (Utility)

Primary responsibility: Executable process trees

```typescript
type Process = ExecutableTree & {
  state: 'running' | 'paused' | 'completed';
  workflows: Map<string, string[]>;  // Workflow paths
};

// Core API
const process = {
  create: (name: string, workflows: Map<string, string[]>) => Process;
  start: (process: Process, workflow: string, value: any) => Process;
  pause: (process: Process) => Process;
  resume: (process: Process) => Process;
};
```

## time (Utility)

Primary responsibility: Tic management and evolution

```typescript
type Tic = {
  version: string;
  frozen: boolean;
  proto: Tic | null;
  vectors: Map<string, Vector>;
};

// Core API
const time = {
  createTic: (proto: Tic | null) => Tic;
  freeze: (tic: Tic) => Tic;
  evolve: (tic: Tic) => Tic;
};
```

## space (Utility)

Primary responsibility: Space formation from time

```typescript
type Space = {
  nodes: Map<string, SpaceNode>;
  links: Map<string, Set<string>>;
};

type SpaceNode = {
  id: string;
  tic: Tic;
  vectors: Set<string>;
};

// Core API
const space = {
  createNode: (tic: Tic, vectors: string[]) => SpaceNode;
  link: (space: Space, from: string, to: string) => Space;
  resolve: (space: Space, path: string[]) => any;
};
```

## executableSchema (Utility)

Primary responsibility: Schema composition and execution

```typescript
type Schema = {
  resolvers: Map<string, Function>;
  reducers: Map<string, Function>;
  subscriptions: Map<string, Function>;
};

// Core API
const schema = {
  compose: (schemas: Schema[]) => Schema;
  execute: (schema: Schema, operation: Operation) => Promise<any>;
};
```

## designProcess (Utility)

Primary responsibility: Design process patterns

```typescript
type Design = Process & {
  aliases: Map<string, Set<string>>;
  patterns: Map<string, Pattern>;
};

// Core API
const design = {
  create: (name: string) => Design;
  addPattern: (design: Design, pattern: Pattern) => Design;
  findAliases: (design: Design) => Map<string, Set<string>>;
};
```

## semanticAggregator (Utility)

Primary responsibility: Semantic summarization

```typescript
type Summary = {
  vectors: Map<string, Vector>;
  meanings: Map<string, string>;
};

// Core API
const aggregator = {
  collect: (files: string[], profile: Profile) => Summary;
  vectorize: (content: string) => Vector[];
  summarize: (vectors: Vector[]) => string;
};
```

## Integration Notes

1. All packages prepare for TreeRPC integration through executable schemas
2. State trees are consistent across package boundaries
3. Time and Space packages coordinate through event system
4. Package profiles guide file organization and semantics
5. Design process tracks pattern emergence and aliases

## Future Considerations

1. TreeRPC full integration
2. Advanced cognitive functions
3. AI collaboration tools
4. Distributed system patterns
5. Extended semantic processing
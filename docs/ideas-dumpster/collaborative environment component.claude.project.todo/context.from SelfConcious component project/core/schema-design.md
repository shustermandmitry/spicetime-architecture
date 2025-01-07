# Schema Design

Path: `/docs/collaborative-environment/core/schema-design.md`

## Overview

Each layer in the collaborative environment defines its own GraphQL schema that describes:

- Layer state and capabilities
- Operations it can perform
- Real-time subscriptions
- Integration points with other layers

## Layer Schema Structure

### Basic Layer Schema

```graphql
# Base layer types
type Layer {
  id: ID!
  type: LayerType!
  state: LayerState!
  windows: [Window!]!
}

# Layer-specific state
type LayerState {
  isActive: Boolean!
  data: JSON
  metadata: JSON
}

# Window management
type Window {
  id: ID!
  position: Position!
  content: LayerContent!
}

# Operations every layer supports
interface LayerOperations {
  activate: Boolean!
  deactivate: Boolean!
  updateState(data: JSON!): LayerState!
}
```

### Example: Repository Layer

```graphql
# Repository-specific types
type RepoLayer implements LayerOperations {
  id: ID!
  type: LayerType!
  state: RepoState!
  files: [File!]!
  branches: [Branch!]!
  currentBranch: Branch!
}

type File {
  path: String!
  content: String
  status: FileStatus!
}

# Operations
extend type Query {
  repoFiles: [File!]!
  fileDiff(path: String!): FileDiff!
  branchList: [Branch!]!
}

extend type Mutation {
  updateFile(path: String!, content: String!): File!
  switchBranch(name: String!): Branch!
}

extend type Subscription {
  fileChanged(path: String): File!
  branchUpdated: Branch!
}
```

## Integration Points

### Layer Composition

When layers need to interact, define shared types and operations:

```graphql
# Shared types between repo and docs layers
interface DocumentedEntity {
  path: String!
  documentation: Documentation
}

type File implements DocumentedEntity {
  path: String!
  content: String
  documentation: Documentation
}

type Documentation {
  content: String!
  lastUpdated: DateTime!
}
```

### Cross-Layer Operations

```graphql
# Operations that span multiple layers
extend type Mutation {
  # Update file and its documentation together
  updateFileWithDocs(
    path: String!, 
    content: String!, 
    docs: String!
  ): DocumentedFile!
}

# Subscriptions that notify multiple layers
extend type Subscription {
  documentedEntityChanged: DocumentedEntity!
}
```

## Schema Organization

### File Structure

```
app/
└── graphql/
    ├── base/
    │   ├── layer.graphql     # Base layer types
    │   └── window.graphql    # Window management types
    ├── repo/
    │   ├── types.graphql     # Repo-specific types
    │   ├── queries.graphql   # Repo queries
    │   └── mutations.graphql # Repo mutations
    └── docs/
        ├── types.graphql     # Documentation types
        └── operations.graphql # Doc operations
```

### Schema Composition

```typescript
// app/graphql/schema.ts
import { mergeSchemas } from '@graphql-tools/schema';
import { baseSchema } from './base';
import { repoSchema } from './repo';
import { docsSchema } from './docs';

export const schema = mergeSchemas({
  schemas: [baseSchema, repoSchema, docsSchema],
  resolvers: {
    // Cross-schema resolvers
    DocumentedEntity: {
      __resolveType(obj) {
        if (obj.content) return 'File';
        return 'Documentation';
      }
    }
  }
});
```

## Best Practices

1. **Schema Design**
    - Define clear layer boundaries
    - Use interfaces for shared behavior
    - Keep operations focused
    - Plan for extensibility

2. **Type Safety**
    - Use strict types
    - Avoid generic JSON where possible
    - Define clear interfaces
    - Document type relationships

3. **Performance**
    - Design efficient queries
    - Plan subscription filters
    - Consider caching strategies
    - Optimize resolvers

4. **Integration**
    - Define clear integration points
    - Use interfaces for shared behavior
    - Plan cross-layer operations
    - Document dependencies

## Common Patterns

### State Updates

```graphql
type Mutation {
  updateLayerState(
    layerId: ID!, 
    patch: StatePatch!
  ): LayerState!
}

input StatePatch {
  path: [String!]!
  value: JSON!
}
```

### Window Management

```graphql
type Mutation {
  createWindow(
    layerId: ID!, 
    position: WindowPosition!
  ): Window!
  
  arrangeWindows(
    layout: WindowLayout!
  ): [Window!]!
}
```

### Real-time Updates

```graphql
type Subscription {
  layerStateChanged(
    layerId: ID!, 
    path: [String!]
  ): StateChange!
  
  windowsChanged(
    layerId: ID!
  ): [Window!]!
}
```

## Next Steps

- Learn about [Integration Patterns](../guides/integration-patterns.md)
- Explore [Window Management](../components/windows.md)
- Study [Layer System](./layer-system.md) implementation
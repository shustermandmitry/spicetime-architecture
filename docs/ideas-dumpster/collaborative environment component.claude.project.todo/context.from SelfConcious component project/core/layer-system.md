# Layer System

Path: `/docs/collaborative-environment/core/layer-system.md`

## Overview

The layer system enables multiple views into the collaborative workspace through:

- Multiple JSX strings per layer for content and layout
- Nested Remix routing for layer navigation
- Standard GraphQL patterns for state and messaging
- React-mosaic for window management

## Layer Structure

Each layer consists of:

1. **Content JSX**
    - Main content/functionality
    - Component structure
    - GraphQL queries/mutations

2. **Layout JSX**
    - Window arrangement
    - Navigation elements
    - View composition

3. **Router Configuration**
    - Nested routes for the layer
    - Child layer routing
    - Path management

### Example Layer Structure

```typescript
// Content JSX - repo/content.tsx
export function RepoContent() {
  const { data } = useQuery(REPO_QUERY);
  return (
    <div className="repo-content">
      <FileTree data={data.files} />
      <Editor />
    </div>
  );
}

// Layout JSX - repo/layout.tsx
export function RepoLayout() {
  return (
    <MosaicWindow>
      <div className="repo-layout">
        <Toolbar />
        <Outlet /> {/* Content renders here */}
      </div>
    </MosaicWindow>
  );
}

// Router - repo/route.tsx
export default function RepoRoute() {
  return (
    <Route path="repo" element={<RepoLayout />}>
      <Route index element={<RepoContent />} />
      <Route path="files/*" element={<FileRoute />} />
    </Route>
  );
}
```

## Layer Integration

### GraphQL Schema Per Layer

```graphql
# Layer-specific schema
type RepoLayer {
  files: [File!]!
  currentBranch: String!
  changes: [Change!]!
}

# Layer operations
extend type Query {
  repoState: RepoLayer!
}

extend type Mutation {
  updateFile(path: String!, content: String!): File!
}

extend type Subscription {
  fileChanged: FileChange!
}
```

### Layer Composition

```typescript
// app/routes/_index.tsx
export default function CollaborativeEnvironment() {
  return (
    <LayerManager>
      <Route path="/" element={<Layout />}>
        <Route path="repo/*" element={<RepoRoute />} />
        <Route path="docs/*" element={<DocsRoute />} />
        <Route path="collab/*" element={<CollabRoute />} />
      </Route>
    </LayerManager>
  );
}
```

## State Management

Layers use standard Apollo Client hooks:

```typescript
function LayerComponent() {
  // Query layer data
  const { data } = useQuery(LAYER_QUERY);
  
  // Mutations for updates
  const [updateLayer] = useMutation(UPDATE_LAYER);
  
  // Subscribe to changes
  const { data: updates } = useSubscription(LAYER_UPDATES);
  
  return (
    // Layer UI
  );
}
```

## Window Management

React-mosaic handles window layout:

```typescript
function LayerWindows() {
  return (
    <Mosaic
      renderTile={(id, path) => (
        <MosaicWindow path={path}>
          <Outlet /> {/* Layer content renders here */}
        </MosaicWindow>
      )}
    />
  );
}
```

## Best Practices

1. **Layer Organization**
    - Separate content and layout JSX
    - Use nested routing for layer hierarchy
    - Keep GraphQL operations close to components

2. **State Management**
    - Use Apollo Client hooks consistently
    - Define clear layer-specific schemas
    - Leverage subscriptions for real-time updates

3. **Performance**
    - Lazy load layer content
    - Use proper Apollo caching
    - Optimize window rendering

## Next Steps

- [Layer Schema Design](../guides/layer-schema.md)
- [Window Management](../components/windows.md)
- [Nested Routing](../guides/routing.md)
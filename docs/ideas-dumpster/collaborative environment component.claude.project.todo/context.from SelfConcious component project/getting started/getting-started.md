# Getting Started

Path: `/docs/collaborative-environment/getting-started/setup.md`

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Basic understanding of React and GraphQL

## Quick Start

### 1. Create New Project

```bash
pnpm create remix@latest
cd your-project
pnpm install
```

### 2. Install Dependencies

```bash
pnpm add @apollo/client graphql react-mosaic-component
pnpm add -D @types/react-mosaic-component
```

### 3. Basic Setup

Create the initial layer structure:

```typescript
// app/routes/_index.tsx
import { ApolloProvider } from '@apollo/client';
import { LayerManager } from '~/components/LayerManager';

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <LayerManager>
        <Route path="/" element={<Layout />}>
          <Route path="repo/*" element={<RepoLayer />} />
          <Route path="docs/*" element={<DocsLayer />} />
        </Route>
      </LayerManager>
    </ApolloProvider>
  );
}
```

### 4. Create Your First Layer

A layer consists of multiple JSX strings:

```typescript
// app/layers/repo/content.tsx
export function RepoContent() {
  const { data } = useQuery(REPO_QUERY);
  
  return (
    <div className="repo-content">
      <FileTree files={data.files} />
      <Editor />
    </div>
  );
}

// app/layers/repo/layout.tsx
export function RepoLayout() {
  return (
    <MosaicWindow>
      <div className="repo-layout">
        <Toolbar />
        <Outlet />
      </div>
    </MosaicWindow>
  );
}

// app/layers/repo/schema.ts
export const repoSchema = gql`
  type File {
    path: String!
    content: String
  }

  extend type Query {
    files: [File!]!
  }

  extend type Mutation {
    updateFile(path: String!, content: String!): File!
  }
`;
```

### 5. Configure Window Management

Set up react-mosaic for window layouts:

```typescript
// app/components/LayerManager.tsx
import { Mosaic, MosaicWindow } from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';

export function LayerManager({ children }) {
  return (
    <Mosaic
      renderTile={(id, path) => (
        <MosaicWindow path={path}>
          {children}
        </MosaicWindow>
      )}
    />
  );
}
```

## Basic Usage

### 1. Query Layer Data

```typescript
function MyLayer() {
  const { data } = useQuery(gql`
    query GetFiles {
      files {
        path
        content
      }
    }
  `);

  return (
    <div>
      {data.files.map(file => (
        <FileItem key={file.path} file={file} />
      ))}
    </div>
  );
}
```

### 2. Handle Updates

```typescript
function FileEditor({ path }) {
  const [updateFile] = useMutation(gql`
    mutation UpdateFile($path: String!, $content: String!) {
      updateFile(path: $path, content: $content) {
        path
        content
      }
    }
  `);

  return (
    <Editor
      onChange={content => updateFile({ variables: { path, content } })}
    />
  );
}
```

### 3. Subscribe to Changes

```typescript
function FileWatcher({ path }) {
  const { data } = useSubscription(gql`
    subscription OnFileChange($path: String!) {
      fileChanged(path: $path) {
        path
        content
      }
    }
  `);

  return <FilePreview content={data?.fileChanged.content} />;
}
```

## Next Steps

1. Learn about [Layer System](../core/layer-system.md) in detail
2. Understand [Schema Design](../core/schema-design.md)
3. Explore [Window Management](../components/windows.md)

## Common Issues

1. **Window Layout Not Saving**
    - Ensure proper MosaicWindow configuration
    - Check localStorage permissions

2. **Real-time Updates Not Working**
    - Verify subscription setup
    - Check WebSocket connection

3. **Layer Not Rendering**
    - Confirm route configuration
    - Check layer component exports

## Best Practices

1. **Layer Organization**
    - Keep content and layout JSX separate
    - Colocate related GraphQL operations
    - Use proper type definitions

2. **State Management**
    - Use Apollo Client hooks consistently
    - Handle loading and error states
    - Implement proper caching

3. **Performance**
    - Lazy load layer content
    - Optimize subscription filters
    - Use proper component memoization
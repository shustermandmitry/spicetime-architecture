
# PatchDispatcher API Documentation

## Core API

### PatchProcessor
```typescript
class PatchProcessor {
  constructor(fs: FileSystemOperations);
  processContent(content: string): Promise<ProcessResult>;
}
```

#### Parameters
- `fs`: File system implementation
- `content`: Raw patch file content

#### Returns
```typescript
interface ProcessResult {
  success: boolean;
  operations: {
    type: CommandType;
    path: string;
    content?: string;
  }[];
  error?: {
    message: string;
    line?: number;
  };
}
```

## React Components

### PatchDispatcher
```typescript
interface PatchDispatcherProps {
  className?: string;
  onPatchComplete?: (result: ProcessResult) => void;
  onError?: (error: Error) => void;
}

const PatchDispatcher: React.FC<PatchDispatcherProps>;
```

### FileSystemContext
```typescript
const FileSystemContext: React.Context<FileSystemOperations>;
function useFileSystem(): FileSystemOperations;
```

## GraphQL Schema

### Types
```graphql
"""
Status of patch operation
"""
enum PatchStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

"""
Content of a patch operation
"""
type PatchContent {
  """Path where operation is applied"""
  targetPath: String!
  
  """Content to be written"""
  content: String!
}

"""
Complete patch file
"""
type Patch {
  """Unique identifier"""
  id: ID!
  
  """Processing timestamp"""
  timestamp: Float!
  
  """Current status"""
  status: PatchStatus!
  
  """Patch contents"""
  patches: [PatchContent!]!
}
```

### Queries
```graphql
type Query {
  """
  Fetch active patches in the system
  """
  activePatches: [Patch!]!
  
  """
  Get specific patch by ID
  """
  patch(id: ID!): Patch
}
```

### Mutations
```graphql
type Mutation {
  """
  Process a new patch file
  @param id Unique identifier for the patch
  @param content Raw patch file content
  """
  processPatch(id: ID!, content: String!): PatchResult!
}

"""
Result of patch processing
"""
type PatchResult {
  success: Boolean!
  message: String
}
```

// File: packages/spicetime-react-app/src/components/PatchDispatcher/docs/GRAPHQL.md

# GraphQL Integration Guide

## Schema Overview

The PatchDispatcher GraphQL API provides:
- Real-time patch status tracking
- Patch operation history
- Processing controls

### Base Types

#### Patch
Central type representing a patch operation:
```graphql
type Patch {
  id: ID!
  timestamp: Float!
  status: PatchStatus!
  patches: [PatchContent!]!
}
```

Usage:
```graphql
query GetPatchStatus {
  patch(id: "123") {
    status
    patches {
      targetPath
    }
  }
}
```

#### PatchContent
Represents individual file operations:
```graphql
type PatchContent {
  targetPath: String!
  content: String!
}
```

### Operations

#### Queries

1. Fetch Active Patches
```graphql
query GetActivePatches {
  activePatches {
    id
    status
    patches {
      targetPath
    }
  }
}
```

2. Get Specific Patch
```graphql
query GetPatch($id: ID!) {
  patch(id: $id) {
    id
    timestamp
    status
    patches {
      targetPath
      content
    }
  }
}
```

#### Mutations

1. Process Patch
```graphql
mutation ProcessPatch($id: ID!, $content: String!) {
  processPatch(id: $id, content: $content) {
    success
    message
  }
}
```

### Integration Examples

#### React Query Hook
```typescript
function usePatchStatus(id: string) {
  return useQuery(['patch', id], async () => {
    const { data } = await client.query({
      query: PATCH_QUERY,
      variables: { id }
    });
    return data.patch;
  });
}
```

#### Mutation Hook
```typescript
const PROCESS_PATCH = gql`
  mutation ProcessPatch($id: ID!, $content: String!) {
    processPatch(id: $id, content: $content) {
      success
      message
    }
  }
`;

function useProcessPatch() {
  return useMutation(PROCESS_PATCH);
}
```

### Error Handling

GraphQL errors follow this structure:
```typescript
interface PatchError {
  message: string;
  extensions?: {
    code: string;
    line?: number;
  };
}
```

Common error codes:
- INVALID_PATCH_FORMAT
- OPERATION_FAILED
- FILE_SYSTEM_ERROR
- INVALID_PATH

### Best Practices

1. Query Optimization
```graphql
# Good - Specific fields
query {
  activePatches {
    id
    status
  }
}

# Bad - Over-fetching
query {
  activePatches {
    id
    status
    patches {
      targetPath
      content # Large field
    }
  }
}
```

2. Real-time Updates
```graphql
subscription OnPatchUpdate {
  patchUpdated {
    id
    status
  }
}
```

3. Batch Operations
```graphql
mutation ProcessPatches($patches: [PatchInput!]!) {
  processPatches(patches: $patches) {
    successful
    failed {
      id
      error
    }
  }
}
```

### Testing

1. Query Tests
```typescript
describe('Patch Queries', () => {
  it('fetches active patches', async () => {
    const { data } = await client.query({
      query: GET_ACTIVE_PATCHES
    });
    expect(data.activePatches).toBeDefined();
  });
});
```

2. Mutation Tests
```typescript
describe('Patch Mutations', () => {
  it('processes valid patch', async () => {
    const { data } = await client.mutate({
      mutation: PROCESS_PATCH,
      variables: {
        id: 'test',
        content: validPatchContent
      }
    });
    expect(data.processPatch.success).toBe(true);
  });
});
```

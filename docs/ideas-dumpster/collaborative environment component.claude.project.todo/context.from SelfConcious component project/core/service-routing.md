# Service Routing

Path: `/docs/collaborative-environment/core/service-routing.md`

## Schema Level

Components just express what they need through standard GraphQL:

```graphql
# File operations in schema
type Mutation {
  updateFile(
    path: String!
    content: String!
    constraints: OperationConstraints
  ): File!
}

# Optional constraints for the operation
input OperationConstraints {
  maxCost: Float
  maxLatency: Int
  trustLevel: Int
}
```

## Usage in Components

Components remain simple and focused on their task:

```typescript
function FileEditor() {
  const [updateFile] = useMutation(gql`
    mutation UpdateFile($path: String!, $content: String!) {
      updateFile(path: $path, content: $content) {
        path
        content
        status
      }
    }
  `);

  // Component just makes the request
  // HiveMind's resolver handles all the complexity
  return (
    <Editor
      onChange={content => 
        updateFile({ 
          variables: { 
            path: "src/main.ts", 
            content 
          }
        })
      }
    />
  );
}
```

## HiveMind Resolution

The intelligence lives in the resolver layer provided by HiveMind. It handles:

- Finding available services
- Cost/latency optimization
- Trust and reputation
- Market dynamics
- Learning from past interactions

The component doesn't need to know about any of this - it just makes requests through the schema and gets results back.

## Best Practices

1. Keep components simple
    - Use standard GQL patterns
    - Express constraints when needed
    - Focus on core functionality

2. Let HiveMind handle
    - Service discovery
    - Routing optimization
    - Trust management
    - Market dynamics

3. Schema Design
    - Express what's needed
    - Include optional constraints
    - Keep it standard GQL
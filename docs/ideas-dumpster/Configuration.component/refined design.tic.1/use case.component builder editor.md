# Editor Agnostic Architecture

## Core Concept

We're not tied to any specific editor. Instead, we define a GraphQL contract that any editor can implement:

```graphql
# Core schema defining how components interact
schema {
  query {
    component(id: ID!): Component
    componentTree(rootId: ID!): ComponentTree
    domain(name: String!): Domain
  }
  
  mutation {
    updateComponent(id: ID!, input: ComponentInput!): Component
    createComponent(input: ComponentInput!): Component
    deleteComponent(id: ID!): Boolean
  }
  
  subscription {
    componentUpdated(id: ID!): ComponentUpdate
  }
}

# Common types across all editors
type Component {
  id: ID!
  type: String!
  props: JSON
  children: [Component]
  domain: Domain!
}

type Domain {
  name: String!
  components: [ComponentDefinition]
  constraints: [Constraint]
}
```

## SpicetimeReactApp Client

```typescript
interface SpicetimeClient {
  // Core query handling
  queries: {
    // Local queries (in-memory)
    local: GraphQLClient,
    // Remote queries (network)
    remote: GraphQLClient,
    // Service routing
    route(query: Query): Promise<Result>
  },
  
  // State management
  state: {
    observe(pattern: Pattern): Observable<State>,
    mutate(change: Change): Promise<State>
  }
}
```

## Service Architecture

### Local Editor (e.g., PenPot)

```typescript
// PenPot implements our GQL schema
class PenPotService implements EditorService {
  // Handle component queries
  async queryComponent(id: string) {
    const penPotElement = await this.penpot.getElementById(id)
    return this.mapToComponent(penPotElement)
  }
  
  // Handle mutations
  async updateComponent(id: string, input: ComponentInput) {
    await this.penpot.updateElement(id, this.mapToPenPot(input))
    return this.queryComponent(id)
  }
}
```

### Remote Editor Service

```typescript
// Same interface, different implementation
class RemoteEditorService implements EditorService {
  // Forward to remote service
  async queryComponent(id: string) {
    return this.gqlClient.query({
      query: COMPONENT_QUERY,
      variables: { id }
    })
  }
  
  // Handle network state
  async updateComponent(id: string, input: ComponentInput) {
    await this.syncQueue.push({ id, input })
    return this.queryComponent(id)
  }
}
```

## GQL Gateway Component

```typescript
interface GQLGateway {
  // Route queries to appropriate service
  route(query: Query): Promise<Result> {
    const service = this.determineService(query)
    return service.execute(query)
  }
  
  // Service registry
  services: Map<string, EditorService>
  
  // Service routing rules
  routes: {
    local: RoutePattern[],
    remote: RoutePattern[]
  }
}
```

## Usage Examples

### Local PenPot Usage

```typescript
// Query components directly
const result = await spicetime.query(`
  query {
    component(id: "button-1") {
      type
      props
      children {
        id
        type
      }
    }
  }
`)

// Subscribe to changes
const subscription = spicetime.subscribe(`
  subscription {
    componentUpdated(id: "button-1") {
      props
      children
    }
  }
`)
```

### Remote Editor Usage

```typescript
// Same query, different service
const result = await spicetime.query(`
  query {
    component(id: "remote-button-1") {
      type
      props
      children {
        id
        type
      }
    }
  }
`, { service: 'remote' })
```

## Benefits of This Approach

1. Editor Independence
    - Any editor can implement our schema
    - Switch editors without changing app code
    - Mix and match editors as needed

2. Flexible Deployment
    - Run locally for simple cases
    - Use remote for heavy editing
    - Hybrid approach for different devices

3. Clear Boundaries
    - Editor concerns stay in editor
    - App concerns stay in app
    - Clean integration points

4. Performance Options
    - Local-first when possible
    - Remote when necessary
    - Smart caching and sync

## Example: Editor Choice Flow

```typescript
class EditorManager {
  // Choose appropriate editor
  selectEditor(context: Context): EditorService {
    if (this.isLowPowerDevice(context)) {
      return this.remoteEditor
    }
    
    if (this.needsCollaboration(context)) {
      return this.remoteEditor
    }
    
    return this.localEditor
  }
  
  // Set up appropriate client
  setupClient(editor: EditorService) {
    return new SpicetimeClient({
      editor,
      gateway: this.gateway,
      sync: this.syncStrategy
    })
  }
}
```

## State Management

```typescript
interface SpicetimeState {
  // Track component state
  components: Map<string, {
    local: Component | null,
    remote: Component | null,
    merged: Component
  }>,
  
  // Handle conflicts
  resolve(local: Component, remote: Component): Component
  
  // Sync strategies
  sync: {
    localFirst: SyncStrategy,
    remoteFirst: SyncStrategy,
    hybrid: SyncStrategy
  }
}
```

This architecture gives us complete freedom in editor choice while maintaining a consistent interface for our
application. PenPot becomes just one possible implementation, albeit our current reference one.
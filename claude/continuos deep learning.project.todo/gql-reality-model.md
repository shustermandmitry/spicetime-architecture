# GraphQL Reality Model: Adaptive Node Schemas

## Base Schema (All Nodes)
```graphql
# Every node starts with these basic types
type Node {
  id: ID!
  type: NodeType!
  capabilities: [Capability!]!
  resources: Resources!
  status: NodeStatus!
}

type Resources {
  cpu: Float!
  memory: Float!
  storage: Float!
  network: NetworkStatus!
}

# Expandable for different node types
enum NodeType {
  BASIC
  COMPUTE
  STORAGE
  GATEWAY
  FULL
}

# Base subscription all nodes handle
type Subscription {
  nodeUpdates(relevance: Float!): NodeUpdate!
  resourceAlerts: ResourceAlert!
}
```

## Node-Specific Schema Extensions

### Basic Node (Phone)
```graphql
# Minimal schema for resource-constrained devices
extend type Node {
  localServices: [BasicService!]!
  nearbyNodes: [Node!]!
}

type BasicService {
  id: ID!
  type: ServiceType!
  status: ServiceStatus!
}

# Minimal queries
type Query {
  findNearbyServices(type: ServiceType!): [BasicService!]!
  checkResourceAvailability: Resources!
}
```

### Compute Node (Laptop/Desktop)
```graphql
# Extended schema for computation-capable nodes
extend type Node {
  computeServices: [ComputeService!]!
  serviceQueue: [QueuedTask!]!
  performance: PerformanceMetrics!
}

type ComputeService {
  id: ID!
  type: ServiceType!
  capabilities: [ComputeCapability!]!
  currentLoad: Float!
  queue: [Task!]!
}

# Computation-specific queries
extend type Query {
  getAvailableCompute: [ComputeService!]!
  submitTask(task: TaskInput!): Task!
  getTaskResults(taskId: ID!): TaskResult
}
```

### Storage Node
```graphql
# Schema for nodes with storage capabilities
extend type Node {
  storageServices: [StorageService!]!
  replicationStatus: ReplicationStatus!
  dataAvailability: DataAvailability!
}

type StorageService {
  id: ID!
  capacity: Float!
  used: Float!
  replicationFactor: Int!
  storedData: [StoredData!]!
}

# Storage-specific queries
extend type Query {
  findStorageSpace(size: Float!): [StorageService!]!
  getStoredData(id: ID!): StoredData
  checkReplicationStatus(dataId: ID!): ReplicationStatus!
}
```

## Template Queries Based on Node Type

### Basic Node Template
```graphql
# Minimal resource usage, focused on service discovery
subscription BasicNodeUpdates {
  nodeUpdates(relevance: 0.8) {
    nearbyServices {
      id
      type
      status
    }
    resourceAlerts {
      type
      severity
    }
  }
}

query FindServices($type: ServiceType!) {
  findNearbyServices(type: $type) {
    id
    type
    status
  }
}
```

### Compute Node Template
```graphql
# Focused on task processing and resource management
subscription ComputeNodeUpdates {
  nodeUpdates(relevance: 0.9) {
    computeServices {
      id
      currentLoad
      queue {
        id
        priority
        estimated_completion
      }
    }
    resourceAlerts {
      type
      severity
      recommendations
    }
  }
}

query ProcessTask($task: TaskInput!) {
  submitTask(task: $task) {
    id
    status
    progress
    estimated_completion
  }
}
```

## React Components Using Templates

### Basic Node Component
```typescript
function BasicNode() {
  const { data } = useSubscription(BASIC_NODE_UPDATES);
  const [findServices] = useLazyQuery(FIND_SERVICES);

  return (
    <HiveMind.Consumer template="basic">
      <ServiceDirectory services={data?.nearbyServices} />
      <ResourceMonitor alerts={data?.resourceAlerts} />
    </HiveMind.Consumer>
  );
}
```

### Compute Node Component
```typescript
function ComputeNode() {
  const { data } = useSubscription(COMPUTE_NODE_UPDATES);
  const [submitTask] = useMutation(PROCESS_TASK);

  return (
    <HiveMind.Consumer template="compute">
      <ComputeServices services={data?.computeServices} />
      <TaskQueue queue={data?.queue} onSubmit={submitTask} />
      <PerformanceMetrics metrics={data?.performance} />
    </HiveMind.Consumer>
  );
}
```

## Dynamic Schema Loading

```typescript
// Load schema based on node capabilities
async function loadNodeSchema(capabilities: Capability[]) {
  const baseSchema = await loadBaseSchema();
  const extensions = capabilities.map(cap => 
    loadSchemaExtension(cap)
  );
  
  return mergeSchemas([baseSchema, ...extensions]);
}

// Initialize node with appropriate schema
async function initializeNode() {
  const capabilities = await detectCapabilities();
  const schema = await loadNodeSchema(capabilities);
  const templates = await loadQueryTemplates(capabilities);
  
  return {
    schema,
    templates,
    capabilities
  };
}
```

## Template System

```typescript
interface Template {
  queries: DocumentNode[];
  mutations: DocumentNode[];
  subscriptions: DocumentNode[];
  fragments: DocumentNode[];
}

// Load templates based on node type
async function loadTemplates(nodeType: NodeType): Promise<Template> {
  const baseTemplates = await loadBaseTemplates();
  const specificTemplates = await loadNodeSpecificTemplates(nodeType);
  
  return mergeTemplates(baseTemplates, specificTemplates);
}

// Apply template to node
function applyTemplate(node: Node, template: Template) {
  return {
    ...node,
    queries: template.queries,
    subscriptions: template.subscriptions,
    fragments: template.fragments
  };
}
```

## Usage in HiveMind

```tsx
function HiveMind({ children, nodeType }) {
  const [schema, setSchema] = useState(null);
  const [templates, setTemplates] = useState(null);

  useEffect(() => {
    async function init() {
      const nodeSchema = await loadNodeSchema(nodeType);
      const nodeTemplates = await loadTemplates(nodeType);
      
      setSchema(nodeSchema);
      setTemplates(nodeTemplates);
    }
    
    init();
  }, [nodeType]);

  if (!schema || !templates) return <Loading />;

  return (
    <GraphQLProvider schema={schema}>
      <TemplateProvider templates={templates}>
        {children}
      </TemplateProvider>
    </GraphQLProvider>
  );
}
```

The beauty of this approach is that:
1. Each node only loads what it can handle
2. Queries adapt to node capabilities
3. Schema grows with node capabilities
4. Templates make it easy to handle common patterns
5. Everything stays type-safe
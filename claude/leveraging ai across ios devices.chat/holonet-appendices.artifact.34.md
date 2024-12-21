# Technical Appendices

## Appendix A: Service Schemas

### A.1 Core Service Schemas
```graphql
# ROT Service
type ROTService {
  id: ID!
  status: ROTStatus!
  capabilities: ROTCapabilities!
  measurements: [Measurement!]!
  attestations: [Attestation!]!
}

# Storage Service
type StorageService {
  id: ID!
  status: StorageStatus!
  stores: [Store!]!
  metrics: StorageMetrics!
}

# Network Service
type NetworkService {
  id: ID!
  status: NetworkStatus!
  peers: [Peer!]!
  topology: NetworkTopology!
}

# Economic Service
type EconomicService {
  id: ID!
  status: EconomicStatus!
  transactions: [Transaction!]!
  balance: Balance!
}

# Model Service
type ModelService {
  id: ID!
  status: ModelStatus!
  models: [Model!]!
  shards: [Shard!]!
}
```

### A.2 Permission System Schema
```graphql
type PermissionService {
  id: ID!
  abstractions: [PermissionAbstraction!]!
  mappings: [PermissionMapping!]!
  translations: [Translation!]!
  status: ServiceStatus!
}

type PermissionAbstraction {
  id: ID!
  name: String!
  type: AbstractionType!
  schema: JSON!
  validator: Validator!
  translator: Translator!
  metadata: JSON
}
```

## Appendix B: API Specifications

### B.1 Service APIs
```typescript
interface ROTServiceAPI {
  attestNode(nodeId: string): Promise<Attestation>;
  verifyAttestation(attestation: Attestation): Promise<VerificationResult>;
  updateStatus(status: ROTStatus): Promise<void>;
}

interface StorageServiceAPI {
  createStore(config: StoreConfig): Promise<Store>;
  syncStore(storeId: string, peerId: string): Promise<SyncResult>;
  optimizeStorage(): Promise<OptimizationResult>;
}
```

### B.2 Client APIs
```typescript
interface HoloNetClient {
  rot: ROTClient;
  storage: StorageClient;
  network: NetworkClient;
  economic: EconomicClient;
  model: ModelClient;
}

class ROTClient {
  async attestNode(): Promise<Attestation>;
  async verifyAttestation(attestation: Attestation): Promise<VerificationResult>;
}
```

## Appendix C: Data Models

### C.1 Core Data Models
```typescript
interface Node {
  id: string;
  capabilities: Capabilities;
  status: NodeStatus;
  connections: Connection[];
}

interface Capabilities {
  memory: number;
  compute: number;
  storage: number;
  network: NetworkCapabilities;
}
```

### C.2 State Models
```typescript
interface State {
  version: number;
  timestamp: number;
  data: any;
  metadata: StateMetadata;
}

interface StateMetadata {
  origin: string;
  signatures: Signature[];
  conflicts: ConflictResolution[];
}
```

## Appendix D: Security Specifications

### D.1 Authentication
- Node identity verification
- Attestation protocols
- Trust chain establishment
- Key management

### D.2 Authorization
- Permission verification
- Resource access control
- Capability validation
- Context boundaries

### D.3 Privacy
- Data encryption
- Context isolation
- Secure channels
- Privacy boundaries

## Appendix E: Network Protocols

### E.1 Peer Discovery
- Local network discovery
- DHT-based discovery
- Bootstrap nodes
- NAT traversal

### E.2 State Synchronization
- CRDT operations
- Conflict resolution
- State merging
- Partition handling

### E.3 Resource Coordination
- Resource discovery
- Load balancing
- Capability sharing
- Resource optimization

## Appendix F: Economic Protocols

### F.1 Transaction Processing
- Transaction validation
- Credit management
- Resource accounting
- Payment channels

### F.2 Resource Pricing
- Dynamic pricing
- Resource markets
- Value translation
- Price discovery

## Appendix G: Deployment Guidelines

### G.1 Node Setup
- Hardware requirements
- Software installation
- Network configuration
- Security setup

### G.2 Network Setup
- Peer configuration
- Service deployment
- Resource allocation
- Monitoring setup

### G.3 Maintenance
- Update procedures
- Backup strategies
- Performance tuning
- Security updates
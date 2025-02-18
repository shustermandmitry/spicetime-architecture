# Patch and Aggregate Utilities Specification

## 1. Patch Utility

### 1.1 Core Purpose
- Standardize code modification process across different AI providers
- Handle atomic code changes with context awareness
- Maintain change history and rollback capability
- Provide validation and safety checks

### 1.2 Interface
```typescript
interface PatchOperation {
    id: string;
    filepath: string;
    type: 'insert' | 'modify' | 'delete';
    location: {
        start: number;
        end?: number;
        context?: string;  // surrounding code for validation
    };
    content?: string;      // new/modified content
    metadata: {
        source: string;    // AI provider or tool that generated it
        confidence: number;
        rationale: string;
        relatedDecisions: string[];
        timestamp: Date;
    };
    validation?: {
        syntaxCheck: boolean;
        contextMatch: boolean;
        testResults?: any;
    };
}

interface PatchResult {
    success: boolean;
    appliedPatchId: string;
    changes: {
        before: string;
        after: string;
    };
    validation: {
        passed: boolean;
        issues?: string[];
    };
    rollbackInfo: {
        id: string;
        snapshot: string;
    };
}
```

### 1.3 Capabilities
1. **Patch Generation**
   - Convert AI suggestions to structured patches
   - Handle multiple patch formats
   - Generate context-aware patches

2. **Validation**
   - Syntax verification
   - Context matching
   - Impact analysis
   - Test integration

3. **Application**
   - Atomic changes
   - Rollback support
   - Conflict resolution
   - Version control integration

4. **History**
   - Change tracking
   - Metadata preservation
   - Relationship mapping

## 2. Aggregate Utility

### 2.1 Core Purpose
- Collect and synthesize context from multiple sources
- Maintain hierarchical context structure
- Provide relevant context slices for different AI services
- Track context relationships and dependencies

### 2.2 Interface
```typescript
interface ContextItem {
    id: string;
    type: 'code' | 'decision' | 'architecture' | 'requirement' | 'change';
    content: string;
    metadata: {
        source: string;
        timestamp: Date;
        confidence: number;
        importance: number;
    };
    relationships: {
        dependsOn: string[];
        influences: string[];
        conflicts: string[];
    };
    scope: {
        files?: string[];
        components?: string[];
        features?: string[];
    };
}

interface ContextQuery {
    type?: string[];
    scope?: {
        files?: string[];
        components?: string[];
        features?: string[];
    };
    timeframe?: {
        start: Date;
        end: Date;
    };
    relationships?: {
        with: string;
        type: 'depends' | 'influences' | 'conflicts';
    };
    importance?: number;
    maxItems?: number;
}

interface AggregatedContext {
    items: ContextItem[];
    summary: string;
    metadata: {
        timestamp: Date;
        sources: string[];
        confidence: number;
    };
    relationships: {
        graph: any;  // dependency graph
        clusters: any[];  // related context clusters
    };
}
```

### 2.3 Capabilities
1. **Context Collection**
   - Multi-source aggregation
   - Real-time updates
   - Priority-based collection
   - Incremental updates

2. **Context Processing**
   - Relevance scoring
   - Redundancy elimination
   - Conflict detection
   - Relationship mapping

3. **Context Delivery**
   - Query-based retrieval
   - Context slicing
   - Format adaptation
   - Streaming updates

4. **Analysis**
   - Impact analysis
   - Dependency tracking
   - Pattern detection
   - Inconsistency detection

## 3. Integration Points

### 3.1 With AI Gateway
- Patch generation requests
- Context queries
- Provider-specific adaptations
- Error handling

### 3.2 With Local AI
- Real-time context updates
- Completion context
- Change validation
- Local caching

### 3.3 With AI Architect
- High-level context aggregation
- Architectural decision tracking
- Impact analysis
- Pattern recognition

### 3.4 With Developer Tools
- IDE integration
- VCS hooks
- CI/CD pipeline
- Testing framework

## 4. Implementation Priorities

### Phase 1: Core Functions
1. Basic patch operations
2. Simple context aggregation
3. File-level context
4. Basic validation

### Phase 2: Enhanced Features
1. Advanced context relationships
2. Improved validation
3. History tracking
4. Rollback support

### Phase 3: Advanced Integration
1. Multi-provider support
2. Real-time updates
3. Advanced analytics
4. Pattern recognition

# Process as Living Tree

## Core Concept

A process is fundamentally a living tree that:
- Evolves through life stages
- Has stage-specific reducer actions
- Builds artifact trees in each stage
- Uses React-like composition patterns

## Structure

### Life Tree
```typescript
type Process = {
  // Proto layer - API and base state
  state: StateTree             // Current state tree
  currentStage: string         // Active stage
  api: {                       // Public API subset
    // Core FP helpers visible to all stages
    map: (fn: Function) => void
    with: (data: any) => void
    on: (event: string, handler: Function) => void
    // Other runtime helpers
  }

  // Life stages layer
  stages: {
    // Each stage is a scope
    design: {
      // Stage-specific state
      processTree: Tree        // Component tree being built
      tools: Tool[]           // Available tools
      
      // Stage actions (reducers)
      doAddComponent: (component: Component) => void
      doUpdateLayout: (layout: Layout) => void
      // Other design actions
    }

    build: {
      buildTree: Tree         // Build artifacts
      configs: Config[]       // Build configs
      
      doBuild: (config: Config) => void
      doTest: (suite: TestSuite) => void
    }

    // Other stages with their state/actions
  }
}
```

### Stage Scope
```typescript
type Stage = {
  // Stage state
  artifact: Tree              // Tree being built in stage
  state: any                 // Stage-specific state
  
  // Stage reducers
  [action: `do${string}`]: Function  // Actions prefixed with 'do'
  
  // Tools/components available
  tools: Map<string, Tool>
}
```

## Core Mechanics

### 1. Stage Progression
- Stages are scopes in the life tree
- Current stage in proto layer
- Stage change through reducer action
- Access to lower stage scopes

```typescript
// Change stage
process.doChangeStage('build');

// Access lower stage
process.stages.build.doBuild(config);
```

### 2. Reducer Structure 
- Actions live in their stage scope
- Prefixed with 'do' to separate from state
- Update state immutably
- Can trigger stage changes

```typescript
const design = {
  // Stage state
  processTree: initialTree,
  
  // Stage reducer
  doAddComponent: (component) => {
    // Update tree immutably
    const newTree = addToTree(processTree, component);
    return { processTree: newTree };
  }
};
```

### 3. Artifact Trees
- Each stage builds its tree
- Trees composed like React
- Stage actions modify trees
- Trees flow between stages

```typescript
// Building component tree in design
design.doAddComponent(
  createElement('Feature', { name: 'login' },
    createElement('Component', { type: 'form' })
  )
);
```

### 4. Runtime Pattern
- State and actions in same object
- FP helpers in API layer
- Natural semantic structure
- Unified runtime model

```typescript
const process = {
  // State
  state: initialState,
  
  // FP helpers
  map: (fn) => {...},
  with: (data) => {...},
  
  // Stage actions
  stages: {
    design: {
      doCreate: () => {...},
      doUpdate: () => {...}
    }
  }
};
```

## Implementation Strategy

1. **Core Structure**
   - Process proto layer
   - Life stage scopes
   - Reducer actions
   - State trees

2. **Stage System**
   - Stage progression
   - Scope access
   - Action routing
   - State management

3. **Tree Building**
   - Component creation
   - Tree composition
   - React-like patterns
   - Tree transformation

4. **Runtime Integration**
   - FP helpers
   - Action dispatch
   - State updates
   - Tree operations

## Key Benefits

1. **Natural Structure**
   - Stages as scopes
   - Actions where they belong
   - State/actions unified
   - Clean semantics

2. **React Patterns**
   - Component trees
   - Composition model
   - State management
   - Event flow

3. **Clear Evolution**
   - Stage progression
   - Tree building
   - Artifact flow
   - State tracking

4. **Unified Runtime**
   - FP helpers
   - Action system
   - State management
   - Tree operations

The key elegance is in unifying:
- Stage scopes
- Reducer actions
- React patterns
- FP runtime

Everything lives where it belongs semantically while maintaining a clean, unified model.

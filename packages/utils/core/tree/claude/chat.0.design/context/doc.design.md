# Tree Core Design

## Core Concepts

### Trees
- Start with any base type
- Maintain internal state
- React to state changes
- Communicate with other trees

### State Management
```typescript
type TreeState = {
  readonly current: any;
  readonly handlers: StateHandlers;
  readonly neighbors?: Tree[];
};

type StateHandlers = {
  onChange?: (state: any, prev: any) => void;
  onNeighborChange?: (neighbor: Tree, change: any) => void;
};
```

### Composition Patterns

1. **extend**
   - Inherit through prototype chain
   - Access to state
   - State-aware methods

2. **mixin**
   - Direct property composition
   - State handlers
   - Behavior sharing

3. **evolve**
   - State-based transformations
   - Dynamic evolution
   - Reactive patterns

## Pipeline System

### Class Fixes
- Name handling
- Stack traces
- State initialization
- Event handling

### State Pipeline
```typescript
const tree = baseType({
  state: initialState,
  pipeline: [...classFixes],
  handlers: {
    onChange: stateHandler,
    onNeighbor: neighborHandler
  }
});
```

## Type System
- State type safety
- Handler type checking
- Neighbor type validation
- Event type inference

## Communication
- Neighbor detection
- State propagation
- Event handling
- Response patterns
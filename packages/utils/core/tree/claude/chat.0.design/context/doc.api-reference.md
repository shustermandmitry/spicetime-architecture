# Tree Core API Reference

## Core API

### tree(baseType, options)
Creates new tree with state management.
```typescript
const tree = createTree(Base, {
  state: initialState,
  handlers: stateHandlers,
  pipeline: customPipeline
});
```

### branch(name, compose, state?)
Creates new branch with state access.
```typescript
const Branch = tree.branch('Branch', 
  ({ extend }, state) => extend(base => ({
    grow() { state.size += 1; }
  }))
);
```

### leaf(state, ...args)
Creates instance with initial state.
```typescript
const instance = tree.leaf({
  size: 0,
  health: 100
});
```

## State Management

### setState(newState)
Updates tree state.
```typescript
tree.setState(prev => ({
  ...prev,
  size: prev.size + 1
}));
```

### onStateChange(handler)
Handles state changes.
```typescript
tree.onStateChange((state, prev) => {
  if (state.health < prev.health) {
    alert('health declining');
  }
});
```

### connectNeighbor(tree)
Establishes tree communication.
```typescript
tree1.connectNeighbor(tree2);
```

## Composition Utilities

### extend(fn, state)
Extends with state access.
```typescript
extend((base, state) => ({
  grow() { state.size += 1; }
}))
```

### mixin(props, state)
Mixes in state-aware properties.
```typescript
mixin({
  grow(state) { state.size += 1; }
})
```

### evolve(transform, state)
State-based transformation.
```typescript
evolve((base, state) => transform(base, state))
```

## Pipeline API

### addStateHandler(handler)
Adds state change handler.
```typescript
addStateHandler((state, prev) => {
  // Handle state change
});
```

### addNeighborHandler(handler)
Handles neighbor interactions.
```typescript
addNeighborHandler((neighbor, event) => {
  // Handle neighbor event
});
```
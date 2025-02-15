# Tree Core Usage Guide

## Basic Usage with State

### Creating Stateful Trees
```typescript
const tree = createTree(Base, {
  state: {
    size: 0,
    health: 100
  }
});
```

### State-Aware Branches
```typescript
const GrowingBranch = tree.branch('Growing', 
  ({ extend }, state) => extend(base => ({
    grow() {
      state.size += 1;
      if (state.size > 10) {
        state.health += 5;
      }
    }
  }))
);
```

### Stateful Leaves
```typescript
const instance = tree.leaf({
  size: 0,
  health: 100
});

instance.grow();  // Updates state
```

## State Patterns

### State Updates
```typescript
// Direct update
tree.setState({ size: 5 });

// Function update
tree.setState(prev => ({
  size: prev.size + 1
}));
```

### State Reactions
```typescript
tree.onStateChange((state, prev) => {
  if (state.health < prev.health) {
    // React to health decline
  }
});
```

### Tree Communication
```typescript
// Connect trees
tree1.connectNeighbor(tree2);

// React to neighbor
tree1.onNeighborChange((neighbor, change) => {
  if (change.type === 'distress') {
    // Help neighbor
  }
});
```

## Common Patterns

### Growing System
```typescript
const tree = createTree(Base, {
  state: { size: 0 },
  handlers: {
    onChange: (state, prev) => {
      if (state.size > prev.size) {
        // Trigger growth effects
      }
    }
  }
});
```

### Health System
```typescript
const HealthyTree = tree.branch('Healthy',
  ({ extend }, state) => extend(base => ({
    heal() {
      state.health = Math.min(100, state.health + 10);
    },
    damage(amount) {
      state.health = Math.max(0, state.health - amount);
    }
  }))
);
```

### Ecosystem
```typescript
// Create forest
const trees = Array(5).fill(0).map(i => 
  tree.leaf({ id: i, health: 100 })
);

// Connect neighbors
trees.forEach((tree, i) => {
  const next = trees[(i + 1) % trees.length];
  tree.connectNeighbor(next);
});

// Start life
trees.forEach(tree => tree.grow());
```

## Best Practices

1. **State Management**
   - Keep state minimal
   - Use handlers for logic
   - Update immutably

2. **Tree Communication**
   - Connect relevant neighbors
   - Handle events appropriately
   - Maintain state consistency

3. **Dynamic Behavior**
   - React to state changes
   - Evolve based on conditions
   - Communicate changes

4. **Type Safety**
   - Define state types
   - Type handlers properly
   - Validate interactions
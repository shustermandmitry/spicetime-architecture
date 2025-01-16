# Discovery and Perspective: Managing Personal Spicetime

## Core Components

### Discovery Process

```typescript
const Discovery = Process({
  // Never-ending loop
  loop: {
    // What we're looking for
    query: GraphQLQuery,
    // Where we've been
    history: SpicetimeTree,
    // What we've found
    discoveries: Map<NodeId, Interface>,
    
    // Main loop
    tick: async () => {
      // Look for new things
      const found = await explore()
      // Tell Perspective
      await perspective.evaluate(found)
      // Wait a bit
      await sleep(backoff())
    }
  }
})
```

### Perspective Component

```typescript
const Perspective = Component({
  // Personal view of spicetime
  state: {
    // What we can see
    view: SpicetimeTree,
    // Resource limits
    bounds: {
      storage: number,
      memory: number,
      cpu: number
    },
    // Usage patterns
    patterns: UsageHistory
  },
  
  // Manage our view
  actions: {
    prune: () => void,
    focus: (area: SpicetimeVolume) => void,
    defocus: (area: SpicetimeVolume) => void
  }
})
```

## How They Interact

### Discovery → Perspective

```typescript
interface DiscoveryFlow {
  // When Discovery finds something
  onDiscover: {
    // Ask Perspective if we care
    shouldTrack: (discovery: Discovery) => boolean,
    // Let Perspective know what we found
    notify: (discovery: Discovery) => void,
    // Handle Perspective's response
    adapt: (response: PruneCommand) => void
  }
}
```

### Perspective → Discovery

```typescript
interface PerspectiveFlow {
  // When Perspective needs to manage space
  onPressure: {
    // Tell Discovery where to look
    focus: (area: SpicetimeVolume) => void,
    // Tell Discovery what to ignore
    exclude: (area: SpicetimeVolume) => void,
    // Update Discovery's priorities
    adjust: (priorities: DiscoveryPriority) => void
  }
}
```

## Resource Management

### Memory Pressure Handling

```typescript
interface PressureResponse {
  // When we're using too much
  onPressure: {
    // Perspective prunes view
    prune: {
      unused: () => void,
      old: () => void,
      far: () => void
    },
    // Discovery adjusts behavior
    adjust: {
      rate: () => void,
      depth: () => void,
      focus: () => void
    }
  }
}
```

### Focus Management

```typescript
interface FocusSystem {
  // Keep what matters
  focus: {
    // Active areas
    hot: SpicetimeVolume[],
    // Important but inactive
    warm: SpicetimeVolume[],
    // Can be dropped
    cold: SpicetimeVolume[]
  },
  
  // Manage transitions
  transition: {
    hot_to_warm: () => void,
    warm_to_cold: () => void,
    cold_to_drop: () => void
  }
}
```

## Working Together

### Normal Operation

```typescript
// Discovery loop
while (true) {
  // Look for new things
  const discoveries = await Discovery.explore()
  
  // Check with Perspective
  if (await Perspective.shouldTrack(discoveries)) {
    // Add to our view
    await Perspective.add(discoveries)
    
    // Adjust if needed
    if (Perspective.underPressure()) {
      await Perspective.prune()
      await Discovery.adjustFocus()
    }
  }
}
```

### Pressure Response

```typescript
// When memory gets tight
onPressure: async () => {
  // First, Perspective prunes
  const pruned = await Perspective.prune()
  
  // Tell Discovery what changed
  await Discovery.updateBounds(pruned)
  
  // Adjust Discovery behavior
  Discovery.backoff()
  Discovery.narrowFocus()
}
```

## Best Practices

### 1. Progressive Discovery

- Start with immediate needs
- Expand gradually
- Stay within bounds
- Follow usage patterns

### 2. Smart Pruning

- Drop least used first
- Keep important contexts
- Maintain core paths
- Compress when possible

### 3. Coordinated Actions

- Discovery checks with Perspective
- Perspective guides Discovery
- Both respect resource limits
- Both adapt to usage

## Example Scenarios

### 1. New Area Discovery

```typescript
// When finding new service
async function onNewService(service: Service) {
  // Check if we care
  if (Perspective.isRelevant(service)) {
    // Add to our view
    await Perspective.track(service)
    
    // Maybe explore more
    if (Perspective.hasCapacity()) {
      await Discovery.exploreAround(service)
    }
  }
}
```

### 2. Memory Pressure

```typescript
// When memory gets tight
async function onMemoryPressure() {
  // Perspective prunes
  const pruned = await Perspective.prune()
  
  // Discovery adjusts
  await Discovery.narrow({
    exclude: pruned.areas,
    depth: pruned.newDepth,
    rate: pruned.newRate
  })
}
```

### 3. Focus Change

```typescript
// When user changes focus
async function onFocusChange(area: SpicetimeVolume) {
  // Perspective shifts
  await Perspective.focus(area)
  
  // Discovery follows
  await Discovery.prioritize(area)
  
  // Both clean up old focus
  await Promise.all([
    Perspective.defocus(oldArea),
    Discovery.deprioritize(oldArea)
  ])
}
```
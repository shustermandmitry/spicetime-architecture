# Process Composition Through Reducer Patterns

## Core Concept

A process is composed of reducer patterns - units that bundle:
- State structure
- Actions that operate on that state
- Stage context where they live

Each stage in a process is a collection of these reducer patterns.

## Reducer Pattern Structure

```typescript
type ReducerPattern = {
  // State structure this pattern manages
  state: {
    shape: any,               // State shape
    initial: any             // Initial values
  },

  // Actions that operate on this state
  actions: {
    [`do${string}`]: (state: any, payload: any) => any
  },

  // Stage this pattern belongs to
  stage: string
};

// Example reducer pattern
const featurePattern = {
  // State structure
  state: {
    shape: {
      name: string,
      status: "pending" | "active" | "complete",
      artifacts: any[]
    },
    initial: {
      name: "",
      status: "pending",
      artifacts: []
    }
  },

  // Actions
  actions: {
    doStart: (state, { name }) => ({
      ...state,
      name,
      status: "active"
    }),
    
    doAddArtifact: (state, artifact) => ({
      ...state,
      artifacts: [...state.artifacts, artifact]
    }),
    
    doComplete: (state) => ({
      ...state,
      status: "complete"
    })
  },

  // Stage context
  stage: "development"
};
```

## Process Composition

### 1. Composing Reducer Patterns
```typescript
const compose = {
  // Compose reducer patterns
  patterns: (a: ReducerPattern, b: ReducerPattern): ReducerPattern => ({
    // Merge state shapes
    state: {
      shape: {...a.state.shape, ...b.state.shape},
      initial: {...a.state.initial, ...b.state.initial}
    },
    
    // Merge actions
    actions: {
      ...a.actions,
      ...b.actions
    },
    
    // Patterns must be from same stage
    stage: a.stage
  }),

  // Compose multiple patterns
  many: (patterns: ReducerPattern[]): ReducerPattern => 
    patterns.reduce(compose.patterns)
};
```

### 2. Stage Composition
```typescript
// A stage is a collection of reducer patterns
type Stage = {
  patterns: ReducerPattern[],
  name: string
};

const stages = {
  // Compose stages by composing their patterns
  compose: (a: Stage, b: Stage): Stage => ({
    name: a.name,
    patterns: compose.many([...a.patterns, ...b.patterns])
  })
};
```

### 3. Process Composition
```typescript
type Process = {
  stages: Map<string, Stage>,
  
  // API exposes compositions
  compose: {
    withProcess: (other: Process) => Process,
    withStage: (stage: Stage) => Process,
    withPattern: (pattern: ReducerPattern) => Process
  }
};

// Process composition happens through pattern composition
const createProcess = (config: {
  patterns?: ReducerPattern[],
  stages?: Stage[],
  processes?: Process[]
}) => {
  // Start with base patterns
  let patterns = config.patterns || [];
  
  // Add patterns from stages
  config.stages?.forEach(stage => {
    patterns = [...patterns, ...stage.patterns];
  });
  
  // Add patterns from other processes
  config.processes?.forEach(process => {
    process.stages.forEach(stage => {
      patterns = [...patterns, ...stage.patterns];
    });
  });
  
  // Group patterns by stage
  const stages = new Map();
  patterns.forEach(pattern => {
    const stage = stages.get(pattern.stage) || { 
      name: pattern.stage, 
      patterns: []
    };
    stage.patterns.push(pattern);
    stages.set(pattern.stage, stage);
  });
  
  return {
    stages,
    compose: {
      withProcess: (other) => createProcess({
        processes: [other]
      }),
      withStage: (stage) => createProcess({
        stages: [stage]
      }),
      withPattern: (pattern) => createProcess({
        patterns: [pattern]
      })
    }
  };
};
```

## Usage Example

```typescript
// Define reducer patterns
const featurePattern = {
  state: {
    shape: { name: string, status: string },
    initial: { name: "", status: "pending" }
  },
  actions: {
    doStart: (state, name) => ({...state, name, status: "active"})
  },
  stage: "development"
};

const taskPattern = {
  state: {
    shape: { tasks: Task[] },
    initial: { tasks: [] }
  },
  actions: {
    doAddTask: (state, task) => ({
      ...state,
      tasks: [...state.tasks, task]
    })
  },
  stage: "development"
};

// Compose patterns into process
const process = createProcess({
  patterns: [featurePattern, taskPattern]
});

// Add another process's patterns
const enhanced = process.compose.withProcess(otherProcess);

// State and actions compose naturally
enhanced.stages.get("development").patterns[0].actions.doStart("MyFeature");
enhanced.stages.get("development").patterns[1].actions.doAddTask(newTask);
```

## Key Benefits

1. **Natural Composition**
   - State and actions compose together
   - Patterns group by stage automatically
   - Clean reducer pattern reuse

2. **Stage Awareness**
   - Patterns know their stage context
   - Stages compose through patterns
   - Stage boundaries maintained

3. **Flexible Composition**
   - Compose at pattern level
   - Compose at stage level
   - Compose full processes

The key insight is that reducer patterns (state + actions) are the fundamental composable unit, not state and actions separately.

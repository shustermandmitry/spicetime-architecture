# Process as Language

## Core Concept

A process is a linguistic model where:
- Props are vocabulary (verbs and nouns)
- Proto chain layers dialect evolution
- Composition merges linguistic domains
- Natural functional English emerges

## Language Structure

```typescript
// Base linguistic layer (proto)
const processLanguage = {
  // Nouns (state)
  state: "initial",
  items: [],
  context: {},

  // Verbs (actions) 
  doAdd: (item) => ({...this, items: [...this.items, item]}),
  doMove: (item, to) => /*...*/,
  doUpdate: (changes) => ({...this, ...changes}),

  // FP vocabulary helpers
  map: (fn) => fn(this),
  with: (data) => ({...this, ...data}),
  into: (target) => ({...target, ...this})
};

// Domain adds its dialect
const domainLanguage = {
  __proto__: processLanguage,

  // Domain-specific nouns
  features: new Map(),
  settings: {},

  // Domain verbs
  doCreateFeature: (spec) => /*...*/,
  doConfigureSettings: (config) => /*...*/,

  // Composed actions using base vocabulary
  doMyFavoriteThing: () => this
    .map(addStuff)
    .with(newContext)
    .into(newState)
};

// Process instance extends language
const process = {
  __proto__: domainLanguage,

  // Process-specific vocabulary
  status: "ready",
  artifacts: [],

  // Process actions composing domain language
  doBuildFeature: (spec) => this
    .doCreateFeature(spec)
    .doConfigureSettings(spec.config)
    .doUpdate({status: "building"})
};
```

## Linguistic Evolution

### 1. Base Vocabulary
```typescript
// Core linguistic elements
const base = {
  // FP primitives form basic grammar
  map: (fn) => fn(this),
  with: (data) => ({...this, ...data}),
  pipe: (...fns) => fns.reduce((a, f) => f(a), this),
  into: (target) => ({...target, ...this}),
  
  // Basic vocabulary
  do: (action) => action(this),
  get: (prop) => this[prop],
  set: (prop, value) => ({...this, [prop]: value})
};
```

### 2. Domain Dialects
```typescript
// Domain adds linguistic patterns
const domain = {
  __proto__: base,

  // Domain extends vocabulary
  withContext: (ctx) => this.with({context: ctx}),
  intoState: (state) => this.into(state),
  throughPipeline: (...steps) => this.pipe(...steps),

  // Semantic combinations
  doComplexThing: () => this
    .withContext(newContext)
    .throughPipeline(step1, step2)
    .intoState(finalState)
};
```

### 3. Process Expressions
```typescript
// Process composes language
const process = {
  __proto__: domain,

  // Process-specific expressions
  doBuildFeature: (spec) => this
    .withContext({type: "feature", spec})
    .throughPipeline(
      validateSpec,
      prepareContext,
      buildFeature
    )
    .intoState({status: "complete"})
};
```

## Linguistic Composition

### 1. Dialect Merging
```typescript
// Merge linguistic domains
const merged = {
  __proto__: baseDialect,
  ...otherDialect,
  
  // Resolve vocabulary conflicts
  resolveConflicts: () => {
    // Create new terms for conflicts
    // Or choose dominant dialect
  }
};
```

### 2. Pipeline Flavoring
```typescript
// Modify linguistic terms
const flavored = {
  __proto__: process,

  // Override term meanings
  doComplexThing: () => this
    .withContext(specialContext)
    .throughPipeline(
      enhancedStep1,
      customStep2
    )
    .intoState(flavoredState)
};
```

## Key Benefits

1. **Natural Expression**
   - Reads like English
   - Verbs and nouns clear
   - FP aids composition
   - Clean semantics

2. **Linguistic Evolution**
   - Base vocabulary
   - Domain dialects
   - Process expressions
   - Natural layering

3. **Composable Language**
   - Dialects merge
   - Terms evolve
   - Meaning preserved
   - Clean composition

The key insight is that processes naturally form a language:
- Props are vocabulary
- Actions are verbs
- State props are nouns
- Proto chain layers dialects
- Composition merges languages

This makes processes both executable and linguistically meaningful.
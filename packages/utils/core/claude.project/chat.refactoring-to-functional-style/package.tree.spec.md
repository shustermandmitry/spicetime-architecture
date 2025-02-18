# Tree Composition Pattern

## Motivation

Many domains require hierarchical organization with consistent behavior at each level. The pattern emerged from implementing a better error handling system that needed:

1. Natural domain grouping (e.g., validation.user.email)
2. Construction at any level (leaf nodes)
3. Further specialization capabilities (branches)
4. Simple functional composition

## Core Pattern 

### Tree Node Structure

Every node provides two operations:
- `leaf`: Creates an instance at current path
- `branch`: Creates new subtree with extended path

```javascript
const node = {
  leaf: (config) => instance,
  branch: path => anotherNode
}
```

### Error System Use Case

Error handling demonstrates the pattern's utility:

```javascript
// Error tree creation
const errorTree = createTree(
  // Leaf constructor
  (message, info) => construct(message, info),
  // Branch constructor factory
  type => (message, info) => constructTyped(type, message, info)
)

// Usage
const validationError = errorTree
  .branch('validation.user.email')
  .leaf('invalid format')
```

## Implementation Pattern

### Core Construction

Two fundamental operations define behavior:
```javascript
// Direct instance creation
const construct = (config) => instance

// Factory for specialized constructors
const constructFactory = (type) => (config) => instance
```

### Tree Formation

Tree structure preserves path context:
```javascript
const createTree = (leaf, branch, parentPath = '') => ({
  leaf,
  branch: path => {
    const fullPath = joinPaths(parentPath, path)
    return createTree(
      branch(fullPath),
      nextPath => branch(joinPaths(fullPath, nextPath)),
      fullPath
    )
  }
})
```

## Usage Patterns

1. Full path specification:
```javascript
const instance = tree
  .branch('domain.subdomain.type')
  .leaf(config)
```

2. Incremental construction:
```javascript
const domainTree = tree.branch('domain')
const subTree = domainTree.branch('subdomain')
const instance = subTree.branch('type').leaf(config)
```

3. Mixed approach:
```javascript
const domainTree = tree.branch('domain')
const instance = domainTree.branch('subdomain.type').leaf(config)
```

## Example: Error System Implementation

The error system demonstrates how to implement the pattern:

```javascript
// Basic error construction
const construct = (message, extInfo) => ({
  name: 'STError',
  info: {
    message,
    extInfo
  }
})

// Error type factory
const constructFactory = errorType => (message, extInfo) => ({
  name: errorType,
  info: {
    message,
    extInfo
  }
})

// Create error tree
const errorTree = createTree(
  construct,
  type => constructFactory(type)
)

// Usage
const error = errorTree.leaf('basic error')
const typeError = errorTree.branch('validation').leaf('bad input')
const emailError = errorTree.branch('validation.user.email').leaf('bad format')
```

## Benefits

1. Composition
   - Natural hierarchy
   - Consistent behavior
   - Flexible organization
   - Path-based structure

2. Implementation
   - Simple functions
   - Clear pattern
   - Easy to understand
   - Highly reusable

3. Usage
   - Intuitive API
   - Flexible paths
   - Clear organization
   - Self-documenting

## Applications

1. Error Systems
   - Domain organization
   - Type hierarchies
   - Error specialization
   - Context preservation

2. Other Potential Uses
   - Component trees
   - Configuration systems
   - Permission hierarchies
   - Command systems

## Future Patterns

1. Tree Operations
   - Merging trees
   - Extracting subtrees
   - Path transformation
   - Pattern matching

2. Enhanced Features
   - Path validation
   - Type inference
   - Tree traversal
   - Node discovery
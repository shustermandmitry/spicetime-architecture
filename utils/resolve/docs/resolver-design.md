# Path Resolver Design

Category: Utils/FileSystem

## Core Responsibility

The path resolver is a foundational utility that resolves paths within repository boundaries using space-time
coordinates to determine root location. All paths are resolved relative to the repository root, making path handling
consistent and portable across different repository instances.

## Key Concepts

### Repository Root Location

- Uses package version coordinates to determine distance from root
- Only counts levels containing package.json files
- Maximum traverse distance determined by coordinates
- Early detection of structural inconsistencies

### Path Resolution Rules

- All paths resolved relative to repo root
- "Absolute" means absolute from repo root
- External filesystem locations not expressible
- Portable across repository instances

## Module Interface

### Root Finding

```typescript
// Private, called at module initialization
function findRepoRoot(): Promise<string> {
    // Uses version coordinates to locate root
    // Validates structure consistency
    // Emits structural events
}
```

### Public API

```typescript
function resolvePaths(
    patterns: string | string[],
    options?: {
        extensions?: string[]
        excludePatterns?: string[]
        maxDepth?: number
    }
): Promise<string[]>

function validatePath(
    filePath: string
): Promise<string>
```

## Event Pipeline

### Root Location Events

```typescript
// Root found successfully
{
    action: 'found repo root',
    target: '/abs/path/to/root'
}

// Structure inconsistency detected
{
    action: 'invalid repo structure',
    target: '/current/path',
    error: 'reason',
    context: {
        expectedSteps: number,
        actualSteps: number
    }
}
```

### Path Resolution Events

```typescript
// Pattern resolution started
{
    action: 'resolve paths',
    target: 'pattern string'
}

// Path validation
{
    action: 'validate path',
    target: '/abs/path',
    context: { stats: FSStats }
}
```

## Error Handling

### Error Types

All errors are instances of PathError with specific contexts:

- Structure inconsistency errors
- Path resolution errors
- Validation errors
- Access errors

### Error Flow

1. Detect error condition
2. Emit error event
3. Throw PathError with context
4. Allow higher scopes to handle

## Test Scenarios

### Root Finding

1. Correct structure matches coordinates
2. Missing package.json detected
3. Incorrect nesting depth detected
4. Root package.json identification

### Path Resolution

1. Single path resolution
2. Multiple pattern resolution
3. Extension filtering
4. Depth limiting
5. Pattern exclusion

### Path Validation

1. Existing path validation
2. Non-existent path handling
3. Stats collection
4. Access error handling

### Event Emission

1. Root location events
2. Resolution events
3. Validation events
4. Error events

## Usage Patterns

### Basic Resolution

```javascript
const paths = await resolvePaths('./src/**/*.js');
// Returns paths relative to repo root
```

### Filtered Resolution

```javascript
const paths = await resolvePaths(['./src', './lib'], {
    extensions: ['.js', '.ts'],
    maxDepth: 2
});
// Returns filtered, depth-limited paths
```

### Path Validation

```javascript
const absPath = await validatePath('./config.json');
// Returns validated absolute path from root
```

## Implementation Notes

### Root Finding

- Cache root path after first resolution
- Validate package.json content
- Count only real package boundaries
- Respect coordinate constraints

### Resolution Process

- Convert all paths to root-relative
- Handle glob pattern expansion
- Apply filters and limits
- Return consistent paths

### Validation Process

- Verify path existence
- Collect path statistics
- Emit appropriate events
- Return consistent format

## Future Considerations

### Pattern Enhancement

- Custom pattern recognition
- Advanced glob syntax
- Pattern transformation hooks

### Performance Optimization

- Root path caching
- Pattern compilation
- Batch operations

### Integration Points

- React component integration
- Build tool integration
- IDE plugin support

## Dependencies

- fast-glob: Pattern matching
- @spicetime/util-errors: Error types
- @spicetime/util-events: Event emission
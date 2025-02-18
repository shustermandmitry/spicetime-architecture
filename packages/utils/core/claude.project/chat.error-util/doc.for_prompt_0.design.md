# Error Utility Design Document

## Overview
The error utility provides a foundation for error handling across the STA repository. It exports a base error class that extends native Error and adds structured location and context tracking.

## Core Exports

### `Error` Base Class
```typescript
class Error extends global.Error {
  info: ErrorInfo[]

  constructor(
    message: string,
    options?: {
      externalSourceInfo?: {
        name: string,
        message: string
      },
      cause?: Error
    }
  )

  static createCustomErrorType(
    typeName: string,
    extendedProps?: Record<string, unknown>
  ): typeof Error
}
```

### Types
```typescript
interface ErrorInfo {
  location: LocationInfo
  message: string
}

// Location interface to be fully defined by location utility
interface LocationInfo {
  type: 'external' | 'package'
  // For external sources
  source?: string
  // For packages - details TBD with location utility
  packageName?: string
  packageVersion?: string
  pathFromRoot?: string
}
```

## Usage Examples

### Creating Base Error
```typescript
throw new Error('Operation failed')
```

### Creating Error from External Source 
```typescript
throw new Error('Failed to process response', {
  externalSourceInfo: {
    name: 'AWS Lambda',
    message: 'Timeout after 30s'
  }
})
```

### Creating Custom Error Type
```typescript
const DataError = Error.createCustomErrorType('DataError', {
  invalidFields: [] // Optional extended properties
})

throw new DataError('Invalid data format')
```

### Error Propagation
```typescript
try {
  // Operation that may throw
} catch (err) {
  throw new Error('Higher level operation failed', {
    cause: err
  })
}
```

## Implementation Requirements

1. Preserve native Error stack trace functionality
2. Integrate with location utility for package/source context
3. Support error cause chain
4. Support custom error type creation with extended properties
5. Maintain array of error info objects for propagation path

## Dependencies
- Location utility (for package/source location info)

## Error Info Stack Example
```typescript
error.info = [
  {
    location: {
      type: 'external',
      source: 'AWS Lambda'
    },
    message: 'Timeout after 30s'
  },
  {
    location: {
      type: 'package',
      packageName: 'data-processor',
      packageVersion: '1.0.0',
      pathFromRoot: '/packages/utils/data-processor'
    },
    message: 'Failed to process Lambda response'
  }
]
```

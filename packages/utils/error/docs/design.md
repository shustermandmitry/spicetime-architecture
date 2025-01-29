# Error System Design

Category: Utils/Errors

## Core Responsibility

Provides a foundational error system that combines standard JavaScript error handling with SpiceTime's event pipeline.
Designed to support TypeScript migration with proper type extensions.

## JavaScript Implementation Limitations

The current JavaScript implementation provides a `createCustomError` factory method which, while functional, doesn't
capture the full intent of the design. In JavaScript:

```javascript
// Creates a custom error type - somewhat redundant in JS
const FSError = STError.createCustomError('FSError');
```

This pattern exists primarily to support future TypeScript migration where it will enable proper type extension:

```typescript
// Future TypeScript implementation
interface FSErrorInfo extends ErrorInfo {
    path: string;
    operation: string;
}

const FSError = StError.createCustomError<FSErrorInfo>('FSError');
```

## Module Structure

```
utils/
  errors/
    StError.js         # Base error class only
    StError.test.js    # Base error tests
    docs/
      design.md        # This document
```

Domain-specific errors live with their domains:

```
utils/
  fs/
    errors.js          # FSError = StError.createCustomError('FSError')
```

## Base Error (StError)

### Import and Basic Usage

```javascript
import { StError } from '@spicetime/util-errors/StError';

// Base error usage
throw new StError('Operation failed', {
    type: 'CustomError',    
    source: 'yourFunction', 
    context: {             
        operation: 'read',
        target: 'file.txt'
    }
});
```

### Creating Domain Errors

```javascript
// In your domain's errors.js
import { StError } from '@spicetime/util-errors/StError';

export const FSError = StError.createCustomError('FSError');

// Usage
throw new FSError(
    'File not accessible',
    'readConfig',
    { path: '/config.json' }
);
```

### Error Event Format

```typescript
{
    action: 'error',
    target: source,     // Where error occurred
    error: message,     // Error description
    context: {
        type: string,   // Error type
        ...context     // Additional context
    }
}
```

## Error Handling

```javascript
try {
    await operation();
} catch (err) {
    if (err instanceof STError) {
        // Handle system error
        console.error(`${err.info.type}:`, err.message);
        console.error('Context:', err.info.context);
    } else {
        // Handle unknown error
        console.error('Unknown error:', err);
    }
}
```

## Implementation Notes

### JavaScript Limitations

- No type safety for error context
- No compile-time checks for error structure
- Factory method feels redundant
- Limited type inheritance benefits

### TypeScript Benefits (Future)

- Type-safe error context
- Extended interface inheritance
- Proper type constraints
- Compile-time error checking

### Creating Domain Errors

1. Import StError in domain
2. Create error type using factory
3. Export for domain usage
4. Document expected context

Example:

```javascript
// domain/errors.js
import { StError } from '@spicetime/util-errors/StError';

export const DomainError = StError.createCustomError('DomainError');

// Later in domain code
throw new DomainError(
    'Operation failed',
    'processData',
    { operation: 'transform' }
);
```

## Dependencies

- @spicetime/util-events: Error event emission

## Future TypeScript Migration

The current design facilitates migration to TypeScript where we'll get:

- Type-safe error contexts
- Interface inheritance
- Proper type constraints
- Compile-time error checking

This will make the factory pattern more meaningful and provide better type safety across the error system.
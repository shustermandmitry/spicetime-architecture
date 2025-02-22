# Core Error Utility Design Specification

## Core Principles

1. **Pure JavaScript Class Semantics**
   - Standard class extension of Error
   - Natural `new` keyword instantiation
   - No static factory methods or name manipulation
   - Let JavaScript handle class naming/inheritance

2. **Zero Dependencies**
   - Self-contained location resolution
   - Built-in path handling
   - No external utilities or helpers
   - Pure Node.js built-ins only

3. **Minimal Surface Area**
   - Single responsibility: error enrichment
   - Location tracking
   - Extended info attachment
   - Clean stack traces

## Class Structure

```typescript
class STError extends Error {
  info: ErrorInfo;
  
  constructor(message: string, extInfo?: unknown);
}
```

## Core Features

1. **Error Information**
   - Type: Base error type name
   - Message: Human-readable description
   - Location: File/package context
   - ExtInfo: Optional metadata

2. **Location Resolution** 
   - Package path detection
   - STA root identification
   - Graceful fallbacks
   - Path caching

3. **Error Inheritance**
   - Direct class extension
   - Natural JavaScript inheritance
   - Example:
     ```typescript
     class ValidationError extends STError {
       constructor(message: string, extInfo?: unknown) {
         super(message, extInfo);
       }
     }
     ```

## Usage Patterns

1. **Base Error**
   ```typescript
   throw new STError("Operation failed");
   ```

2. **With Context**
   ```typescript
   throw new STError("Validation failed", {
     fields: ['email'],
     constraints: { format: 'email' }
   });
   ```

3. **Custom Types**
   ```typescript
   class ValidationError extends STError {
     constructor(message: string, fields: string[]) {
       super(message, { fields });
     }
   }

   throw new ValidationError("Invalid input", ['email']);
   ```

## Implementation Guidelines

1. **Location Resolution**
   - Walk directory tree synchronously
   - Cache results when possible
   - Use process.cwd() as fallback
   - Handle edge cases gracefully

2. **Error Info Construction**
   - Guarantee complete info object
   - Validate all fields
   - Safe handling of undefined/null
   - Preserve stack traces

3. **Extension Support**
   - Clean inheritance chain
   - Preserved prototype methods
   - Proper 'instanceof' behavior
   - Stack trace clarity

## Testing Focus

1. **Core Behavior**
   - Error instantiation
   - Info structure
   - Location resolution
   - Extended info handling

2. **Inheritance**
   - Class extension
   - Constructor chaining
   - Property inheritance
   - Method preservation

3. **Edge Cases**
   - Invalid inputs
   - Missing locations
   - Circular references
   - Deep nesting

## Migration Path

1. **For Existing Code**
   - Direct class extension
   - Remove factory usage
   - Update type definitions
   - Verify instanceof checks

2. **Documentation Updates**
   - Clear extension examples
   - Usage patterns
   - Best practices
   - Migration guide

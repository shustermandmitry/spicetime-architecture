# Error Utility Design - Zero Dependencies

## Core Design Principles

1. No internal dependencies
2. Self-contained location resolution
3. Simple, focused error handling

## Core Classes

```typescript
class STError extends Error {
  constructor(message: string, extInfo?: unknown) {
    super(message);
    this.name = 'STError';
    this.info = this.buildErrorInfo(message, extInfo);
  }

  private buildErrorInfo(message: string, extInfo?: unknown): ErrorInfo {
    return {
      errorType: this.name,
      message,
      location: this.resolveLocation(),
      extInfo: extInfo || null
    };
  }

  // Minimal location resolver built into error util
  private resolveLocation(): Location {
    try {
      // Simple path resolution walking up for package.json
      const location = {
        packagePath: this.findNearestPackageJson(),
        staRootPath: this.findSTARoot()
      };
      return location;
    } catch {
      // Fallback if location resolution fails
      return {
        packagePath: process.cwd(),
        staRootPath: null
      };
    }
  }

  // Create custom error type factory
  static createCustomError(errorType: string): typeof STError {
    return class CustomError extends STError {
      constructor(message: string, extInfo?: unknown) {
        super(message, extInfo);
        this.name = errorType;
      }
    };
  }
}

interface ErrorInfo {
  errorType: string;
  message: string;
  location: Location;
  extInfo: unknown | null;
}

interface Location {
  packagePath: string;  // Path to nearest package.json
  staRootPath: string | null;  // Path to STA root or null if not found
}
```

## Key Changes

1. **Removed Location Dependency**
   - Built minimal path resolution directly into error util
   - Simple package.json and root finding without external deps
   - Graceful fallback if location resolution fails

2. **Simplified Error Info**
   - Reduced complexity of error metadata
   - Focus on essential information only
   - Built-in extInfo for additional context

3. **Zero Dependencies**
   - No imports from other STA utils
   - Self-contained functionality
   - Uses only Node.js built-ins

## Usage Examples

```typescript
// Basic error
throw new STError("Operation failed");

// Custom error type
const ValidationError = STError.createCustomError('ValidationError');
throw new ValidationError("Invalid input", { 
  fields: ['email'] 
});

// With external error info
try {
  await someOperation();
} catch (err) {
  throw new STError("Operation failed", err);
}
```

## Implementation Notes

1. Location resolution is best-effort with graceful fallbacks
2. Uses synchronous operations for simplicity
3. Maintains core error functionality without dependencies
4. Easy to extend through createCustomError factory
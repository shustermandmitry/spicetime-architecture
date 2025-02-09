# Error Utility

A minimal-dependency error handling utility for monorepo projects, providing enhanced error tracking, location resolution, and custom error type creation.

## Features

- 🔍 Automatic location tracking using find-up
- 📦 Custom error type creation
- 💡 Extended error information
- 🔒 Type-safe error handling
- 🔗 Error chaining support

## Installation

```bash
npm install @core-utils/error find-up
```

## Basic Usage

```typescript
import { Error } from '@core-utils/error';

// Basic error
throw new Error("Operation failed");

// With extended info
throw new Error("Validation failed", { 
  fields: ['email'],
  constraints: { format: 'email' }
});

// Custom error type
const ValidationError = Error.createCustomError('ValidationError');
throw new ValidationError("Invalid input");
```

## Error Information

Each error instance includes structured information:

```typescript
interface ErrorInfo {
  errorType: string;     // Error type identifier
  message: string;       // Error message
  location: Location;    // Error location context
  extInfo: unknown;      // Optional additional info
}

interface Location {
  packagePath: string;    // Path to nearest package.json
  staRootPath: string | null;  // Path to STA root
}
```

## Features

### Location Tracking

Automatically tracks error location within project structure:

```typescript
const error = new Error("Operation failed");
console.log(error.info.location);
// {
//   packagePath: "/path/to/package.json",
//   staRootPath: "/path/to/sta/root"  // or null
// }
```

### Custom Error Types

Create custom error types with full type safety:

```typescript
// Create custom error
const ValidationError = Error.createCustomError('ValidationError');

// Use with type checking
try {
  throw new ValidationError("Invalid email", { field: 'email' });
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(err.info.extInfo);  // Type-safe access
  }
}
```

### Error Chaining

Chain errors while preserving context:

```typescript
try {
  await someOperation();
} catch (err) {
  throw new Error("Operation failed", err);
}
```

## API Reference

### `Error`

Base error class with enhanced functionality.

```typescript
class Error extends Error {
  constructor(message: string, extInfo?: unknown);
  
  info: ErrorInfo;  // Structured error information
  
  static createCustomError(errorType: string): ErrorConstructor;
}
```

### `ErrorInfo`

Structure containing error context.

```typescript
interface ErrorInfo {
  errorType: string;
  message: string;
  location: Location;
  extInfo: unknown | null;
}
```

### `Location`

Error location information.

```typescript
interface Location {
  packagePath: string;
  staRootPath: string | null;
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import { Error, ErrorInfo, Location } from '@core-utils/error';
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Run tests: `npm test`
4. Submit a pull request

## License

MIT
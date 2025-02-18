# Error Utility API Design

## Core Function

```typescript
interface Error {
  info: ErrorInfo[];

  constructor(
    message: string,
    prevError?: Error | ExternalError
  );

  static External(
    name: string,
    sourceError: unknown
  ): ExternalError;

  static Custom(
    name: string,
    properties?: Record<string, unknown>
  ): typeof Error;
}
```

## Types

```typescript
interface ErrorInfo {
  location: LocationInfo;  // From location utility
  message: string;
}

interface ExternalError {
  name: string;
  sourceError: unknown;
}
```

## Usage Examples

External service error:
```
// AWS Lambda throws error
try {
  await lambda.invoke()
} catch (lambdaError) {
  throw new DatabaseError(
    "Failed to process data",
    Error.External("AWS Lambda", lambdaError)
  )
}

// Results in:
info: [
  {
    location: { type: "external", source: "AWS Lambda" },
    message: "Task timed out"
  },
  {
    location: { type: "package", ... },  // From location
    message: "Failed to process data"
  }
]
```

Custom error type:
```
const ValidationError = Error.Custom('ValidationError', {
  fields: [] 
})

throw new ValidationError(
  "Data validation failed",
  prevError,
  { fields: ['email', 'date'] }
)

// Results in error with:
error.name = 'ValidationError'
error.fields = ['email', 'date']
error.info = [
  // Previous error info preserved
  {
    location: {previous location},
    message: "Previous error message"
  },
  // New error info added
  {
    location: {current location},
    message: "Data validation failed"
  }
]
```

## Dependencies

- Location utility for package/source context
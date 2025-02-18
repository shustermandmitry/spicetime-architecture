# Location Utility API

## Core Function

```typescript
interface Location {
  name: string;  // package name
  path: string;  // relative path from repo root
}

/**
 * @throws {LocationError} When:
 * - No package.json found in path
 * - No repository root found (no package.json with repoRoot:true)
 * - package.json missing name field
 * - Invalid package.json format
 */
function location(): Promise<Location>;
```

## CLI

```bash
sta-location
```
Outputs location object as JSON to stdout.
Exits with code 1 and error message on failure.

## Error Type

```typescript
// Created using Error.createCustomErrorType('LocationError')
// Includes error info: { errorType: 'Location' }
class LocationError extends Error {}
```

## Dependencies

- @sta/utils/core/error
- find-up

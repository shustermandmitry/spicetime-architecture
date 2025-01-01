# PatchDispatcher Component

The PatchDispatcher component is a core part of the SpiceTime development environment, handling patch file operations with real-time updates and file system integration.

## Features

- Drag and drop interface for patch files
- Real-time status updates
- File system abstraction
- GraphQL integration
- Context-aware design
- TypeScript support
- Comprehensive test coverage

## Installation

```bash
pnpm add @spicetime/patch-dispatcher
```

## Basic Usage

```tsx
import { PatchDispatcher, FileSystemContext } from '@spicetime/patch-dispatcher';

// Implement file system operations
const fileSystem = {
  readFile: async (path) => { /* ... */ },
  writeFile: async (path, content) => { /* ... */ },
  exists: async (path) => { /* ... */ },
  mkdir: async (path) => { /* ... */ }
};

function App() {
  return (
    <FileSystemContext.Provider value={fileSystem}>
      <PatchDispatcher dropzoneLabel="Drop patches here" />
    </FileSystemContext.Provider>
  );
}
```

## Patch Format

Patches must follow this exact format:

\`\`\`
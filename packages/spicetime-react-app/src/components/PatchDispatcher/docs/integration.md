
# PatchDispatcher Integration Guide

## React Integration

### Basic Component Usage
```tsx
import { PatchDispatcher, FileSystemContext } from '@spicetime/react-app';

// Implement file system operations
const fileSystem: FileSystemOperations = {
  readFile: async (path) => {
    // Your file reading implementation
    return content;
  },
  writeFile: async (path, content) => {
    // Your file writing implementation
  },
  exists: async (path) => {
    // Check path existence
    return exists;
  },
  mkdir: async (path) => {
    // Create directory
  }
};

function App() {
  const handlePatchComplete = (result: ProcessResult) => {
    if (result.success) {
      console.log('Applied operations:', result.operations);
    }
  };

  return (
    <FileSystemContext.Provider value={fileSystem}>
      <PatchDispatcher 
        onPatchComplete={handlePatchComplete}
        onError={console.error}
      />
    </FileSystemContext.Provider>
  );
}
```

### With GraphQL
```tsx
import { useQuery, useMutation } from '@apollo/client';
import { ACTIVE_PATCHES, PROCESS_PATCH } from './graphql';

function PatchManager() {
  const { data } = useQuery(ACTIVE_PATCHES);
  const [processPatch] = useMutation(PROCESS_PATCH);

  const handlePatchComplete = async (result: ProcessResult) => {
    await processPatch({
      variables: {
        id: generateId(),
        operations: result.operations
      }
    });
  };

  return (
    <div>
      <PatchStatus patches={data?.activePatches} />
      <PatchDispatcher onPatchComplete={handlePatchComplete} />
    </div>
  );
}
```

### Custom File System Implementation
```typescript
// Example: Remote file system
class RemoteFileSystem implements FileSystemOperations {
  constructor(private baseUrl: string) {}

  async readFile(path: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/files/${path}`);
    if (!response.ok) throw new Error(`Failed to read ${path}`);
    return response.text();
  }

  async writeFile(path: string, content: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/files/${path}`, {
      method: 'PUT',
      body: content
    });
    if (!response.ok) throw new Error(`Failed to write ${path}`);
  }

  async exists(path: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/files/${path}`, {
        method: 'HEAD'
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  async mkdir(path: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/directories`, {
      method: 'POST',
      body: JSON.stringify({ path })
    });
    if (!response.ok) throw new Error(`Failed to create directory ${path}`);
  }
}

// Usage
const remoteFs = new RemoteFileSystem('https://api.example.com');
<FileSystemContext.Provider value={remoteFs}>
  <PatchDispatcher />
</FileSystemContext.Provider>
```

## CLI Integration

### Direct Usage
```typescript
import { PatchProcessor } from '@spicetime/react-app/dist/core/processor';
import { createFileSystem } from './fs-helpers';

async function processPatchFile(filePath: string) {
  const fs = createFileSystem();
  const processor = new PatchProcessor(fs);
  
  const content = await fs.readFile(filePath);
  const result = await processor.processContent(content);
  
  if (result.success) {
    console.log('Patch applied successfully');
    result.operations.forEach(op => {
      console.log(`${op.type}: ${op.path}`);
    });
  } else {
    console.error('Patch failed:', result.error?.message);
    if (result.error?.line) {
      console.error(`Line ${result.error.line}`);
    }
  }
}
```

### Custom CLI Tool
```typescript
#!/usr/bin/env node
import { program } from 'commander';
import { PatchProcessor } from '@spicetime/react-app/dist/core/processor';
import { createFileSystem } from './fs-helpers';

program
  .name('patch')
  .description('Process patch files')
  .argument('<file>', 'patch file to process')
  .option('-d, --dry-run', 'validate without applying changes')
  .action(async (file, options) => {
    try {
      const fs = createFileSystem();
      const processor = new PatchProcessor(fs);
      
      const content = await fs.readFile(file);
      
      if (options.dryRun) {
        // Validate only
        const commands = processor.parseCommands(content);
        console.log('Validation successful');
        commands.forEach(cmd => {
          console.log(`${cmd.type}: ${cmd.filePath}`);
        });
        return;
      }
      
      // Process patch
      const result = await processor.processContent(content);
      if (result.success) {
        console.log('Patch applied successfully');
        result.operations.forEach(op => {
          console.log(`${op.type}: ${op.path}`);
        });
      } else {
        console.error('Patch failed:', result.error?.message);
        process.exit(1);
      }
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program.parse();
```

### Integration with Build Tools

#### Webpack Plugin
```typescript
import { PatchProcessor, FileSystemOperations } from '@spicetime/react-app';

class PatchWebpackPlugin {
  constructor(private options: { 
    patchDir: string,
    fileSystem: FileSystemOperations 
  }) {}

  apply(compiler: webpack.Compiler) {
    compiler.hooks.beforeRun.tapAsync(
      'PatchWebpackPlugin',
      async (compilation, callback) => {
        try {
          const processor = new PatchProcessor(this.options.fileSystem);
          // Process patches before build
          // ...
          callback();
        } catch (error) {
          callback(error);
        }
      }
    );
  }
}
```

#### Jest Setup
```typescript
import { PatchProcessor } from '@spicetime/react-app';
import { createMemoryFileSystem } from './test-utils';

// Global test setup
beforeAll(async () => {
  const fs = createMemoryFileSystem();
  const processor = new PatchProcessor(fs);
  
  // Apply test setup patches
  const setupPatch = await fs.readFile('test/setup.patch');
  await processor.processContent(setupPatch);
});
```

## Event Integration

### Subscribe to Patch Events
```typescript
function usePatchEvents() {
  useEffect(() => {
    const subscription = client.subscribe({
      query: PATCH_SUBSCRIPTION
    }).subscribe({
      next({ data }) {
        // Handle patch updates
      },
      error(err) {
        console.error('Subscription error:', err);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
}
```

### Custom Event Handlers
```typescript
function PatchMonitor() {
  const handlePatchComplete = useCallback((result: ProcessResult) => {
    // Custom success handling
    notifySuccess(`Applied ${result.operations.length} changes`);
    refreshFileTree();
    updateHistory();
  }, []);

  const handleError = useCallback((error: Error) => {
    // Custom error handling
    notifyError(error.message);
    logError(error);
    retryQueue.add(error.patchId);
  }, []);

  return (
    <PatchDispatcher
      onPatchComplete={handlePatchComplete}
      onError={handleError}
    />
  );
}
```
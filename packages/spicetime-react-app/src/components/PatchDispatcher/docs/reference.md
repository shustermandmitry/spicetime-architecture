
# PatchDispatcher Reference Guide

## Component API

### PatchDispatcher Component
```typescript
interface PatchDispatcherProps {
  className?: string;
  onPatchComplete?: (result: ProcessResult) => void;
  onError?: (error: Error) => void;
}
```

#### Usage Example
```typescript
import { PatchDispatcher, FileSystemContext } from '@spicetime/react-app';

function MyComponent() {
  const handleComplete = (result) => {
    if (result.success) {
      console.log('Operations:', result.operations);
    }
  };

  return (
    <FileSystemContext.Provider value={fileSystem}>
      <PatchDispatcher 
        onPatchComplete={handleComplete}
        onError={console.error}
      />
    </FileSystemContext.Provider>
  );
}
```

## Patch Format

### Basic Structure
```
/* COMMAND INSERT PATH src/components/NewFeature.tsx */
export const NewFeature = () => {
  return <div>New Feature</div>;
};
/* COMMAND INSERT END*/
```

### Command Types
1. INSERT
    - Creates new file
    - Creates parent directories
    - Fails if file exists (use UPSERT instead)

2. DELETE
    - Removes existing file
    - Silent if file doesn't exist
    - Validates file existence

3. UPSERT
    - Creates or overwrites file
    - Creates parent directories
    - No existence check

4. REVERT
    - Reverts previous operations
    - Supports step count
    - Maintains history

### Error Messages
```typescript
interface PatchError {
  message: string;
  line: number;
  patchId: string;
}
```

Common errors:
- Nested command detected (line X)
- Command mismatch (line X)
- Invalid command format (line X)
- Unclosed command (line X)
- Invalid file path

## Implementation Guide

### Custom File System
```typescript
class CustomFileSystem implements FileSystemOperations {
  async readFile(path: string): Promise<string> {
    // Implementation
  }

  async writeFile(path: string, content: string): Promise<void> {
    // Implementation
  }

  async exists(path: string): Promise<boolean> {
    // Implementation
  }

  async mkdir(path: string): Promise<void> {
    // Implementation
  }
}
```

### Error Handling
```typescript
try {
  const result = await processor.processContent(content);
  if (!result.success) {
    console.error(
      `Error at line ${result.error.line}: ${result.error.message}`
    );
  }
} catch (error) {
  // Handle unexpected errors
}
```

### History Management
```typescript
interface PatchHistoryEntry {
  id: string;
  timestamp: number;
  operations: Array<{
    type: CommandType;
    path: string;
    content?: string;
    previousContent?: string;
  }>;
}
```

### Testing Guide
1. Unit Tests
```typescript
describe('PatchProcessor', () => {
  it('handles valid patches', async () => {
    const content = `/* COMMAND INSERT PATH test.txt */
content
/* COMMAND INSERT END*/`;

    const result = await processor.processContent(content);
    expect(result.success).toBe(true);
  });
});
```

2. Integration Tests
```typescript
describe('PatchDispatcher Integration', () => {
  it('processes real file system changes', async () => {
    const { container } = render(
      <FileSystemContext.Provider value={realFs}>
        <PatchDispatcher />
      </FileSystemContext.Provider>
    );
    // Test implementation.unstructured
  });
});
```

## Best Practices

### Patch Organization
1. File Naming
    - Descriptive: `feature-name.patch.txt`
    - Versioned: `v1-initial-setup.patch.txt`
    - Dated: `2024-01-02-hotfix.patch.txt`

2. Content Structure
    - Group related changes
    - Order dependencies first
    - Include clear comments

3. Operation Atomicity
    - Self-contained changes
    - Complete feature sets
    - Proper cleanup

### Error Recovery
1. When patch fails:
    - Check line numbers
    - Validate file paths
    - Review command syntax
    - Use REVERT if needed

2. Common issues:
    - Missing parent directories
    - Invalid file paths
    - Syntax errors
    - Permission issues

### Performance Considerations
1. Batch Operations
    - Group related changes
    - Minimize file system calls
    - Use UPSERT for overwrites

2. Resource Management
    - Handle large files properly
    - Monitor memory usage
    - Clean up temporary files

## Security Considerations

### Path Validation
- Prevent directory traversal
- Validate file extensions
- Check path lengths
- Normalize paths

### Content Validation
- Size limits
- Format checking
- Content sanitization
- Type validation

### Access Control
- File permissions
- Directory restrictions
- User validation
- Operation logging
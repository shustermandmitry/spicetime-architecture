# Patch Dispatcher User Guide

## Overview

Patch Dispatcher is a command-line tool for managing file system mutations in the SpiceTime framework. It processes patch files that specify file and directory changes and maintains a history of changes that can be reverted.

## Installation

```bash
# Install globally
pnpm install -g @spicetime/patch-dispatcher

# Verify installation
patch-dispatcher --version
```

## Core Concepts

### Patch Files
- Text files with `.patch.txt` or `.patch.md` extension
- Contain one or more mutation commands with ST blocks
- Processed in sequence based on file name
- Generate corresponding revert patches automatically

### Commands
- `INSERT`: Create or update files/directories
- `DELETE`: Remove files/directories

### Watched Directory
- Directory where patch files are placed for processing
- Default: `./patches` in repository root
- Can be configured to any path relative to repo root

### Patch History
- Stored in `.st-patches/sequence.json`
- Tracks all processed patches
- Maintains revert patches for each change
- Used for reverting changes in sequence

## Patch File Format

Each patch file contains one or more command blocks:

```
### INSERT
/*ST
path/to/file.ts
ST*/
file content goes here

### DELETE
/*ST
path/to/remove
ST*/
```

Key points:
- Command markers start with `###`
- Paths are contained in `/*ST ... ST*/` blocks
- Paths are relative to repository root
- Content follows the ST block for INSERT commands

Example patch:
```
### INSERT
/*ST
src/components/Button.tsx
ST*/
import React from 'react';

export const Button = () => {
  return <button>Click me</button>;
};

### DELETE
/*ST
src/components/old
ST*/
```

## Commands Reference

### Start and Stop Commands
```bash
# Start watching the default patches directory
patch-dispatcher start

# Start watching a custom directory
patch-dispatcher start custom/patches

# Stop the watcher
patch-dispatcher stop
```

The start command:
- Creates patches directory if it doesn't exist
- Default directory: `patches` at repository root
- Processes any existing patches on startup
- Maintains a PID file to track the running process

The stop command:
- Gracefully stops the running watcher
- Cleans up the PID file
- Can be triggered with Ctrl+C while watching

### Revert Changes
```bash
patch-dispatcher revert <steps>
```
- Reverts the specified number of most recent patches
- Processes patches in reverse order
- Generates and applies revert patches automatically

Arguments:
- `steps`: Number of patches to revert

## Usage Examples

1. Basic Setup & Watching
```bash
# Create patches directory
mkdir patches

# Start watching
patch-dispatcher watch
```

2. Apply Changes
```bash
# Create a patch file
cat > patches/feature.patch.txt << EOF
### INSERT
/*ST
src/feature.ts
ST*/
export const newFeature = true;
EOF

# File will be processed automatically
```

3. Revert Changes
```bash
# Revert last patch
patch-dispatcher revert 1

# Revert last three patches
patch-dispatcher revert 3
```

## Best Practices

1. **Patch Organization**
   - Use descriptive file names
   - Group related changes in single patch
   - Keep patches focused and atomic

2. **Path Management**
   - Use relative paths from repo root
   - Verify paths before creating patches
   - Maintain consistent directory structure

3. **Change Management**
   - Commit changes after patches process
   - Review revert patches when generated
   - Test patches in isolation first

4. **File Naming**
   - Use `.patch.txt` extension
   - Include descriptive names
   - Example: `add-button-component.patch.txt`

## Error Handling

Common errors and solutions:

1. **Invalid Repository**
   ```
   Error: Not in a spicetime-architecture repository
   ```
   - Ensure you're in correct repository
   - Check package.json name field

2. **Invalid Path**
   ```
   Error: Invalid target path
   ```
   - Check path is relative to repo root
   - Verify no path traversal (`../`)

3. **Missing Patch History**
   ```
   Error: No patch history found
   ```
   - Ensure patches processed previously
   - Check `.st-patches` directory exists

## Safety Features

1. **Path Validation**
   - Prevents absolute paths
   - Blocks path traversal attempts
   - Validates all paths before processing

2. **Atomic Operations**
   - Each patch processes completely or not at all
   - Generates revert patches before applying
   - Maintains operation history

3. **Revert Capabilities**
   - Each change can be reverted
   - Revert patches stored automatically
   - Multiple steps can be reverted

## Technical Details

1. **File Storage**
   - Patches directory: `./patches/`
   - History: `.st-patches/sequence.json`
   - Revert patches: `.st-patches/reverts/`

2. **Command Processing**
   - Sequential processing
   - File system operations are sync
   - Validation before execution

3. **Watch System**
   - Uses fs.watch API
   - Debounced file processing
   - Handles rapid changes safely

## Troubleshooting

1. **Patch Not Processing**
   - Check file extension is correct
   - Verify watch directory is correct
   - Check file permissions

2. **Revert Failed**
   - Verify patch history exists
   - Check revert patches are present
   - Ensure enough patches to revert

3. **Watch Not Working**
   - Restart watch process
   - Check directory permissions
   - Verify no conflicting watchers

## Limitations

1. **File Size**
   - No built-in size limits
   - Limited by system memory
   - Large files may be slow

2. **Concurrency**
   - Sequential processing only
   - No parallel execution
   - One watcher per directory

3. **File Types**
   - Text files preferred
   - Binary files supported
   - UTF-8 encoding assumed

## Support

For issues or questions:
1. Check this documentation
2. Review error messages
3. Check SpiceTime repository issues
4. Contact SpiceTime team
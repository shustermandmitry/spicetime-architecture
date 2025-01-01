/**
 * @module PatchDispatcher
 * @description Context provider for file system operations in PatchDispatcher
 */

import { createContext, useContext } from 'react';

/**
 * Interface defining required file system operations
 * @interface
 */
export interface FileSystemOperations {
  /** Read file contents as text */
  readFile: (path: string) => Promise<string>;
  /** Write content to file */
  writeFile: (path: string, content: string) => Promise<void>;
  /** Check if path exists */
  exists: (path: string) => Promise<boolean>;
  /** Create directory recursively */
  mkdir: (path: string) => Promise<void>;
}

/**
 * Context holding file system operations
 * @internal
 */
export const FileSystemContext = createContext<FileSystemOperations | null>(null);

/**
 * Hook to access file system operations
 * @throws {Error} When used outside FileSystemContext
 */
export function useFileSystem(): FileSystemOperations {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error(
      'PatchDispatcher must be used within a FileSystemContext provider'
    );
  }
  return context;
}
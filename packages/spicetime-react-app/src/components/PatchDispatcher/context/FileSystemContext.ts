// File: packages/spicetime-react-app/src/components/PatchDispatcher/context/FileSystemContext.ts

/**
 * @module PatchDispatcher
 * @description React context for file system operations
 */

import { createContext, useContext } from 'react'
import type { FileSystemOperations } from '../core/types'

/**
 * Context for providing file system operations
 * @internal
 */
export const FileSystemContext = createContext<FileSystemOperations | null>(null)

/**
 * Hook to access file system operations
 * @throws {Error} When used outside FileSystemContext provider
 */
export function useFileSystem(): FileSystemOperations {
  const context = useContext(FileSystemContext)
  if (!context) {
    throw new Error('useFileSystem must be used within FileSystemProvider')
  }
  return context
}

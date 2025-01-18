/**
 * @module PatchDispatcher
 * @description Core type definitions for patch processing system
 */

/**
 * Represents file system operations required by the patch processor
 * @interface
 * @category Core
 */
export interface FileSystemOperations {
  /** Read file contents as text */
  readFile: (path: string) => Promise<string>;

  /** Write content to file, creating if doesn't exist */
  writeFile: (path: string, content: string) => Promise<void>;

  /** Check if path exists */
  exists: (path: string) => Promise<boolean>;

  /** Create directory and any necessary parent directories */
  mkdir: (path: string) => Promise<string | undefined>;
}

/**
 * Valid patch command types
 * @category Core
 */
export type CommandType = 'INSERT' | 'DELETE' | 'UPSERT' | 'REVERT';

/**
 * Represents a parsed patch command with metadata
 * @interface
 * @category Core
 */
export interface PatchCommand {
  /** Type of operation to perform */
  type: CommandType;

  /** Target file path for operation */
  filePath: string;

  /** Content to write (for INSERT/UPSERT) */
  content: string;

  /** Line number where command started in patch file */
  startLine: number;
}

/**
 * Result of patch operation
 * @interface
 * @category Operations
 */
export interface ProcessResult {
  /** Whether patch was processed successfully */
  success: boolean;

  /** List of operations performed */
  operations: Array<{
    /** Type of operation performed */
    type: CommandType;

    /** Path where operation was performed */
    path: string;

    /** Content that was written (for INSERT/UPSERT) */
    content?: string;
  }>;

  /** Error details if operation failed */
  error?: {
    /** Error message */
    message: string;

    /** Line number where error occurred */
    line?: number;
  };
}

/**
 * History entry for tracking patch operations
 * @interface
 * @category History
 */
export interface PatchHistoryEntry {
  /** Unique identifier for patch operation */
  id: string;

  /** When patch was processed */
  timestamp: number;

  /** List of operations performed */
  operations: Array<{
    type: CommandType;
    path: string;
    content?: string;
    previousContent?: string;
  }>;
}

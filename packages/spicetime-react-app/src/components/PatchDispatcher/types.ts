/**
 * @module PatchDispatcher
 * @description Type definitions for the PatchDispatcher component
 */

/**
 * Status of a patch operation
 * @enum
 */
export type PatchStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Content of a single patch operation
 * @interface
 */
export interface PatchContent {
  /** Target path for the patch */
  targetPath: string;
  /** Content to apply */
  content: string;
}

/**
 * Represents a complete patch file
 * @interface
 */
export interface Patch {
  /** Unique identifier */
  id: string;
  /** Creation timestamp */
  timestamp: number;
  /** Current status */
  status: PatchStatus;
  /** Array of patch contents */
  patches: PatchContent[];
}

/**
 * Props for the PatchDispatcher component
 * @interface
 */
export interface PatchDispatcherProps {
  /** Optional className for styling */
  className?: string;
  /** Optional label for the drop zone */
  dropzoneLabel?: string;
}
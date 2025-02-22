/**
 * @module core-utils/error
 * @packageDocumentation
 * 
 * Type definitions for the Error utility.
 * Provides interfaces for error information, location tracking,
 * and error class construction.
 */

/**
 * Location information for error context.
 * Tracks package and STA root paths for error source identification.
 * Resolved using find-up for reliable path detection.
 * 
 * @remarks
 * - packagePath is always available (falls back to process.cwd())
 * - staRootPath may be null if STA root is not found
 * - All paths are absolute
 * 
 * @public
 */
export interface Location {
  /** 
   * Absolute path to nearest package.json
   * Found by walking up directory tree using find-up
   * Falls back to process.cwd() if not found
   */
  packagePath: string;

  /** 
   * Absolute path to STA root directory via sta.json
   * null if not within an STA project structure
   * Located by finding nearest sta.json using find-up
   */
  staRootPath: string | undefined;
}

/**
 * Extended error information structure.
 * Provides complete context about an error occurrence.
 * Used for both base Error and custom error types.
 * 
 * @remarks
 * - errorType identifies base 'STError' or custom types
 * - location is automatically resolved
 * - extInfo can contain any additional context
 * - All fields are required except extInfo
 * 
 * @public
 */
export interface ErrorInfo {
  /** 
   * Type identifier for the error
   * Either 'STError' for base class or custom name for derived types
   */
  errorType: string;

  /** 
   * Error message describing what went wrong
   * Should be clear and actionable
   */
  message: string;

  /** 
   * Location context showing where error occurred
   * Automatically resolved using find-up
   */
  location: Location;

  /** 
   * Optional additional error context
   * Can contain any type of extra information
   * null if no extra context provided
   */
  extInfo: unknown | undefined;
}

/**
 * Constructor interface for Error class and custom errors.
 * Defines required structure for error instantiation.
 * 
 * @remarks
 * - Used internally for type checking
 * - Ensures consistent error creation pattern
 * - Supports both base and custom errors
 * 
 * @internal
 */
export interface ErrorConstructor {
  /**
   * Creates a new error instance
   * @param message - Error message
   * @param extInfo - Optional additional context
   */
  new (message: string, extInfo?: unknown): Error;
}

/**
 * Constructor type for STError class.
 * Extends ErrorConstructor to include error info.
 * 
 * @remarks
 * - Adds structured error information
 * - Maintains standard Error properties
 * - Supports error chaining
 * 
 * @internal
 */
export interface STErrorConstructor extends ErrorConstructor {
  new (message: string, extInfo?: unknown): STError;
}

/**
 * Base class interface for STError.
 * Extends native Error with additional error information.
 * 
 * @remarks
 * - Includes all Error properties
 * - Adds structured error info
 * - Supports location tracking
 * 
 * @public
 */
export interface STError extends Error {
  /** Structured error information */
  readonly info: ErrorInfo;
}

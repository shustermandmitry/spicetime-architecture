/**
 * @module core-utils/error
 * @packageDocumentation
 * 
 * Type definitions for the Error utility.
 * Provides interfaces for error information, location tracking,
 * and error class construction.
 * 
 * @remarks
 * These types support the core Error utility functionality:
 * - Location tracking via find-up
 * - Error information enrichment
 * - Custom error type creation
 * - Extensible error contexts
 * 
 * @example
 * ```typescript
 * // Error information structure
 * const errorInfo: ErrorInfo = {
 *   errorType: 'ValidationError',
 *   message: 'Invalid input',
 *   location: {
 *     packagePath: '/path/to/package.json',
 *     staRootPath: '/path/to/sta/root'
 *   },
 *   extInfo: { fields: ['email'] }
 * };
 * ```
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
 * @example
 * ```typescript
 * const location: Location = {
 *   packagePath: '/users/project/package.json',
 *   staRootPath: '/users/project/sta.json'
 * };
 * ```
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
  staRootPath: string | null;
}

/**
 * Extended error information structure.
 * Provides complete context about an error occurrence.
 * Used for both base Error and custom error types.
 * 
 * @remarks
 * - errorType identifies base 'Error' or custom types
 * - location is automatically resolved
 * - extInfo can contain any additional context
 * - All fields are required except extInfo
 * 
 * @example
 * ```typescript
 * // Basic error info
 * const basic: ErrorInfo = {
 *   errorType: 'Error',
 *   message: 'Operation failed',
 *   location: myLocation,
 *   extInfo: null
 * };
 * 
 * // With extended info
 * const extended: ErrorInfo = {
 *   errorType: 'ValidationError',
 *   message: 'Invalid input',
 *   location: myLocation,
 *   extInfo: {
 *     fields: ['email'],
 *     constraints: { format: 'email' }
 *   }
 * };
 * ```
 * 
 * @public
 */
export interface ErrorInfo {
  /** 
   * Type identifier for the error
   * Either 'Error' for base class or custom name for derived types
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
  extInfo: unknown | null;
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

  /**
   * Creates a custom error type
   * @param errorType - Name for custom error
   * @returns Constructor for new error type
   */
  createCustomError(errorType: string): ErrorConstructor;
}

/**
 * Static interface for error factory functionality.
 * Supports creation of custom error types.
 * 
 * @remarks
 * - Used internally for static type checking
 * - Ensures proper error type creation
 * 
 * @example
 * ```typescript
 * // Creating custom error type
 * const ValidationError = Error.createCustomError('ValidationError');
 * ```
 * 
 * @internal
 */
export interface ErrorStatic {
  /**
   * Creates a custom error type extending base Error
   * @param errorType - Name for the custom error type
   * @returns Constructor for new error type
   */
  createCustomError(errorType: string): ErrorConstructor;
}

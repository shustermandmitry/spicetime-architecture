/**
 * @module core-utils/error
 */

import { findUp } from 'find-up';
import type { ErrorInfo, Location, ErrorConstructor } from './Error.types';

/**
 * Enhanced Error class with location tracking and structured information.
 * Extends the native Error class to provide additional functionality while
 * maintaining full compatibility.
 * 
 * Features:
 * - Automatic location tracking
 * - Extended error information
 * - Custom error type creation
 * - Type-safe error handling
 * 
 * @example
 * ```typescript
 * // Basic usage
 * throw new Error("Operation failed");
 * 
 * // With extended info
 * throw new Error("Database error", { 
 *   code: 'DB_001',
 *   table: 'users' 
 * });
 * ```
 * 
 * @public
 */
export class Error extends globalThis.Error {
  /**
   * Structured error information including location and extended data.
   * Provides a consistent interface for error details.
   * 
   * @readonly - Error information is immutable after creation
   * @public
   */
  public readonly info: ErrorInfo;

  /**
   * Creates a new Error instance with enhanced functionality.
   * 
   * @param message - Human-readable error description
   * @param extInfo - Optional additional error context
   * 
   * @example
   * ```typescript
   * // Basic error
   * new Error("File not found");
   * 
   * // With extended info
   * new Error("Access denied", { userId: 123, resource: 'file.txt' });
   * 
   * // Error chaining
   * try {
   *   await operation();
   * } catch (err) {
   *   throw new Error("Operation failed", err);
   * }
   * ```
   * 
   * @public
   */
  constructor(message: string, extInfo?: unknown) {
    // Call native Error constructor
    super(message);

    // Fix prototype chain for built-in class extension
    Object.setPrototypeOf(this, new.target.prototype);

    // Set error name to constructor name for proper identification
    this.name = this.constructor.name;

    // Build and attach error info
    this.info = this.buildErrorInfo(message, extInfo);

    // Capture stack trace if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Creates a custom error type extending this base Error.
   * Allows creation of domain-specific error types while maintaining
   * all enhanced functionality.
   * 
   * @param errorType - Name for the custom error type
   * @returns Constructor for the new error type
   * 
   * @example
   * ```typescript
   * // Create custom error type
   * const ValidationError = Error.createCustomError('ValidationError');
   * 
   * // Use custom error
   * throw new ValidationError("Invalid email", { field: 'email' });
   * 
   * // Type checking
   * try {
   *   validate();
   * } catch (err) {
   *   if (err instanceof ValidationError) {
   *     // Handle validation error
   *   }
   * }
   * ```
   * 
   * @public
   */
  static createCustomError(errorType: string): ErrorConstructor {
    return class CustomError extends Error {
      constructor(message: string, extInfo?: unknown) {
        super(message, extInfo);
        this.name = errorType;
      }
    };
  }

  /**
   * Builds structured error information including location and extended data.
   * 
   * @param message - Error message to include
   * @param extInfo - Optional additional context
   * @returns Complete error information structure
   * 
   * @private
   */
  private buildErrorInfo(message: string, extInfo?: unknown): ErrorInfo {
    return {
      errorType: this.name,
      message,
      location: this.resolveLocation(),
      extInfo: extInfo || null
    };
  }

  /**
   * Resolves error location in project structure.
   * Uses find-up to locate package.json and sta.json files.
   * Falls back to process.cwd() if package.json not found.
   * 
   * @returns Location information structure
   * @throws Never - Handles all internal errors and provides fallback
   * 
   * @private
   */
  private resolveLocation(): Location {
    try {
      const packagePath = findUp.sync('package.json') || process.cwd();
      const staRootPath = findUp.sync('sta.json');
      return { packagePath, staRootPath };
    } catch {
      // Fallback to safe defaults if location resolution fails
      return {
        packagePath: process.cwd(),
        staRootPath: null
      };
    }
  }
}

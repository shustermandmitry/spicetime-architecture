/**
 * @module core-utils/error
 * @packageDocumentation
 * 
 * Error handling utility providing enhanced error tracking and type safety.
 * Extends native Error with location tracking and structured error information.
 * 
 * Key features:
 * - Location tracking via find-up
 * - Extended error information
 * - Custom error type creation
 * - TypeScript type safety
 * 
 * Basic usage:
 * ```typescript
 * // Basic error
 * throw new Error("Operation failed");
 * 
 * // With extended info
 * throw new Error("Validation failed", { 
 *   fields: ['email'] 
 * });
 * 
 * // Custom error type
 * const ValidationError = Error.createCustomError('ValidationError');
 * throw new ValidationError("Invalid input");
 * ```
 * 
 * Location tracking:
 * Each error automatically tracks its location in the project structure:
 * ```typescript
 * {
 *   packagePath: "/path/to/package.json",
 *   staRootPath: "/path/to/sta/root"  // or null
 * }
 * ```
 * 
 * Error information structure:
 * ```typescript
 * {
 *   errorType: string;     // Error type identifier
 *   message: string;       // Error message
 *   location: Location;    // Error location context
 *   extInfo: unknown;      // Optional additional info
 * }
 * ```
 * 
 * @see {@link Error} The main Error class
 * @see {@link ErrorInfo} Error information interface
 * @see {@link Location} Location tracking interface
 */

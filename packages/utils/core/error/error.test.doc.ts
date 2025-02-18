/**
 * @module core-utils/error
 * @packageDocumentation
 * 
 * Zero-dependency error utility for monorepo projects
 * 
 * This module provides a robust error handling system with:
 * - Custom error creation
 * - Location tracking
 * - Error info enrichment
 * - Safe serialization
 * 
 * Core Features:
 * - Zero external dependencies
 * - Automatic location resolution
 * - Extended error information
 * - Custom error type factory
 * 
 * Extended Features:
 * - Circular reference handling in error info
 * - Safe JSON serialization
 * - Non-serializable data handling
 * - Error chaining capabilities
 * 
 * File Structure:
 * ```
 * error/
 *   ├── Error.ts           # Main implementation
 *   ├── Error.types.ts     # Type definitions
 *   ├── Error.test.ts      # Test suite
 *   └── index.ts          # Public API
 * ```
 * 
 * @example
 * ```typescript
 * // Basic usage
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
 * @remarks
 * This utility is part of the core-utils package and maintains
 * zero external dependencies for maximum portability.
 * Location resolution is performed using only Node.js built-ins.
 * 
 * @see {@link Error} The main Error class
 * @see {@link ErrorInfo} Error information interface
 * @see {@link Location} Location tracking interface
 */

/**
 * Public exports
 */


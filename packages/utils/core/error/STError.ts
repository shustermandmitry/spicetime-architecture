/**
 * @module utils/core/STError
 * @packageDocumentation
 *
 * Core error handling implementation for SpiceTime Architecture.
 * Provides standardized error creation and handling with location awareness.
 */

import type { ErrorInfo, Location } from './STError.type';
import { resolveLocation } from './location';

/**
 * Standard error class for the SpiceTime Architecture
 * @class STError
 * @extends Error
 */
export class STError extends Error {
  /**
   * Error information including location and extended details
   * @readonly
   */
  readonly info: ErrorInfo;

  /**
   * Optional cause of the error for error chaining
   * @readonly
   */
  readonly cause?: Error;

  /**
   * Private constructor - use static create methods instead
   * @private
   */
  private constructor(message: string, info: ErrorInfo, extInfo?: unknown) {
    super(message);
    this.name = this.constructor.name;
    this.info = info;

    if (extInfo instanceof Error) {
      this.cause = extInfo;
    }
  }

  /**
   * Asynchronously creates an STError with location information
   * @param message - Error message
   * @param extInfo - Optional additional error information
   * @returns Promise resolving to new STError instance
   */
  static async create(message: string, extInfo?: unknown): Promise<STError> {
    const loc = await resolveLocation();

    const info: ErrorInfo = {
      errorType: 'STError',
      message,
      location: {
        packagePath: loc.packagePath,
        staRootPath: loc.staRootPath ?? undefined
      },
      extInfo: STError.sanitizeExtInfo(extInfo)
    };

    return new STError(message, info, extInfo);
  }

  /**
   * Synchronously creates an STError with basic location information
   * @param message - Error message
   * @param extInfo - Optional additional error information
   * @returns New STError instance
   */
  static createSync(message: string, extInfo?: unknown): STError {
    const info: ErrorInfo = {
      errorType: 'STError',
      message,
      location: {
        packagePath: process.cwd(),
        staRootPath: undefined
      },
      extInfo: this.sanitizeExtInfo(extInfo)
    };

    return new STError(message, info, extInfo);
  }

  private static sanitizeExtInfo(extInfo: unknown): unknown {
    if (extInfo instanceof STError) {
      return extInfo;
    }

    if (extInfo instanceof Error) {
      return {
        name: extInfo.name,
        message: extInfo.message,
        stack: extInfo.stack
      };
    }

    return extInfo;
  }

  getErrorChain(): string[] {
    const chain = [this.message];
    let currentError: Error | undefined = this.cause;
    
    while (currentError) {
      chain.push(currentError.message);
      currentError = currentError.cause as Error | undefined;
    }

    return chain;
  }
}

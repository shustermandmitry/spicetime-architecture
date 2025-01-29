/**
 * @module utils/errors
 * @description Base error system providing standardized error creation and handling
 */

/**
 * Data required to create an error event
 * @interface EventData
 * @property {string} type - Error type identifier
 * @property {string} source - Where the error occurred (function, module, etc)
 * @property {Record<string, any>} [context] - Additional error context
 */
interface EventData {
    type: string;
    source: string;
    context?: Record<string, any>;
}

/**
 * Structure of an error event in the system
 * @interface ErrorEvent
 * @property {string} action - Type of event (always 'error' for errors)
 * @property {string} target - What was affected by the error
 * @property {string | null} error - Error message
 * @property {Record<string, any>} [context] - Additional event context
 */
interface ErrorEvent {
    action: string;
    target: string;
    error: string | null;
    context?: Record<string, any>;
}

/**
 * Base error class for SpiceTime utilities
 * Provides error event creation and custom error type generation
 *
 * @class STError
 * @extends {Error}
 *
 * @example
 * ```typescript
 * // Creating base error
 * throw new STError('Operation failed', {
 *   type: 'ProcessError',
 *   source: 'processData',
 *   context: { operation: 'transform' }
 * });
 *
 * // Creating domain-specific error
 * const FSError = STError.createCustomError('FSError');
 * throw new FSError('File not found', 'readFile', { path: '/config.json' });
 * ```
 */
export class STError extends Error {
    /**
     * Error event information
     * Contains structured data about the error occurrence
     * @type {ErrorEvent}
     */
    info: ErrorEvent;

    /**
     * Creates an instance of STError
     *
     * @param {string} message - Human-readable error description
     * @param {EventData} eventData - Structured error event data
     *
     * @throws {Error} If required event data is missing
     *
     * @example
     * ```typescript
     * new STError('Invalid input', {
     *   type: 'ValidationError',
     *   source: 'validateConfig',
     *   context: { field: 'port', value: -1 }
     * });
     * ```
     */
    constructor(message: string, eventData: EventData) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

        // @ts-ignore - createEvent will be provided by environment
        this.info = createEvent('error', eventData.source, message, {
            type: eventData.type,
            ...eventData.context
        });
    }

    /**
     * Creates a custom error type for domain-specific errors
     * In TypeScript, this will enable proper type extensions for error context
     *
     * @static
     * @param {string} name - Name for the custom error type
     * @returns {typeof STError} New error class extending STError
     *
     * @example
     * ```typescript
     * // Create domain-specific error type
     * const ConfigError = STError.createCustomError('ConfigError');
     *
     * // Use in domain code
     * throw new ConfigError(
     *   'Missing required field',
     *   'validateConfig',
     *   { field: 'apiKey' }
     * );
     * ```
     */
    static createCustomError(name: string): typeof STError {
        return class extends STError {
            constructor(message: string, source: string, context: Record<string, any> = {}) {
                super(message, {
                    type: name,
                    source,
                    context
                });
                this.name = name;
            }
        };
    }
}
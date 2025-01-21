/**
 * @module utils/aggregator
 * @description File content aggregator utility for combining source files into a single output.
 *
 * @example
 * // Using the default export
 * import Aggregator from '@spicetime/aggregator';
 *
 * const aggregator = new Aggregator({
 *   includePaths: ['./src'],
 *   extensions: ['.js']
 * });
 *
 * @example
 * // Using named exports
 * import { createAggregator } from '@spicetime/aggregator';
 *
 * const aggregator = createAggregator({
 *   includePaths: ['./src'],
 *   extensions: ['.js']
 * });
 */

import Aggregator from './core/aggregator.js';

/**
 * Creates a new Aggregator instance with the given configuration
 * @param {import('./core/aggregator.js').AggregatorConfig} config
 * @returns {Aggregator}
 */
export function createAggregator(config) {
    return new Aggregator(config);
}

export {Aggregator as default};
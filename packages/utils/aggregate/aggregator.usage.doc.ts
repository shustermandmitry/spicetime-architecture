/**
 * @module utils/aggregator/usage
 * @category Utils
 * @subcategory Aggregation
 *
 * Base Aggregator Usage Module
 *
 * Core Functionality:
 * - File content aggregation with pattern matching
 * - Error propagation to React boundaries
 * - Dynamic path resolution from STA root
 *
 * Basic Usage:
 * ```typescript
 * import { Aggregator } from './aggregator';
 *
 * const aggregator = new Aggregator({
 *   includePaths: ['./src'],
 *   extensions: ['.ts']
 * });
 *
 * try {
 *   const result = await aggregator.aggregate();
 * } catch (error) {
 *   // Error handled by React boundary
 * }
 * ```
 *
 * Path Resolution:
 * - All paths resolved from STA root
 * - Support for absolute paths
 * - No path caching, always dynamic
 *
 * Error Handling:
 * - All errors wrapped in TSError
 * - Full context preserved
 * - React boundaries process display
 * - Original messages retained
 *
 * Configuration:
 * - includePaths: Target directories
 * - extensions: File types to collect
 * - excludePatterns: Skip patterns
 */

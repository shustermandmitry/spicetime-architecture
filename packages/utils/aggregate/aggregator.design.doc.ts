/**
 * @module utils/aggregator/design
 * @category Utils
 * @subcategory Aggregation
 *
 * Base Aggregator Design Module
 *
 * Core Philosophy:
 * - Pure content aggregation without processing
 * - Pass errors to React boundaries with full context
 * - Strict dependency on TSError for error handling
 * - Dynamic path resolution from STA root
 *
 * Component Hierarchy:
 * ```
 * BaseAggregator
 *   ├── FileCollection
 *   │   ├── PathResolution (from STARoot)
 *   │   └── PatternMatching 
 *   └── ErrorHandling
 *       └── TSError Integration
 * ```
 *
 * Error Strategy:
 * - Use TSError for all errors
 * - Collect package context via pnpm commands
 * - Preserve third-party error messages
 * - Pass location data through TSErrorInfo
 *
 * Dependency Resolution:
 * - getSTARoot: Base path resolution
 * - getPackageName: Package identification
 * - getDomain: Package categorization
 * - getPackageRoot: Local package context
 *
 * Path Resolution:
 * - Relative: From STA root
 * - Absolute: Direct usage
 * - Dynamic: No path caching
 * - Runtime: Package location discovery
 *
 * Integration Points:
 * - React error boundaries
 * - Package.json domain paths
 * - PNPM command interface
 * - TSError utility
 */

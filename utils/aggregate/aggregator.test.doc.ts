/**
 * @module utils/aggregator/tests
 * @category Utils
 * @subcategory Aggregation
 *
 * Test Module for Base Aggregator
 *
 * Test Strategy:
 * - Isolated environment checks
 * - Mock filesystem operations
 * - Path resolution verification
 * - Error propagation validation
 *
 * Mocking Approach:
 * - Mock fast-glob for patterns
 * - Use real PNPM commands
 * - Preserve error contexts
 * - Track glob calls
 *
 * Test Categories:
 * - Command availability
 * - Path resolution
 * - Pattern matching
 * - Error handling
 *
 * Integration Points:
 * - TSError assertions
 * - PNPM commands
 * - File system patterns
 */
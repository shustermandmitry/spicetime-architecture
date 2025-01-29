/**
 * @module utils/staScripts
 * @category Utils
 * @subcategory Scripts
 *
 * Foundational script system with clean error propagation.
 * Enforces package-level isolation and standardized error handling.
 *
 * Script Categories:
 * - Package Information (get*): Extract current package context
 * - Package Creation (create*): Generate new package structures
 * - Build System (build*): Compile and process packages
 * - Test System (test*): Execute different test types
 * - Deploy System (deploy*): Handle package publishing
 *
 * Error Philosophy:
 * - STAScriptError wrapping preserves full error chain
 * - Package context automatically collected on error
 * - Clean error propagation through script hierarchy
 * - No error interpretation, just information capture
 *
 * Bootstrap Dependencies:
 * - Base STError support for error wrapping
 * - Package command execution for context
 * - Local package resolution (pnpm)
 *
 * Design Decisions:
 * - Scripts run independently for tree shaking
 * - Tests next to implementation files
 * - No path caching or shared state
 * - Package commands for context
 *
 * @packageDocumentation
 */

/**
 * Path resolution and monorepo utilities
 * @module src/utils/paths
 * @category Utils
 *
 * @description
 * Path resolution and monorepo structure validation utilities.
 * Ensures proper package placement in the monorepo structure
 * regardless of command invocation location.
 *
 * Features:
 * - Finds monorepo root from any subdirectory
 * - Validates required package directories exist
 * - Resolves correct package paths by type
 * - Provides type-safe package location mapping
 *
 * @example Usage
 * ```typescript
 * // Get complete monorepo structure
 * const structure = await resolveMonorepoStructure();
 *
 * // Resolve path for new package
 * const pkgPath = resolvePackagePath(structure, 'my-service', 'service');
 * // Returns: <root>/packages/services/my-service
 * ```
 *
 * Error Handling:
 * - Throws if not in monorepo context
 * - Validates directory structure existence
 * - Type-safe package type validation
 */
/**
 * Path resolution and monorepo utilities
 * @module utils/paths
 * @category Utils
 *
 * @description
 * Path resolution and monorepo structure validation utilities.
 * Ensures proper package placement in the monorepo structure
 * regardless of command invocation location.
 */

import path from 'spicetime-architecture/packages/tools/st-cli/src/utils/paths';
import fs from 'fs-extra';

export interface PathStructure {
  root: string;
  packages: {
    root: string;
    services: string;
    clients: string;
    shared: string;
    internal: string;
    tools: string;
  }
}

/**
 * Maps package types to their directory names
 */
export const PACKAGE_DIRS = {
  service: 'services',
  client: 'clients',
  shared: 'shared',
  internal: 'internal',
  tool: 'tools'
} as const;

export type PackageType = keyof typeof PACKAGE_DIRS;

/**
 * Find monorepo root by searching up for package.json
 * @returns PathStructure with all relevant paths
 * @throws If not in monorepo context
 */
export async function resolveMonorepoStructure(): Promise<PathStructure> {
  let currentDir = process.cwd();
  const rootDir = path.parse(currentDir).root;

  while (currentDir !== rootDir) {
    const pkgPath = path.join(currentDir, 'package.json');
    if (await fs.pathExists(pkgPath)) {
      const pkg = await fs.readJson(pkgPath);
      if (pkg.name === 'spicetime-architecture') {
        const packagesDir = path.join(currentDir, 'packages');

        // Verify packages directory structure
        for (const dir of Object.values(PACKAGE_DIRS)) {
          const fullPath = path.join(packagesDir, dir);
          if (!await fs.pathExists(fullPath)) {
            throw new Error(`Invalid monorepo structure: missing ${dir} directory`);
          }
        }

        // Return full structure
        return {
          root: currentDir,
          packages: {
            root: packagesDir,
            services: path.join(packagesDir, 'services'),
            clients: path.join(packagesDir, 'clients'),
            shared: path.join(packagesDir, 'shared'),
            internal: path.join(packagesDir, 'internal'),
            tools: path.join(packagesDir, 'tools')
          }
        };
      }
    }
    currentDir = path.dirname(currentDir);
  }
  throw new Error('Not in spicetime-architecture monorepo');
}

/**
 * Get absolute path for a package based on its type
 */
export function resolvePackagePath(structure: PathStructure, name: string, type: PackageType): string {
  return path.join(structure.packages[PACKAGE_DIRS[type]], name);
}
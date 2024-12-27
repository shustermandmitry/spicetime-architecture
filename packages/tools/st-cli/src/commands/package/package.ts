
/**
 * Package management commands
 * @module commands/package
 * @category Commands
 *
 * @description
 * Provides commands for managing packages in the SpiceTime monorepo architecture.
 *
 * @example Command Usage:
 * ```bash
 * # Create a new package
 * st package --create --name my-service --type service
 *
 * # Create with GraphQL setup
 * st package --create --name my-api --type service --gql
 *
 * # Create with custom structure
 * st package --create --name my-app --type client --structure ./structure.txt
 *
 * # Apply patches to existing structure
 * st package --patch ./changes.txt
 *
 * # Delete a package
 * st package --delete --name old-service
 * ```
 *
 * @example Structure File Format:
 * ```
 * src
 *   api
 *     controllers
 *       health.ts
 *     middleware
 *       auth.ts
 *   config
 *     index.ts
 * ```
 *
 * @example Patch File Format:
 * ```
 * --- packages/services/my-service/src/config/database.ts
 * import { z } from 'zod';
 *
 * export const DatabaseConfig = z.object({
 *   host: z.string(),
 *   port: z.number()
 * });
 *
 * --- packages/services/my-service/src/types/index.ts
 * export interface ServiceConfig {
 *   name: string;
 * }
 * ```
 *
 * Options:
 * --create: Create a new package
 *   - name: Package name
 *   - type: Package type (service|client|internal|shared|tool)
 *   - gql: Include GraphQL setup
 *   - structure: Path to structure definition file
 *   - patch: Path to patch file with contents
 *
 * --delete: Remove an existing package
 *   - name: Package name to delete
 *
 * Package Types:
 * - service: Backend services (REST, GraphQL, etc.)
 * - client: Frontend applications
 * - shared: Libraries used across packages
 * - internal: Internal tooling and utilities
 * - tool: CLI tools and build scripts
 *
 * The command is context-aware and will:
 * - Always place packages in correct monorepo location
 * - Handle conflicts with existing files
 * - Provide backup options when overwriting
 * - Validate all inputs before making changes
 */
/**
 * Package management commands for creating and deleting packages
 * @module commands/package
 */

i/**
 * Package management commands
 * @module src/commands/package
 * @category Commands
 *
 * @description
 * Main command module for package management in the SpiceTime monorepo.
 * Coordinates all package operations and validates inputs.
 */

import { Command } from 'commander';
import { z } from 'zod';
import { resolveMonorepoStructure, PackageType, PACKAGE_DIRS } from '../../utils/paths';
import { createPackage } from './create';
import { applyPatch } from './patch';

/**
 * Package type validation schema
 */
const PackageTypeSchema = z.enum(Object.keys(PACKAGE_DIRS) as [PackageType, ...PackageType[]]);

/**
 * Package creation options schema
 */
const CreateOptionsSchema = z.object({
  name: z.string(),
  type: PackageTypeSchema,
  gql: z.boolean().optional(),
  structure: z.string().optional(),
  patch: z.string().optional(),
});

/**
 * Register package-related commands
 */
export function packageCommands(program: Command): void {
  program
    .command('package')
    .description('Package management commands')
    .option('--name <name>', 'Package name')
    .option('--create', 'Create a new package')
    .option('--delete', 'Delete an existing package')
    .option('--type <type>', `Package type (${Object.keys(PACKAGE_DIRS).join('|')})`)
    .option('--gql', 'Include GraphQL setup')
    .option('--structure <file>', 'Path to structure definition file')
    .option('--patch <file>', 'Path to patch file with file contents')
    .action(async (options) => {
      try {
        // Resolve monorepo structure first
        const structure = await resolveMonorepoStructure();

        if (options.create) {
          const validatedOptions = CreateOptionsSchema.parse({
            name: options.name,
            type: options.type,
            gql: options.gql,
            structure: options.structure,
            patch: options.patch,
          });

          await createPackage(structure, validatedOptions);
        }
        // Add other command handlers here
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error('Invalid options:', error.errors);
        } else {
          console.error('Error:', error);
        }
        process.exit(1);
      }
    });
}
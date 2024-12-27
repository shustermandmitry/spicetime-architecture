/**
 * ST CLI entry point
 * @module commands/package
 * @category Core
 */

import { Command } from 'commander';
import { z } from 'zod';
import { packageCommands } from './package/package';

/**
 * Initialize and configure the ST CLI
 */
export function initCLI(): Command {
  const program = new Command();

  program
    .name('st')
    .description('SpiceTime CLI - Monorepo Development Tools')
    .version('0.1.0');

  // Register all command modules
  packageCommands(program);

  return program;
}

// Start CLI if run directly
if (require.main === module) {
  const program = initCLI();
  program.parse(process.argv);
}yes

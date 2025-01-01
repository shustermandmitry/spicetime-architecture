#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fsExtra from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const fs = fsExtra;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEFAULT_WATCH_DIR = 'patches';

// Track last failed patch for retry
let lastFailedPatch = null;

// Parse commands from patch file content
function parseCommands(content, filePath) {
  const commands = [];
  const lines = content.split('\n');
  let currentCommand = null;
  let lineNumber = 0;

  try {
    while (lineNumber < lines.length) {
      const line = lines[lineNumber];
      
      // Look for command markers
      if (line.startsWith('!!')) {
        const match = line.match(/^!!(INSERT|DELETE)!!(.*)$/);
        if (!match) {
          throw new Error(`Invalid command format at line ${lineNumber + 1}`);
        }
        
        if (currentCommand) {
          commands.push(currentCommand);
        }
        
        currentCommand = {
          command: match[1],
          targetPath: match[2].trim(),
          content: '',
          lineNumber: lineNumber + 1
        };
      } else if (currentCommand && line.startsWith('/*ST')) {
        // Start of ST block
        lineNumber++;
        const pathLine = lines[lineNumber].trim();
        if (!pathLine || lines[lineNumber + 1].trim() !== 'ST*/') {
          throw new Error(`Invalid ST block format at line ${lineNumber + 1}`);
        }
        currentCommand.targetPath = pathLine;
        lineNumber += 2; // Skip ST*/
      } else if (currentCommand) {
        currentCommand.content += line + '\n';
      }
      
      lineNumber++;
    }
    
    if (currentCommand) {
      commands.push(currentCommand);
    }

    return commands;
  } catch (error) {
    error.message = `${filePath}:${lineNumber + 1}: ${error.message}`;
    throw error;
  }
}

async function processPatch(filePath) {
  try {
    const repoRoot = findRepoRoot();
    const content = fs.readFileSync(filePath, 'utf8');
    const commands = parseCommands(content, filePath);

    for (const cmd of commands) {
      const targetPath = path.join(repoRoot, cmd.targetPath);
      console.log(chalk.yellow(`${cmd.command}: ${targetPath}`));
      
      if (cmd.command === 'INSERT') {
        fs.ensureDirSync(path.dirname(targetPath));
        fs.writeFileSync(targetPath, cmd.content);
        console.log(chalk.green('✓ Created'));
      } else if (cmd.command === 'DELETE') {
        if (fs.pathExistsSync(targetPath)) {
          fs.removeSync(targetPath);
          console.log(chalk.green('✓ Deleted'));
        }
      }
    }

    // Clear last failed patch on success
    lastFailedPatch = null;
    
    // Delete processed patch
    fs.removeSync(filePath);
    console.log(chalk.green(`Processed and removed: ${filePath}`));

  } catch (error) {
    // Save failed patch info for retry
    lastFailedPatch = filePath;
    
    console.error(chalk.red(`Error processing patch:`));
    console.error(error instanceof Error ? error.message : String(error));
    console.error(chalk.yellow('\nYou can retry this patch after fixing the error with:'));
    console.error(chalk.yellow('patch-dispatcher retry'));
  }
}

async function retryLastPatch() {
  if (!lastFailedPatch) {
    console.error(chalk.red('No failed patch to retry'));
    return;
  }

  if (!fs.pathExistsSync(lastFailedPatch)) {
    console.error(chalk.red(`Last failed patch no longer exists: ${lastFailedPatch}`));
    lastFailedPatch = null;
    return;
  }

  console.log(chalk.blue(`Retrying patch: ${lastFailedPatch}`));
  await processPatch(lastFailedPatch);
}

// [... rest of the watcher and other functions stay the same ...]

// CLI setup
const program = new Command();

program
  .name('patch-dispatcher')
  .description('Process patch files for repository mutations')
  .version('0.1.0');

program
  .command('start')
  .description('Start watching for patches')
  .argument('[dir]', 'Directory to watch (relative to repo root)', DEFAULT_WATCH_DIR)
  .action(async (dir) => {
    try {
      const watcher = await startWatcher(dir);
      await new Promise(() => {});
    } catch (error) {
      console.error(chalk.red('Fatal error:'), error);
      process.exit(1);
    }
  });

program
  .command('stop')
  .description('Stop watching for patches')
  .action(stopWatcher);

program
  .command('retry')
  .description('Retry the last failed patch')
  .action(retryLastPatch);

program
  .command('revert')
  .description('Revert the last N patches')
  .argument('<steps>', 'Number of patches to revert')
  .action(steps => revertLastN(parseInt(steps, 10)));

program.parse();

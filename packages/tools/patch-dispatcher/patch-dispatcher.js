#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fsExtra from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const fs = fsExtra; // alias to keep existing code consistent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DEFAULT_WATCH_DIR = 'patches';

// Simple PID file management
function writePid(pidPath) {
  fs.writeFileSync(pidPath, process.pid.toString(), 'utf8');
}

function readPid(pidPath) {
  try {
    return parseInt(fs.readFileSync(pidPath, 'utf8'));
  } catch (error) {
    return null;
  }
}

function isProcessRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return false;
  }
}

function findRepoRoot(startPath = process.cwd()) {
  let currentDir = startPath;
  const root = path.parse(currentDir).root;

  while (currentDir !== root) {
    const pkgPath = path.join(currentDir, 'package.json');
    try {
      if (fs.pathExistsSync(pkgPath)) {
        const pkg = fs.readJsonSync(pkgPath);
        if (pkg.name === 'spicetime-architecture') {
          return currentDir;
        }
      }
    } catch (error) {
      // Continue searching if we can't read package.json
    }
    currentDir = path.dirname(currentDir);
  }
  
  throw new Error('Not in a spicetime-architecture repository');
}

async function startWatcher(dir = DEFAULT_WATCH_DIR) {
  let watcher = null;

  try {
    const repoRoot = findRepoRoot();
    console.log(chalk.blue(`Repository root: ${repoRoot}`));
    
    // Always resolve watch directory relative to repo root
    const absoluteWatchDir = path.join(repoRoot, dir);
    console.log(chalk.blue(`Watch directory: ${absoluteWatchDir}`));
    
    // Create watch directory if it doesn't exist
    fs.ensureDirSync(absoluteWatchDir);

    // Create pid file in repo root
    const pidPath = path.join(repoRoot, '.st-patches', 'watcher.pid');
    fs.ensureDirSync(path.dirname(pidPath));

    // Check if watcher is already running
    const existingPid = readPid(pidPath);
    if (existingPid && isProcessRunning(existingPid)) {
      throw new Error('Patch dispatcher is already running');
    }

    // Set up signal handlers before starting watch
    process.on('SIGINT', () => {
      if (watcher) {
        watcher.close();
      }
      stopWatcher();
    });

    // Write our PID
    writePid(pidPath);
    
    console.log(chalk.blue('Patch dispatcher started'));
    console.log(chalk.blue(`Watching ${dir} for patches...`));
    
    // Process existing patches
    const files = fs.readdirSync(absoluteWatchDir);
    for (const file of files) {
      if (file.endsWith('.patch.txt') || file.endsWith('.patch.md')) {
        await processPatch(path.join(absoluteWatchDir, file));
      }
    }

    // Return promise that resolves with watcher
    return new Promise((resolve, reject) => {
      try {
        // Watch for new patches
        watcher = fs.watch(absoluteWatchDir, (eventType, filename) => {
          if (filename && (filename.endsWith('.patch.txt') || filename.endsWith('.patch.md'))) {
            const filePath = path.join(absoluteWatchDir, filename);
            
            setTimeout(async () => {
              if (fs.pathExistsSync(filePath)) {
                await processPatch(filePath);
              }
            }, 100);
          }
        });

        // Handle watcher errors
        watcher.on('error', (error) => {
          console.error(chalk.red('Watch error:'), error);
          reject(error);
        });

        resolve(watcher);
      } catch (error) {
        reject(error);
      }
    });

  } catch (error) {
    console.error(chalk.red('Error starting patch dispatcher:'));
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

function stopWatcher() {
  try {
    const repoRoot = findRepoRoot();
    const pidPath = path.join(repoRoot, '.st-patches', 'watcher.pid');
    
    if (fs.pathExistsSync(pidPath)) {
      const pid = readPid(pidPath);
      if (pid) {
        try {
          process.kill(pid);
        } catch (e) {
          // Process might already be dead
        }
      }
      fs.removeSync(pidPath);
      console.log(chalk.blue('Patch dispatcher stopped'));
    } else {
      console.log(chalk.yellow('No running patch dispatcher found'));
    }
    
    process.exit(0);
  } catch (error) {
    console.error(chalk.red('Error stopping patch dispatcher:'));
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

async function processPatch(filePath) {
  try {
    const repoRoot = findRepoRoot();
    const content = fs.readFileSync(filePath, 'utf8');
    const commands = [];
    
    // Parse commands and ST blocks
    const sections = content.split(/(?=###\s+[A-Z]+)/);
    for (const section of sections) {
      const commandMatch = section.match(/###\s+([A-Z]+)/);
      if (!commandMatch) continue;
      
      const command = commandMatch[1];
      if (command !== 'INSERT' && command !== 'DELETE') {
        throw new Error(`Invalid command: ${command}`);
      }
      
      const stMatch = section.match(/\/\*ST\s*([\s\S]*?)\s*ST\*\/([\s\S]*?)(?=(?:###|$))/);
      if (!stMatch) continue;
      
      const targetPath = stMatch[1].trim();
      const content = stMatch[2].trim();
      
      commands.push({ command, targetPath, content });
    }

    for (const cmd of commands) {
      const targetPath = path.join(repoRoot, cmd.targetPath);
      console.log(chalk.yellow(`${cmd.command}: ${targetPath}`));
      
      if (cmd.command === 'INSERT') {
        fs.ensureDirSync(path.dirname(targetPath));
        fs.writeFileSync(targetPath, cmd.content);
        console.log(chalk.green('✓ Created'));
      } else {
        if (fs.pathExistsSync(targetPath)) {
          fs.removeSync(targetPath);
          console.log(chalk.green('✓ Deleted'));
        }
      }
    }

    // Delete processed patch
    fs.removeSync(filePath);
    console.log(chalk.green(`Processed and removed: ${filePath}`));

  } catch (error) {
    console.error(chalk.red(`Error processing patch ${filePath}:`));
    console.error(error instanceof Error ? error.message : String(error));
  }
}

async function revertLastN(steps) {
  try {
    const repoRoot = findRepoRoot();
    const logPath = path.join(repoRoot, '.st-patches', 'sequence.json');
    
    if (!fs.pathExistsSync(logPath)) {
      throw new Error('No patch history found');
    }
    
    const log = fs.readJsonSync(logPath);
    const patches = log.patches.slice(0, steps).reverse();
    
    if (patches.length === 0) {
      throw new Error('No patches found to revert');
    }
    
    console.log(chalk.yellow(`Reverting last ${patches.length} patches:`));
    for (const patch of patches) {
      const revertPath = path.join(repoRoot, patch.revertPatch);
      if (!fs.pathExistsSync(revertPath)) {
        throw new Error(`Revert patch not found: ${revertPath}`);
      }
      
      await processPatch(revertPath);
    }
    
  } catch (error) {
    console.error(chalk.red('Error reverting patches:'));
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

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
  .action(startWatcher);

program
  .command('stop')
  .description('Stop watching for patches')
  .action(stopWatcher);

program
  .command('revert')
  .description('Revert the last N patches')
  .argument('<steps>', 'Number of patches to revert')
  .action(steps => revertLastN(parseInt(steps, 10)));

program.parse();

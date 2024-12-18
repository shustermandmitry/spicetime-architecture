#!/usr/bin/env node
import prompts from 'prompts';
import { batchMutation } from './batchMutation';
import { manageTemplates } from './templateManager';

/**
 * Main CLI entry point for package-builder.
 */
async function main(): Promise<void> {
  const { command } = await prompts({
    type: 'select',
    name: 'command',
    message: 'What do you want to do?',
    choices: [
      { title: 'Batch mutate templates', value: 'batch-mutate' },
      { title: 'Manage templates', value: 'manage-templates' },
      { title: 'Exit', value: 'exit' },
    ],
  });

  switch (command) {
    case 'batch-mutate':
      batchMutation();
      break;
    case 'manage-templates':
      manageTemplates();
      break;
    default:
      console.log('Goodbye.');
  }
}

main();

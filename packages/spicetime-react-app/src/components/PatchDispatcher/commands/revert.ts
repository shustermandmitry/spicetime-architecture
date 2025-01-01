/**
 * @module PatchDispatcher
 * @description REVERT command implementation
 */

import { PatchHistory } from '../utils/history';

interface RevertOptions {
  steps?: number;
}

export async function executeRevert(history: PatchHistory, options: RevertOptions = {}): Promise<void> {
  const steps = options.steps || 1;
  
  if (steps < 1) {
    throw new Error('Invalid steps value for revert');
  }

  await history.revert(steps);
}
/**
 * @module PatchDispatcher
 * @description Patch history management and revert operations
 */

import { PatchHistoryEntry, PatchMutation } from '../types';
import { FileSystemOperations } from '../context';

export class PatchHistory {
  private history: PatchHistoryEntry[] = [];
  private MAX_HISTORY = 100;  // Configurable history limit

  constructor(private fileSystem: FileSystemOperations) {}

  /**
   * Records a successful patch operation
   */
  async recordPatch(id: string, mutations: PatchMutation[]): Promise<void> {
    const entry: PatchHistoryEntry = {
      id,
      timestamp: Date.now(),
      mutations,
      revertible: true
    };

    // Store previous content for revert capability
    for (const mutation of mutations) {
      if (mutation.type !== 'DELETE') {
        try {
          const exists = await this.fileSystem.exists(mutation.targetPath);
          if (exists) {
            mutation.previousContent = await this.fileSystem.readFile(mutation.targetPath);
          }
        } catch (error) {
          console.error('Failed to store previous content:', error);
          entry.revertible = false;
        }
      }
    }

    this.history.unshift(entry);
    
    // Maintain history limit
    if (this.history.length > this.MAX_HISTORY) {
      this.history = this.history.slice(0, this.MAX_HISTORY);
    }
  }

  /**
   * Reverts the specified number of patches
   */
  async revert(steps: number = 1): Promise<void> {
    const toRevert = this.history.slice(0, steps).filter(entry => entry.revertible);
    
    // Revert in reverse order
    for (const entry of toRevert.reverse()) {
      await this.revertPatch(entry);
      // Remove from history after successful revert
      this.history = this.history.filter(h => h.id !== entry.id);
    }
  }

  private async revertPatch(entry: PatchHistoryEntry): Promise<void> {
    // Revert each mutation in reverse order
    for (const mutation of entry.mutations.reverse()) {
      switch (mutation.type) {
        case 'INSERT':
          // If it was an insert, delete the file
          await this.fileSystem.delete(mutation.targetPath);
          break;

        case 'DELETE':
          // If it was a delete and we have previous content, restore it
          if (mutation.previousContent) {
            await this.fileSystem.writeFile(
              mutation.targetPath,
              mutation.previousContent
            );
          }
          break;

        case 'UPSERT':
          // If it was an upsert, restore previous content or delete
          if (mutation.previousContent) {
            await this.fileSystem.writeFile(
              mutation.targetPath,
              mutation.previousContent
            );
          } else {
            await this.fileSystem.delete(mutation.targetPath);
          }
          break;
      }
    }
  }

  /**
   * Gets recent patch history
   */
  getHistory(): PatchHistoryEntry[] {
    return [...this.history];
  }
}
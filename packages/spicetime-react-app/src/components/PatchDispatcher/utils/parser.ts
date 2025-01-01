/**
 * @module PatchDispatcher
 * @description Patch file parser with enhanced error handling
 */

import { PatchCommand, PatchError } from '../types';

export function parsePatchFile(content: string, patchId: string): PatchCommand[] {
  const lines = content.split('\n');
  const commands: PatchCommand[] = [];
  let currentCommand: Partial<PatchCommand> | null = null;
  let contentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Command start
    if (line.startsWith('!!')) {
      if (currentCommand) {
        throw createError(`Nested command detected`, i + 1, patchId);
      }
      const type = line.slice(2).trim();
      if (!isValidCommandType(type)) {
        throw createError(`Invalid command type: ${type}`, i + 1, patchId);
      }
      currentCommand = {
        type: type as PatchCommand['type'],
        startLine: i + 1
      };
      continue;
    }

    // Command end
    if (line.endsWith('!!')) {
      if (!currentCommand) {
        throw createError(`End of command without start`, i + 1, patchId);
      }
      currentCommand.endLine = i + 1;
      
      // Extract ST block and content
      let foundST = false;
      let targetPath = '';
      const contentBuffer: string[] = [];
      
      for (const contentLine of contentLines) {
        if (contentLine.startsWith('/*ST')) {
          foundST = true;
          continue;
        }
        if (foundST && contentLine.endsWith('ST*/')) {
          targetPath = contentLine.slice(0, -4).trim();
          foundST = false;
          continue;
        }
        if (!foundST && contentLine.trim()) {
          contentBuffer.push(contentLine);
        }
      }

      if (!targetPath) {
        throw createError(`Missing or invalid ST block`, currentCommand.startLine, patchId);
      }

      commands.push({
        type: currentCommand.type!,
        targetPath,
        content: contentBuffer.join('\n'),
        startLine: currentCommand.startLine,
        endLine: currentCommand.endLine
      });

      currentCommand = null;
      contentLines = [];
      continue;
    }

    // Collect content between command markers
    if (currentCommand) {
      contentLines.push(line);
    }
  }

  if (currentCommand) {
    throw createError(`Unclosed command`, currentCommand.startLine, patchId);
  }

  return commands;
}

function isValidCommandType(type: string): boolean {
  return ['INSERT', 'DELETE', 'UPSERT'].includes(type);
}

function createError(message: string, line: number, patchId: string): PatchError {
  return { message, line, patchId };
}
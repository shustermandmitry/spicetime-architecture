import React, { useEffect, useContext } from 'react';
import { SpicetimeContext } from '../context/SpicetimeContext';

interface PatchInstruction {
  targetPath: string;
  content: string;
}

interface PatchMessage {
  id: string;
  commitMessage: string;
  instructions: PatchInstruction[];
}

const PatchDispatcher: React.FC = () => {
  const { state, dispatch } = useContext(SpicetimeContext);

  // Watch patch directory for incoming messages
  useEffect(() => {
    const watchPatchDirectory = async () => {
      try {
        const watcher = window.fs.watch('/patches', { 
          recursive: false 
        }, async (eventType, filename) => {
          if (filename?.endsWith('.patch.txt') || filename?.endsWith('.patch.md')) {
            const content = await window.fs.readFile(`/patches/${filename}`, { 
              encoding: 'utf8' 
            });
            handleIncomingPatch(filename, content);
          }
        });

        return () => watcher.close();
      } catch (error) {
        console.error('Failed to watch patch directory:', error);
      }
    };

    watchPatchDirectory();
  }, []);

  // Parse and validate incoming patch
  const parsePatch = (content: string): PatchMessage | null => {
    const instructions: PatchInstruction[] = [];
    let commitMessage = '';

    try {
      // Extract commit message from filename/content
      const messageMatch = content.match(/^commit:\s*(.+)$/m);
      if (messageMatch) {
        commitMessage = messageMatch[1].trim();
      }

      // Parse ST blocks
      const stBlocks = content.matchAll(/\/\*ST\s*([\s\S]*?)\s*ST\*\/([\s\S]*?)(?=\/\*ST|$)/g);
      
      for (const match of stBlocks) {
        const targetPath = match[1].trim();
        const blockContent = match[2].trim();
        
        if (targetPath && blockContent) {
          instructions.push({
            targetPath,
            content: blockContent
          });
        }
      }

      if (instructions.length === 0) {
        throw new Error('No valid ST blocks found');
      }

      return {
        id: Date.now().toString(),
        commitMessage,
        instructions
      };
    } catch (error) {
      console.error('Failed to parse patch:', error);
      return null;
    }
  };

  // Process an incoming patch file
  const handleIncomingPatch = async (filename: string, content: string) => {
    const patch = parsePatch(content);
    if (!patch) return;

    try {
      // Notify about incoming changes
      dispatch({
        type: 'PATCH_RECEIVED',
        payload: patch
      });

      // Apply each instruction
      for (const instruction of patch.instructions) {
        // Validate target path
        if (!isValidPath(instruction.targetPath)) {
          throw new Error(`Invalid target path: ${instruction.targetPath}`);
        }

        // Ensure target directory exists
        await ensureDirectoryExists(instruction.targetPath);

        // Apply the change
        dispatch({
          type: 'APPLY_PATCH',
          payload: {
            patchId: patch.id,
            targetPath: instruction.targetPath,
            content: instruction.content
          }
        });
      }

      // Commit changes if all instructions applied successfully
      dispatch({
        type: 'COMMIT_PATCH',
        payload: {
          patchId: patch.id,
          commitMessage: patch.commitMessage || `Apply patch: ${filename}`
        }
      });
    } catch (error) {
      console.error('Failed to apply patch:', error);
      dispatch({
        type: 'PATCH_FAILED',
        payload: {
          patchId: patch.id,
          error: error.message
        }
      });
    }
  };

  // Validate target path is within repo
  const isValidPath = (targetPath: string): boolean => {
    // Normalize path and check it's within repo root
    const normalized = targetPath.replace(/\\/g, '/');
    if (normalized.startsWith('../') || normalized.includes('/../')) {
      return false;
    }
    return true;
  };

  // Ensure target directory exists
  const ensureDirectoryExists = async (targetPath: string) => {
    const dirPath = targetPath.split('/').slice(0, -1).join('/');
    if (dirPath) {
      await window.fs.mkdir(dirPath, { recursive: true });
    }
  };

  // Component renders nothing - it's just a message processor
  return null;
};

export default PatchDispatcher;
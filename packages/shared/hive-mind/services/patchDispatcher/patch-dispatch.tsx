import React, { useEffect, useState } from 'react';
import { useWiSContext } from '../context/WiSContext';

// Types for the required WiS API functions
interface WiSAPI {
  // File operations
  watchDirectory: (path: string, options: WatchOptions) => void;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  ensureDirectory: (path: string) => Promise<void>;
  
  // UI operations
  openTab: (title: string) => Promise<TabHandle>;
  showMessage: (tab: TabHandle, message: string, type: 'info' | 'error' | 'success') => void;
  askConfirmation: (tab: TabHandle, message: string) => Promise<boolean>;
  getInput: (tab: TabHandle, prompt: string, defaultValue?: string) => Promise<string>;
  
  // Git operations
  commitChanges: (message: string, files: string[]) => Promise<void>;
  
  // Drag and drop
  registerDropZone: (tab: TabHandle, onDrop: (files: File[]) => void) => void;
}

interface PatchContent {
  targetPath: string;
  content: string;
}

interface PatchFile {
  commitMessage: string;
  patches: PatchContent[];
}

const PatchDispatch: React.FC = () => {
  const {
    watchDirectory,
    readFile,
    writeFile,
    ensureDirectory,
    openTab,
    showMessage,
    askConfirmation,
    getInput,
    commitChanges,
    registerDropZone
  } = useWiSContext<WiSAPI>();

  const [activeTab, setActiveTab] = useState<TabHandle | null>(null);

  useEffect(() => {
    const initializeTab = async () => {
      const tab = await openTab('PatchDispatch');
      setActiveTab(tab);
      registerDropZone(tab, handlePatchDrop);
    };

    initializeTab();
  }, []);

  const parsePatchFile = async (content: string): Promise<PatchFile> => {
    const patches: PatchContent[] = [];
    let commitMessage = '';

    // Extract commit message from filename or content
    // Parse ST blocks into patches array
    // Return structured patch file data

    return { commitMessage, patches };
  };

  const processPatch = async (patch: PatchContent): Promise<boolean> => {
    if (!activeTab) return false;

    try {
      // Show target path and get confirmation
      const proceed = await askConfirmation(
        activeTab,
        `Process patch for ${patch.targetPath}?`
      );
      
      if (!proceed) return false;

      // Ensure target directory exists
      await ensureDirectory(patch.targetPath);
      
      // Write content to target
      await writeFile(patch.targetPath, patch.content);
      
      showMessage(activeTab, `Successfully processed ${patch.targetPath}`, 'success');
      return true;
    } catch (error) {
      showMessage(activeTab, `Error processing ${patch.targetPath}: ${error}`, 'error');
      return false;
    }
  };

  const handlePatchFile = async (content: string) => {
    if (!activeTab) return;

    try {
      // Parse patch file
      const patchFile = await parsePatchFile(content);
      
      // Process each patch
      const results = await Promise.all(patchFile.patches.map(processPatch));
      
      if (results.every(Boolean)) {
        // All patches succeeded, handle commit
        let commitMsg = patchFile.commitMessage;
        
        // Allow commit message override
        const useDefault = await askConfirmation(
          activeTab,
          `Use default commit message: "${commitMsg}"?`
        );
        
        if (!useDefault) {
          commitMsg = await getInput(activeTab, 'Enter commit message:', commitMsg);
        }
        
        // Commit changes
        await commitChanges(commitMsg, patchFile.patches.map(p => p.targetPath));
        showMessage(activeTab, 'Successfully committed all changes', 'success');
      }
    } catch (error) {
      showMessage(activeTab, `Error processing patch file: ${error}`, 'error');
    }
  };

  const handlePatchDrop = async (files: File[]) => {
    if (!activeTab) return;

    for (const file of files) {
      if (file.name.includes('.patch.')) {
        const content = await file.text();
        await handlePatchFile(content);
      } else {
        showMessage(activeTab, `Ignored non-patch file: ${file.name}`, 'info');
      }
    }
  };

  // Component doesn't render anything itself - UI handled by WiS
  return null;
};

export default PatchDispatch;
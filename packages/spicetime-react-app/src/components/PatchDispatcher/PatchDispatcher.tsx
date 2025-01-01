/**
 * @module PatchDispatcher
 * @description Main PatchDispatcher component
 */

import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useFileSystem } from './context';
import { PatchList } from './PatchList';
import { DropZone } from './DropZone';
import type { PatchDispatcherProps } from './types';
import { ACTIVE_PATCHES, PROCESS_PATCH } from './graphql';

/**
 * PatchDispatcher component for handling patch file operations
 * @component
 * @example
 * ```tsx
 * <FileSystemProvider>
 *   <PatchDispatcher dropzoneLabel="Drop patches here" />
 * </FileSystemProvider>
 * ```
 */
export const PatchDispatcher: React.FC<PatchDispatcherProps> = ({
  className = '',
  dropzoneLabel = 'Drag and drop patch files here'
}) => {
  const fileSystem = useFileSystem();
  
  const { data, loading, error } = useQuery(ACTIVE_PATCHES, {
    pollInterval: 2000
  });

  const [processPatch] = useMutation(PROCESS_PATCH);

  const handleDrop = async (files: FileList) => {
    const patchFiles = Array.from(files).filter(file => 
      file.name.includes('.patch.')
    );

    for (const file of patchFiles) {
      try {
        const content = await file.text();
        await processPatch({ 
          variables: { 
            id: file.name,
            content 
          }
        });
      } catch (error) {
        console.error('Failed to process patch:', error);
      }
    }
  };

  if (loading) return <div>Loading patches...</div>;
  if (error) return <div>Error loading patches: {error.message}</div>;

  return (
    <div className={className}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Patch Dispatcher</h1>
        <p className="text-gray-600">Drop patch files here to process them</p>
      </div>

      <DropZone onDrop={handleDrop} label={dropzoneLabel} />
      <PatchList patches={data?.activePatches || []} />
    </div>
  );
};
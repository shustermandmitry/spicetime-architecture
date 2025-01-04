// File: packages/spicetime-react-app/src/components/PatchDispatcher/components/PatchDispatcher.tsx

/**
 * @module PatchDispatcher
 * @description React component for drag-and-drop patch processing
 */

import React, { useCallback, useState } from 'react'
import { PatchProcessor } from '../core/processor'
import { FileSystemContext } from '../context/FileSystemContext'
import { ProcessResult } from '../core/types'

/**
 * Props for PatchDispatcher component
 * @interface
 */
interface PatchDispatcherProps {
  /** Optional className for styling */
  className?: string;
  /** Called when patch processing completes */
  onPatchComplete?: (result: ProcessResult) => void;
  /** Called when error occurs */
  onError?: (error: Error) => void;
}

/**
 * Component for handling patch file drops and processing
 * @component
 */
export const PatchDispatcher: React.FC<PatchDispatcherProps> = ({
                                                                  className = '',
                                                                  onPatchComplete,
                                                                  onError,
                                                                }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    for (const file of files) {
      if (!file.name.includes('.patch.')) continue

      setIsProcessing(true)
      try {
        const content = await file.text()
        const processor = new PatchProcessor(FileSystemContext)
        const result = await processor.processContent(content)

        if (result.success) {
          onPatchComplete?.(result)
        } else {
          onError?.(new Error(result.error?.message))
        }
      } catch (error) {
        onError?.(error as Error)
      } finally {
        setIsProcessing(false)
      }
    }
  }, [onPatchComplete, onError])

  return (
    <div
      className={`${className} ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isProcessing ? (
        <div>Processing patch...</div>
      ) : (
        <div>Drop patch files here</div>
      )}
    </div>
  )
}






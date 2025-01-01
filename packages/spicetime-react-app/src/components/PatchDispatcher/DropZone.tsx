/**
 * @module PatchDispatcher
 * @description Drop zone component for patch files
 */

import React, { useState } from 'react';

interface DropZoneProps {
  onDrop: (files: FileList) => void;
  label: string;
}

/**
 * Drop zone for patch files
 * @component
 * @internal
 */
export const DropZone: React.FC<DropZoneProps> = ({ onDrop, label }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    onDrop(e.dataTransfer.files);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-colors ${
        dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-gray-600">
        {dragActive ? 'Drop files here' : label}
      </div>
    </div>
  );
};
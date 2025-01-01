/**
 * @module PatchDispatcher
 * @description List component for displaying active patches
 */

import React from 'react';
import type { Patch } from './types';

interface PatchListProps {
  patches: Patch[];
}

/**
 * Displays a list of active patches
 * @component
 * @internal
 */
export const PatchList: React.FC<PatchListProps> = ({ patches }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Active Patches</h2>
      <div className="space-y-2">
        {patches.map(patch => (
          <PatchItem key={patch.id} patch={patch} />
        ))}
      </div>
    </div>
  );
};

interface PatchItemProps {
  patch: Patch;
}

/**
 * Individual patch item display
 * @component
 * @internal
 */
const PatchItem: React.FC<PatchItemProps> = ({ patch }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    pending: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <div className="flex justify-between items-center">
        <span className="font-medium">ID: {patch.id}</span>
        <span className={`px-2 py-1 rounded text-sm ${statusColors[patch.status]}`}>
          {patch.status}
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        {new Date(patch.timestamp).toLocaleString()}
      </div>
      <div className="mt-2 space-y-1">
        {patch.patches.map((p, i) => (
          <div key={i} className="text-sm">
            → {p.targetPath}
          </div>
        ))}
      </div>
    </div>
  );
};
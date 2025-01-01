/**
 * @module PatchDispatcher
 * @description Retry button for failed patches
 */

import React from 'react';
import { useRetry } from '../context/retryContext';

export const RetryButton: React.FC = () => {
  const { failedPatch, retryPatch } = useRetry();

  if (!failedPatch) return null;

  return (
    <button
      onClick={() => retryPatch()}
      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
    >
      Retry Failed Patch
    </button>
  );
};
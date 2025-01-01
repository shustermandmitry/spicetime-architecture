/**
 * @module PatchDispatcher
 * @description Context for patch retry functionality
 */

import { createContext, useContext, useState } from 'react';
import { FailedPatch } from '../types';

interface RetryContextType {
  failedPatch: FailedPatch | null;
  setFailedPatch: (patch: FailedPatch | null) => void;
  retryPatch: () => Promise<void>;
}

export const RetryContext = createContext<RetryContextType | null>(null);

export function useRetry() {
  const context = useContext(RetryContext);
  if (!context) {
    throw new Error('useRetry must be used within RetryProvider');
  }
  return context;
}
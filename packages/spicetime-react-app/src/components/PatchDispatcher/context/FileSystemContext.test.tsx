/**
 * @module PatchDispatcher
 * @description Unit tests for FileSystem context and hook
 */

import React from 'react';
import {render, renderHook} from '@testing-library/react';
import {FileSystemContext, useFileSystem} from './FileSystemContext';
import type {FileSystemOperations} from '../types';
import {vi} from 'vitest';
import '@testing-library/jest-dom';

// Mock implementation for file system operations
const mockFs: FileSystemOperations = {
  readFile: vi.fn(),
  writeFile: vi.fn(),
  exists: vi.fn(),
  mkdir: vi.fn(),
};

describe('FileSystemContext', () => {
  describe('useFileSystem hook', () => {
    it('returns file system operations when used within provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FileSystemContext.Provider value={mockFs}>
          {children}
        </FileSystemContext.Provider>
      );

      const {result} = renderHook(() => useFileSystem(), {wrapper});

      expect(result.current).toBe(mockFs);
    });

    it('throws an error when used outside FileSystemProvider', () => {
      expect(() => renderHook(() => useFileSystem())).toThrow(
          Error('useFileSystem must be used within FileSystemProvider'),
      );
    });
  });

  describe('FileSystemContext Provider', () => {
    it('provides file system operations to its children', () => {
      const TestComponent = () => {
        const fs = useFileSystem();
        return <div>{fs ? 'FileSystem Available' : 'FileSystem Unavailable'}</div>;
      };

      const { getByText } = render(
        <FileSystemContext.Provider value={mockFs}>
          <TestComponent />
        </FileSystemContext.Provider>,
      );

      expect(getByText('FileSystem Available')).toBeInTheDocument();
    });

    it('supports nested providers with the same value', () => {
      const TestComponent = () => {
        const fs = useFileSystem();
        return <div>{fs ? 'Nested FileSystem' : 'No FileSystem'}</div>;
      };

      const { getByText } = render(
        <FileSystemContext.Provider value={mockFs}>
          <FileSystemContext.Provider value={mockFs}>
            <TestComponent />
          </FileSystemContext.Provider>
        </FileSystemContext.Provider>,
      );

      expect(getByText('Nested FileSystem')).toBeInTheDocument();
    });

    it('uses the nearest provider value', () => {
      const mockFsAlternative: FileSystemOperations = {
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
        mkdir: vi.fn(),
      };

      let capturedFileSystem: FileSystemOperations | null = null;

      const TestComponent = () => {
        capturedFileSystem = useFileSystem();
        return null;
      };

      render(
        <FileSystemContext.Provider value={mockFs}>
          <FileSystemContext.Provider value={mockFsAlternative}>
            <TestComponent />
          </FileSystemContext.Provider>
        </FileSystemContext.Provider>,
      );

      expect(capturedFileSystem).toBe(mockFsAlternative);
    });

    it('does not provide a file system if the context value is null', () => {
      const TestComponent = () => {
        const fs = useFileSystem();
        return <div>{fs ? 'FileSystem Active' : 'FileSystem Inactive'}</div>;
      };

      const renderWithoutProvider = () =>
          render(
              <FileSystemContext.Provider value={null}>
                <TestComponent/>
              </FileSystemContext.Provider>,
          );

      // Should throw an error because the value is explicitly null
      expect(renderWithoutProvider).toThrowError('useFileSystem must be used within FileSystemProvider');
    });
  });
});
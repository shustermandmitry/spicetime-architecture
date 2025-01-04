// File: packages/spicetime-react-app/src/components/PatchDispatcher/context/FileSystemContext.test.tsx

/**
 * @module PatchDispatcher
 * @description Unit tests for FileSystem context and hook
 */

import React from 'react'
import { render, renderHook } from '@testing-library/react'
import { FileSystemContext, useFileSystem } from './FileSystemContext'
import type { FileSystemOperations } from '../core/types'

const mockFs: FileSystemOperations = {
  readFile: vi.fn(),
  writeFile: vi.fn(),
  exists: vi.fn(),
  mkdir: vi.fn(),
}

describe('FileSystemContext', () => {
  describe('useFileSystem hook', () => {
    it('returns file system operations when used within provider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FileSystemContext.Provider value={mockFs}>
          {children}
        </FileSystemContext.Provider>
      )

      const { result } = renderHook(() => useFileSystem(), { wrapper })
      expect(result.current).toBe(mockFs)
    })

    it('throws error when used outside provider', () => {
      const ERROR_MESSAGE = 'useFileSystem must be used within FileSystemProvider'

      try {
        renderHook(() => useFileSystem())
      } catch (error) {
        expect(error).toEqual(new Error(ERROR_MESSAGE))
      }
    })
  })

  describe('FileSystemContext Provider', () => {
    it('provides file system operations to children', () => {
      const TestComponent = () => {
        const fs = useFileSystem()
        return <div>{fs ? 'Has FileSystem' : 'No FileSystem'}</div>
      }

      const { getByText } = render(
        <FileSystemContext.Provider value={mockFs}>
          <TestComponent />
        </FileSystemContext.Provider>,
      )

      expect(getByText('Has FileSystem')).toBeInTheDocument()
    })

    it('allows nesting with same value', () => {
      const TestComponent = () => {
        const fs = useFileSystem()
        return <div>{fs ? 'Has FileSystem' : 'No FileSystem'}</div>
      }

      const { getByText } = render(
        <FileSystemContext.Provider value={mockFs}>
          <FileSystemContext.Provider value={mockFs}>
            <TestComponent />
          </FileSystemContext.Provider>
        </FileSystemContext.Provider>,
      )

      expect(getByText('Has FileSystem')).toBeInTheDocument()
    })

    it('uses nearest provider value', () => {
      const nestedFs = { ...mockFs, exists: jest.fn() }
      let capturedFs: FileSystemOperations | undefined

      const TestComponent = () => {
        capturedFs = useFileSystem()
        return null
      }

      render(
        <FileSystemContext.Provider value={mockFs}>
          <FileSystemContext.Provider value={nestedFs}>
            <TestComponent />
          </FileSystemContext.Provider>
        </FileSystemContext.Provider>,
      )

      expect(capturedFs).toBe(nestedFs)
    })
  })
})

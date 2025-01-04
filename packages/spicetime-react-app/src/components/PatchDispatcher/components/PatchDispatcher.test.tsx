/// <reference types="vitest" />
/**
 * @module PatchDispatcher
 * @description Unit tests for the PatchDispatcher React component
 * @internal
 */
import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { PatchDispatcher } from './PatchDispatcher'
import { FileSystemContext } from '../context/FileSystemContext'
import type { FileSystemOperations } from '../core/types'
import { vi } from 'vitest'

// @ts-ignore
// @ts-ignore
/**
 * Mocked implementation of FileSystemOperations for testing purposes.
 * @typeParam FileSystemOperations - The interface representing the file system operations.
 */
console.log('vi------------', vi)
// @ts-ignore
let mockFs: vi.Mocked<FileSystemOperations>
mockFs = {
  readFile: vi.fn(),
  writeFile: vi.fn(),
  exists: vi.fn(),
  mkdir: vi.fn(),
}

/**
 * Utility for rendering components wrapped with FileSystemContext.Provider.
 * @function
 * @param children - The React elements or components to render within the context.
 * @returns Rendered component output for tests.
 */
const renderWithFileSystem = (children: React.ReactNode) =>
  render(
    <FileSystemContext.Provider value={mockFs}>
      {children}
    </FileSystemContext.Provider>,
  )

/**
 * Creates a mock File object with the specified name and content.
 * Useful for simulating uploading files in tests.
 * @function
 * @param name - Name of the file to create.
 * @param content - Content of the file.
 * @returns A mock File object with the specified content and name.
 */
const createMockFile = (name: string, content: string): File =>
  new File([content], name, { type: 'text/plain' })

describe('PatchDispatcher Component', () => {
  /**
   * Runs before each test case to reset mocks, ensuring no state is carried over.
   * @returns void
   */
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders drop zone with default text', () => {
    const { getByText } = renderWithFileSystem(<PatchDispatcher />)
    expect(getByText('Drop patch files here')).toBeInTheDocument()
  })

  it('shows custom className when provided', () => {
    const { container } = renderWithFileSystem(
      <PatchDispatcher className="custom-class" />,
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('shows visual feedback during drag', () => {
    const { container } = renderWithFileSystem(<PatchDispatcher />)
    fireEvent.dragOver(container.firstChild!)
    expect(container.firstChild).toHaveClass('dragging')

    fireEvent.dragLeave(container.firstChild!)
    expect(container.firstChild).not.toHaveClass('dragging')
  })

  /**
   * Validates that valid patch files are processed and onPatchComplete is invoked appropriately.
   */
  it('processes valid patch files', async () => {
    mockFs.readFile.mockResolvedValueOnce('mocked file content')

    const onPatchComplete = jest.fn()
    const { container } = renderWithFileSystem(
      <PatchDispatcher onPatchComplete={onPatchComplete} />,
    )

    const file = createMockFile(
      'test.patch.txt',
      `/* COMMAND INSERT PATH test.txt */\ncontent\n/* COMMAND INSERT END*/`,
    )

    fireEvent.drop(container.firstChild!, {
      dataTransfer: { files: [file] },
    })

    await waitFor(() => {
      expect(onPatchComplete).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          operations: expect.arrayContaining([
            expect.objectContaining({
              type: 'INSERT',
              path: 'test.txt',
            }),
          ]),
        }),
      )
    })
  })

  function onPatchComplete() {

  }

  /**
   * Checks that non-patch files are ignored and onPatchComplete is not called.
   */
  it('ignores non-patch files', async () => {
    const { container } = renderWithFileSystem(
      <PatchDispatcher onPatchComplete={onPatchComplete} />,
    )

    const file = createMockFile('test.txt', 'random content')

    fireEvent.drop(container.firstChild!, {
      dataTransfer: { files: [file] },
    })

    await waitFor(() => {
      expect(onPatchComplete).not.toHaveBeenCalled()
    })
  })

  /**
   * Tests the scenario when file reading fails and ensures the onError handler is called.
   * @function
   */
  it('handles file read errors correctly', async () => {
    mockFs.readFile.mockRejectedValueOnce(new Error('Read error'))

    const onError = vi.fn()
    const { container } = renderWithFileSystem(
      <PatchDispatcher onError={onError} />,
    )

    const file = createMockFile('test.patch.txt', 'mock content')

    fireEvent.drop(container.firstChild!, {
      dataTransfer: { files: [file] },
    })

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Read error',
        }),
      )
    })
  })

  /**
   * Checks the state of the UI during patch application, ensuring progress is shown and dismissed correctly.
   */
  it('shows processing state during patch application', async () => {
    mockFs.readFile.mockResolvedValueOnce('mocked content')

    const { container, getByText } = renderWithFileSystem(<PatchDispatcher />)

    const file = createMockFile(
      'test.patch.txt',
      `/* COMMAND INSERT PATH test.txt */\ncontent\n/* COMMAND INSERT END*/`,
    )

    fireEvent.drop(container.firstChild!, {
      dataTransfer: { files: [file] },
    })

    // Assert that the processing state is shown initially.
    expect(getByText('Processing patch...')).toBeInTheDocument()

    // Wait until the processing state is no longer displayed.
    await waitFor(() => {
      expect(screen.queryByText('Processing patch...')).not.toBeInTheDocument()
    })
  })

  /**
   * Ensures that the component cannot be used outside a FileSystemContext.
   * This validates that `useFileSystem` behaves as expected when not wrapped within `FileSystemProvider`.
   */
  it('must be used within FileSystemContext', () => {
    expect(() => render(<PatchDispatcher />)).toThrow(
      'useFileSystem must be used within FileSystemProvider',
    )
  })
})
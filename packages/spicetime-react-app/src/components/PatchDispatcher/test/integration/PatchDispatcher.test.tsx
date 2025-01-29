/**
 * @module PatchDispatcher
 * @description Integration tests for PatchDispatcher component
 */

import React from 'react'
import {fireEvent, render, waitFor} from '@testing-library/react'
import path from 'path'
import {FileSystemContext, PatchDispatcher} from '@/components/PatchDispatcher'
import type {FileSystemOperations} from '../../types'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest' // Using Vitest for testing
import '@testing-library/jest-dom' // For jest-dom assertions
import fs from 'fs/promises'

// Real file system operations used in tests
const realFs: FileSystemOperations = {
  readFile: (p: string): Promise<string> => fs.readFile(p, 'utf8'),
  writeFile: (p: string, content: string): Promise<void> => fs.writeFile(p, content),
  exists: async (p: string): Promise<boolean> => {
    try {
      await fs.access(p)
      return true
    } catch {
      return false
    }
  },
  mkdir: (p: string) => fs.mkdir(p, { recursive: true }),
}

// Test constants
const testDir = path.join(__dirname, 'test-files')
let cleanup: (() => Promise<void>)[] = []

describe('PatchDispatcher Integration', () => {
  // Set up the test directory
  beforeEach(async () => {
    await realFs.mkdir(testDir)
  })

  // Clean up the test directory and other resources after each test
  afterEach(async () => {
    // Run any registered cleanup functions
    for (const cleanupFn of cleanup.reverse()) {
      await cleanupFn()
    }
    cleanup = []
    // Remove the test directory
    await fs.rm(testDir, { recursive: true, force: true })
  })

  it('processes real file system changes', async () => {
    const targetFile = path.join(testDir, 'test.txt')
    cleanup.push(() => fs.unlink(targetFile))

    const { container } = render(
      <FileSystemContext.Provider value={realFs}>
        <PatchDispatcher />
      </FileSystemContext.Provider>,
    )

    // File mock containing patch data
    const patchContent = `/* COMMAND INSERT PATH ${targetFile} */
Test content
/* COMMAND INSERT END*/`

    const file = new File([patchContent], 'test.patch.txt', { type: 'text/plain' })
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve(patchContent),
    })

    fireEvent.drop(container.firstChild!, {
      dataTransfer: { files: [file] },
    })

    await waitFor(async () => {
      const content = await realFs.readFile(targetFile)
      expect(content).toBe('Test content')
    })
  })

  it('handles complex patch sequences', async () => {
    const file1 = path.join(testDir, 'file1.txt')
    const file2 = path.join(testDir, 'file2.txt')
    cleanup.push(
      () => fs.unlink(file1),
      () => fs.unlink(file2),
    )

    const { container } = render(
      <FileSystemContext.Provider value={realFs}>
        <PatchDispatcher />
      </FileSystemContext.Provider>,
    )

    const patchContent = `/* COMMAND INSERT PATH ${file1} */
Content 1
/* COMMAND INSERT END*/
/* COMMAND INSERT PATH ${file2} */
Content 2
/* COMMAND INSERT END*/`

    const file = new File([patchContent], 'sequence.patch.txt', { type: 'text/plain' })
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve(patchContent),
    })

    fireEvent.drop(container.firstChild!, {
      dataTransfer: { files: [file] },
    })

    await waitFor(async () => {
      const [content1, content2] = await Promise.all([
        realFs.readFile(file1),
        realFs.readFile(file2),
      ])
      expect(content1).toBe('Content 1')
      expect(content2).toBe('Content 2')
    })
  })

  it('handles DELETE operations', async () => {
    const targetFile = path.join(testDir, 'to-delete.txt')
    await realFs.writeFile(targetFile, 'Original content')

    const { container } = render(
      <FileSystemContext.Provider value={realFs}>
        <PatchDispatcher />
      </FileSystemContext.Provider>,
    )

    const patchContent = `/* COMMAND DELETE PATH ${targetFile} */
/* COMMAND DELETE END*/`

    const file = new File([patchContent], 'delete.patch.txt', { type: 'text/plain' })
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve(patchContent),
    })

    fireEvent.drop(container.firstChild!, {
      dataTransfer: { files: [file] },
    })

    await waitFor(async () => {
      const exists = await realFs.exists(targetFile)
      expect(exists).toBe(false)
    })
  })

  it('maintains directory structure', async () => {
    const deepFile = path.join(testDir, 'deep/nested/structure/test.txt')
    cleanup.push(() =>
      fs.rm(path.join(testDir, 'deep'), { recursive: true, force: true }),
    )

    const { container } = render(
      <FileSystemContext.Provider value={realFs}>
        <PatchDispatcher />
      </FileSystemContext.Provider>,
    )

    const patchContent = `/* COMMAND INSERT PATH ${deepFile} */
Nested content
/* COMMAND INSERT END*/`

    const file = new File([patchContent], 'nested.patch.txt', { type: 'text/plain' })
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve(patchContent),
    })

    fireEvent.drop(container.firstChild!, {
      dataTransfer: { files: [file] },
    })

    await waitFor(async () => {
      const content = await realFs.readFile(deepFile)
      expect(content).toBe('Nested content')
    })
  })

    it('handles file system error gracefully', async () => {
    const invalidPath = path.join(testDir, '**invalid**/file.txt')
    const onError = vi.fn()

    const { container } = render(
      <FileSystemContext.Provider value={realFs}>
        <PatchDispatcher onError={onError} />
      </FileSystemContext.Provider>,
    )

    const patchContent = `/* COMMAND INSERT PATH ${invalidPath} */
Content
/* COMMAND INSERT END*/`

    const file = new File([patchContent], 'error.patch.txt', { type: 'text/plain' })
    Object.defineProperty(file, 'text', {
      value: () => Promise.resolve(patchContent),
    })

    fireEvent.drop(container.firstChild!, {
      dataTransfer: { files: [file] },
    })

    await waitFor(() => {
      expect(onError).toHaveBeenCalled()
    })
  })
})
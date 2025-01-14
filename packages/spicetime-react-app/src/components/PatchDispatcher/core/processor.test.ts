// File: packages/spicetime-react-app/src/components/PatchDispatcher/core/processor.test.ts

/**
 * @module PatchDispatcher
 * @description Unit tests for patch processor core functionality
 */

import {PatchProcessor} from './processor'
import type {FileSystemOperations} from './types'
import {vi} from 'vitest'


/**
 * Mock file system for testing
 * @internal
 */
const mockFs: FileSystemOperations = {
  readFile: vi.fn(),
  writeFile: vi.fn(),
  exists: vi.fn(),
  mkdir: vi.fn(),
}

describe('PatchProcessor', () => {
  let processor: PatchProcessor

  beforeEach(() => {
    processor = new PatchProcessor(mockFs)
    vi.clearAllMocks()
  })

  describe('parseCommands', () => {
    it('successfully parses valid INSERT command', async () => {
      const content = `/* COMMAND INSERT PATH test.txt */
content
/* COMMAND INSERT END*/`

      const result = await processor.processContent(content)
      expect(result.success).toBe(true)
      expect(result.operations).toHaveLength(1)
      expect(result.operations[0]).toEqual({
        type: 'INSERT',
        path: 'test.txt',
        content: 'content',
      })
    })

    it('reports line number for nested command error', async () => {
      const content = `/* COMMAND INSERT PATH test.txt */
/* COMMAND INSERT PATH other.txt */
content
/* COMMAND INSERT END*/`

      const result = await processor.processContent(content)
      expect(result.success).toBe(false)
      expect(result.error?.message).toContain('Nested command')
      expect(result.error?.line).toBe(2)
    })

    it('detects mismatched command types', async () => {
      const content = `/* COMMAND INSERT PATH test.txt */
content
/* COMMAND DELETE END*/`

      const result = await processor.processContent(content)
      expect(result.success).toBe(false)
      expect(result.error?.message).toContain('Command mismatch')
    })

    it('detects unclosed commands with line reference', async () => {
      const content = `/* COMMAND INSERT PATH test.txt */
content`

      const result = await processor.processContent(content)
      expect(result.success).toBe(false)
      expect(result.error?.message).toContain('Unclosed command')
      expect(result.error?.line).toBe(1)
    })
  })

  describe('file operations', () => {
    it('creates directories for INSERT operations', async () => {
      const content = `/* COMMAND INSERT PATH some/deep/path/test.txt */
content
/* COMMAND INSERT END*/`

      await processor.processContent(content)
      expect(mockFs.mkdir).toHaveBeenCalledWith('some/deep/path')
    })

    it('checks existence before DELETE operations', async () => {
      const content = `/* COMMAND DELETE PATH test.txt */
/* COMMAND DELETE END*/`

        vi.spyOn(mockFs, 'exists').mockResolvedValue(true)
      await processor.processContent(content)
      expect(mockFs.exists).toHaveBeenCalledWith('test.txt')
    })

    it('handles multiple operations in sequence', async () => {
      const content = `/* COMMAND INSERT PATH file1.txt */
content1
/* COMMAND INSERT END*/
/* COMMAND INSERT PATH file2.txt */
content2
/* COMMAND INSERT END*/`

      const result = await processor.processContent(content)
      expect(result.success).toBe(true)
      expect(result.operations).toHaveLength(2)
    })
  })
})

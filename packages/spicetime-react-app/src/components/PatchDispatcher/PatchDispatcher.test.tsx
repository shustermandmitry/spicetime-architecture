// Import necessary components
import type {FileSystemOperations} from './types';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {PatchProcessor} from './processor';

// Create a mock that matches FileSystemOperations
const mockFs: FileSystemOperations = {
    mkdir: vi.fn(), // Mock implementation will align with FileSystemOperations signature
    readFile: vi.fn(),
    writeFile: vi.fn(),
    exists: vi.fn(),
};

describe('PatchProcessor', () => {
    let processor: PatchProcessor;

    beforeEach(() => {
        // Initialize the processor with the mockFs object
        processor = new PatchProcessor(mockFs);
        vi.clearAllMocks(); // Reset mock states between tests
    });

    it('should create directories for nested INSERT commands', async () => {
        const patchContent = `/* COMMAND INSERT PATH nested/dir/file.txt */
mock content
/* COMMAND INSERT END*/`;

        // Mock mkdir to resolve successfully
        mockFs.mkdir = vi.fn().mockResolvedValue(undefined);

        // Run the processor
        const result = await processor.processContent(patchContent);

        expect(result.success).toBe(true);

        // Verify mkdir was called with the correct arguments
        expect(mockFs.mkdir).toHaveBeenCalledWith('nested/dir', {recursive: true});
    });

    it('should handle error when mkdir fails', async () => {
        const patchContent = `/* COMMAND INSERT PATH nested/dir/file.txt */
mock content
/* COMMAND INSERT END*/`;

        // Mock mkdir to reject with an error
        mockFs.mkdir = vi.fn().mockRejectedValue(new Error('Mock error'));

        // Run the processor
        const result = await processor.processContent(patchContent);

        expect(result.success).toBe(false);
        expect(result.error).toBe('Mock error');
    });

    it('should write content to the appropriate file after creating directories', async () => {
        const patchContent = `/* COMMAND INSERT PATH nested/dir/file.txt */
mock content
/* COMMAND INSERT END*/`;

        // Mock mkdir and writeFile methods to resolve successfully
        mockFs.mkdir = vi.fn().mockResolvedValue(undefined);
        mockFs.writeFile = vi.fn().mockResolvedValue(undefined);

        // Run the processor
        const result = await processor.processContent(patchContent);

        expect(result.success).toBe(true);

        // Verify correctness of mkdir and writeFile calls
        expect(mockFs.mkdir).toHaveBeenCalledWith('nested/dir', {recursive: true});
        expect(mockFs.writeFile).toHaveBeenCalledWith('nested/dir/file.txt', 'mock content');
    });
});
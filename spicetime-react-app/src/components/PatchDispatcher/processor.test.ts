import {PatchProcessor} from './processor';
import type {FileSystemOperations} from './types';
import {beforeEach, describe, expect, it, vi} from 'vitest';

const mockFs: Partial<FileSystemOperations> = {
    // @ts-ignore
    mkdir: vi.fn((path: string, options: { recursive: boolean }) =>
        Promise.resolve()
    ),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    exists: vi.fn(),
};


describe('PatchProcessor', () => {
    let processor: PatchProcessor;

    beforeEach(() => {
        processor = new PatchProcessor(mockFs);
        vi.clearAllMocks(); // Reset mocks before each test
    });

    describe('File System Operations', () => {
        it('should create directories for INSERT commands with nested paths', async () => {
            const patchContent = `/* COMMAND INSERT PATH nested/dir/file.txt */
mock content
/* COMMAND INSERT END*/`;

            // Mock mkdir to resolve successfully
            (mockFs.mkdir as ReturnType<typeof vi.fn>).mockResolvedValueOnce();

            const result = await processor.processContent(patchContent);

            expect(result.success).toBe(true);
            expect(result.operations[0]).toEqual({
                type: 'INSERT',
                path: 'nested/dir/file.txt',
                content: 'mock content',
            });
            expect(mockFs.mkdir).toHaveBeenCalledWith('nested/dir', {recursive: true}); // Expect mkdir to handle nested paths
        });
    });
});
import {afterEach, beforeEach, describe, expect, test, vi} from 'vitest';
import {resolvePaths, validatePath} from './resolve.js';
import {mkdir, rm, writeFile} from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple mocks
const mockCreateEvent = vi.fn();
const mockPathError = class extends Error {
    constructor(message, source) {
        super(message);
        this.name = 'PathError';
        this.source = source;
    }
};

vi.mock('@spicetime/util-events', () => ({
    createEvent: mockCreateEvent
}));

vi.mock('@spicetime/util-error', () => ({
    PathError: mockPathError
}));

describe('Path Resolver', () => {
    const tempDir = path.join(__dirname, 'temp-test-files');

    beforeEach(async () => {
        vi.clearAllMocks();
        await mkdir(tempDir, {recursive: true});
        await writeFile(path.join(tempDir, 'test.js'), '');
    });

    afterEach(async () => {
        await rm(tempDir, {recursive: true});
    });

    describe('Base Resolution', () => {
        test('uses cwd by default', async () => {
            const originalCwd = process.cwd();
            process.chdir(tempDir);

            try {
                const result = await resolvePaths('test.js');
                expect(result[0]).toBe(path.join(tempDir, 'test.js'));
            } finally {
                process.chdir(originalCwd);
            }
        });

        test('uses provided absolute root', async () => {
            const result = await resolvePaths('test.js', {
                root: tempDir
            });
            expect(result[0]).toBe(path.join(tempDir, 'test.js'));
        });

        test('resolves relative root from cwd', async () => {
            const originalCwd = process.cwd();
            process.chdir(path.dirname(tempDir));

            try {
                const result = await resolvePaths('test.js', {
                    root: './temp-test-files'
                });
                expect(result[0]).toBe(path.join(tempDir, 'test.js'));
            } finally {
                process.chdir(originalCwd);
            }
        });
    });

    describe('Path Validation', () => {
        test('validates existing path', async () => {
            const result = await validatePath('test.js', tempDir);
            expect(result).toBe(path.join(tempDir, 'test.js'));
        });

        test('throws on missing path', async () => {
            await expect(
                validatePath('missing.js', tempDir)
            ).rejects.toThrow(mockPathError);
        });
    });

    describe('Event Emission', () => {
        test('emits root resolution event', async () => {
            await resolvePaths('test.js', {root: tempDir});

            expect(mockCreateEvent).toHaveBeenCalledWith(
                'resolve base',
                tempDir
            );
        });

        test('emits path resolution event', async () => {
            await resolvePaths('test.js', {root: tempDir});

            expect(mockCreateEvent).toHaveBeenCalledWith(
                'resolve paths',
                expect.stringContaining('test.js')
            );
        });
    });
});
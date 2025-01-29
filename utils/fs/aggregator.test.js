import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import {Aggregator} from './aggregator.js';
import {mkdir, rm, writeFile} from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';
import {chmod} from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('Aggregator', () => {
    const tempDir = path.join(__dirname, 'temp-test-files');

    beforeEach(async () => {
        await mkdir(tempDir, {recursive: true});
        await mkdir(path.join(tempDir, 'nested'), {recursive: true});
        await writeFile(path.join(tempDir, 'file1.js'), 'content1');
        await writeFile(path.join(tempDir, 'nested/file2.js'), 'content2');
    });

    afterEach(async () => {
        await rm(tempDir, {recursive: true, force: true});
    });

    test('aggregates files with matching extensions', async () => {
        const aggregator = new Aggregator({
            includePaths: [tempDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();
        expect(result.context.fileCount).toBe(2);
        expect(result.context.content).toContain('content1');
        expect(result.context.content).toContain('content2');
    });

    test('handles no matching files', async () => {
        const aggregator = new Aggregator({
            includePaths: [tempDir],
            extensions: ['.ts']
        });

        const result = await aggregator.aggregate();
        expect(result.error).toContain('No matching files found');
    });

    test('respects maxDepth option', async () => {
        const aggregator = new Aggregator({
            includePaths: [tempDir],
            extensions: ['.js'],
            maxDepth: 0
        });

        const result = await aggregator.aggregate();
        expect(result.context.fileCount).toBe(1);
        expect(result.context.content).toContain('content1');
        expect(result.context.content).not.toContain('content2');
    });

    test('handles file read error', async () => {
        // Create unreadable file
        const unreadablePath = path.join(tempDir, 'unreadable.js');
        await writeFile(unreadablePath, 'content');
        await chmod(unreadablePath, '000');

        const aggregator = new Aggregator({
            includePaths: [tempDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();
        expect(result.context.fileCount).toBe(2); // Still counts other files
        expect(result.error).toBeDefined();
    });
});
import {afterEach, beforeEach, describe, expect, test} from 'vitest';
import {resolveFiles} from './aggregator.js';
import {mkdir, rm, writeFile} from 'fs/promises';
import path from 'path';
import {fileURLToPath} from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('File Resolution', () => {
    const testDir = path.join(__dirname, 'test-files');

    beforeEach(async () => {
        await mkdir(testDir, {recursive: true});
        await mkdir(path.join(testDir, 'nested'), {recursive: true});
        await writeFile(path.join(testDir, 'file1.js'), 'content1');
    });

    afterEach(async () => {
        await rm(testDir, {recursive: true, force: true});
    });

    test('resolves single file', async () => {
        const filePath = path.join(testDir, 'file1.js');
        const results = await resolveFiles(filePath);

        expect(results).toHaveLength(1);
        expect(results[0].info.message).toMatch(/returned file content/);
        expect(results[0].path).toBe(filePath);
    });

    test('handles missing file', async () => {
        const filePath = path.join(testDir, 'missing.js');
        const results = await resolveFiles(filePath);

        expect(results).toHaveLength(1);
        expect(results[0].info.message).toContain('error: ENOENT');
    });

    test('resolves glob pattern', async () => {
        const pattern = path.join(testDir, '**/*.js');
        const results = await resolveFiles(pattern);

        expect(results.length).toBeGreaterThan(0);
        results.forEach(result => {
            expect(result.info.message).toContain('returned file content');
            expect(result.path).toMatch(/\.js$/);
        });
    });
});
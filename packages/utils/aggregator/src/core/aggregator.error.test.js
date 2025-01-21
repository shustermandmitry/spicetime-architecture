/**
 * @module utils/aggregator/tests/errors
 * @description Tests demonstrating error handling behavior of the Aggregator utility.
 * Shows how the aggregator handles various error conditions and edge cases.
 */

import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import Aggregator from './aggregator.js';

/**
 * Error handling test suite.
 * Demonstrates how the Aggregator handles various error conditions:
 * - Missing directories
 * - Permission issues
 * - Invalid configurations
 * - File system edge cases
 */
describe('Aggregator Error Handling', () => {
    let tmpDir;

    beforeEach(async () => {
        tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aggregator-error-test-'));
    });

    afterEach(async () => {
        await fs.rm(tmpDir, {recursive: true, force: true});
    });

    /**
     * Shows how Aggregator handles non-existent directories.
     * The operation should complete without throwing, capturing the error in the result.
     *
     * @example
     * const aggregator = new Aggregator({
     *   includePaths: ['/path/does/not/exist'],
     *   extensions: ['.js']
     * });
     * const result = await aggregator.aggregate();
     * console.log(result.errors); // Contains ENOENT error
     */
    it('handles non-existent directories gracefully', async () => {
        const aggregator = new Aggregator({
            includePaths: [path.join(tmpDir, 'does-not-exist')],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();

        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('ENOENT');
        expect(result.stats.totalFiles).toBe(0);
        expect(result.stats.skippedFiles).toBe(0);
    });

    /**
     * Demonstrates behavior with permission errors.
     * Should capture permission errors but continue processing accessible files.
     *
     * @example
     * const aggregator = new Aggregator({
     *   includePaths: ['./restricted', './accessible'],
     *   extensions: ['.js']
     * });
     * const result = await aggregator.aggregate();
     * // Accessible files processed, permission errors recorded
     */
    it('handles permission errors', async () => {
        const restrictedDir = path.join(tmpDir, 'restricted');
        await fs.mkdir(restrictedDir);
        await fs.writeFile(path.join(restrictedDir, 'test.js'), 'content');
        await fs.chmod(restrictedDir, 0o000);

        const aggregator = new Aggregator({
            includePaths: [restrictedDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();

        expect(result.errors).toHaveLength(1);
        expect(result.errors[0].message).toContain('EACCES');
        expect(result.stats.totalFiles).toBe(0);
    });

    /**
     * Shows partial success handling with mixed accessible/inaccessible files.
     * Should process accessible files while recording errors for inaccessible ones.
     *
     * @example
     * // Aggregator continues processing despite some file errors
     * const result = await aggregator.aggregate();
     * console.log(result.stats.totalFiles);    // Successfully processed
     * console.log(result.stats.skippedFiles);  // Files with errors
     */
    it('handles unreadable files but continues processing', async () => {
        await fs.writeFile(path.join(tmpDir, 'readable.js'), 'readable content');
        await fs.writeFile(path.join(tmpDir, 'unreadable.js'), 'unreadable content');
        await fs.chmod(path.join(tmpDir, 'unreadable.js'), 0o000);

        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();

        expect(result.errors).toHaveLength(1);
        expect(result.stats.totalFiles).toBe(1);
        expect(result.stats.skippedFiles).toBe(1);
        expect(result.content).toContain('readable content');
    });

    /**
     * Shows validation of configuration options.
     * Demonstrates how invalid configurations are caught early.
     *
     * @example
     * // Invalid: extensions should be array
     * const badAggregator = new Aggregator({
     *   includePaths: ['./src'],
     *   extensions: '.js'  // Should be ['.js']
     * });
     */
    it('handles invalid configuration gracefully', async () => {
        const aggregator1 = new Aggregator({
            includePaths: [tmpDir],
            extensions: '.js' // Should be an array
        });

        await expect(aggregator1.aggregate())
            .rejects
            .toThrow('extensions must be an array');

        const aggregator2 = new Aggregator({
            includePaths: tmpDir, // Should be an array
            extensions: ['.js']
        });

        await expect(aggregator2.aggregate())
            .rejects
            .toThrow('includePaths must be an array');
    });

    /**
     * Demonstrates behavior with empty directories.
     * Should complete successfully with empty results.
     *
     * @example
     * const aggregator = new Aggregator({
     *   includePaths: ['./empty-dir'],
     *   extensions: ['.js']
     * });
     * const result = await aggregator.aggregate();
     * // result.stats.totalFiles === 0
     */
    it('handles empty directories', async () => {
        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();

        expect(result.stats.totalFiles).toBe(0);
        expect(result.files).toHaveLength(0);
        expect(result.content).toBe('');
        expect(result.errors).toHaveLength(0);
    });

    /**
     * Tests handling of deep directory structures.
     * Verifies proper handling of path length limits.
     */
    it('handles very long paths', async () => {
        let currentPath = tmpDir;
        const depth = 50;
        for (let i = 0; i < depth; i++) {
            currentPath = path.join(currentPath, 'nested' + i);
            await fs.mkdir(currentPath, {recursive: true});
        }

        await fs.writeFile(path.join(currentPath, 'test.js'), 'deep content');

        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();

        expect(result.stats.totalFiles).toBe(1);
        expect(result.content).toContain('deep content');
    });

    /**
     * Tests symlink handling behavior.
     * Demonstrates how symlinks are processed to avoid duplicates.
     */
    it('handles symlinks safely', async () => {
        await fs.writeFile(path.join(tmpDir, 'real.js'), 'real content');
        await fs.symlink(
            path.join(tmpDir, 'real.js'),
            path.join(tmpDir, 'link.js')
        );

        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();

        expect(result.stats.totalFiles).toBe(1);
        expect(result.content).toContain('real content');
        expect(result.content.match(/real content/g)).toHaveLength(1);
    });
});
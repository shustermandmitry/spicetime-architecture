/**
 * @module utils/aggregator/tests
 * @description Test suite demonstrating usage patterns and behavior of the Aggregator utility
 */

import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import Aggregator from './aggregator.js';

/**
 * Core functionality tests for the Aggregator class.
 * These tests demonstrate basic usage patterns and expected behavior.
 *
 * @example
 * // Basic file aggregation
 * const aggregator = new Aggregator({
 *   includePaths: ['./src'],
 *   extensions: ['.js']
 * });
 * const result = await aggregator.aggregate();
 */
describe('Aggregator', () => {
    let tmpDir;
    let testFiles;

    /**
     * Sets up a test environment with a known file structure:
     * - test1.js: Simple function
     * - test2.js: Simple function
     * - nested/test3.js: Simple function in subdirectory
     * - test.css: CSS file (for extension filtering)
     * - nested/test.md: Markdown file (for extension filtering)
     */
    beforeEach(async () => {
        tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aggregator-test-'));

        testFiles = {
            'test1.js': 'function test1() { return 1; }',
            'test2.js': 'function test2() { return 2; }',
            'nested/test3.js': 'function test3() { return 3; }',
            'test.css': '.test { color: red; }',
            'nested/test.md': '# Test'
        };

        for (const [filePath, content] of Object.entries(testFiles)) {
            const fullPath = path.join(tmpDir, filePath);
            await fs.mkdir(path.dirname(fullPath), {recursive: true});
            await fs.writeFile(fullPath, content);
        }
    });

    afterEach(async () => {
        await fs.rm(tmpDir, {recursive: true, force: true});
    });

    /**
     * Demonstrates basic file aggregation with extension filtering.
     * Shows how the Aggregator processes only files matching specified extensions.
     *
     * @example
     * const aggregator = new Aggregator({
     *   includePaths: ['./src'],
     *   extensions: ['.js']
     * });
     */
    it('aggregates JavaScript files', async () => {
        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();

        expect(result.stats.totalFiles).toBe(3);
        expect(result.files).toHaveLength(3);
        expect(result.content).toContain('function test1()');
        expect(result.content).toContain('function test2()');
        expect(result.content).toContain('function test3()');
        expect(result.content).not.toContain('.test { color: red; }');
        expect(result.content).not.toContain('# Test');
    });

    /**
     * Shows how to use exclude patterns to filter out specific paths.
     *
     * @example
     * const aggregator = new Aggregator({
     *   includePaths: ['./src'],
     *   extensions: ['.js'],
     *   excludePatterns: ['test', 'fixtures']
     * });
     */
    it('respects exclude patterns', async () => {
        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js'],
            excludePatterns: ['nested']
        });

        const result = await aggregator.aggregate();

        expect(result.stats.totalFiles).toBe(2);
        expect(result.files).toHaveLength(2);
        expect(result.content).toContain('function test1()');
        expect(result.content).toContain('function test2()');
        expect(result.content).not.toContain('function test3()');
    });

    /**
     * Demonstrates depth-limited directory traversal.
     *
     * @example
     * const aggregator = new Aggregator({
     *   includePaths: ['./src'],
     *   extensions: ['.js'],
     *   maxDepth: 1
     * });
     */
    it('respects maxDepth', async () => {
        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js'],
            maxDepth: 1
        });

        const result = await aggregator.aggregate();

        expect(result.stats.totalFiles).toBe(2);
        expect(result.files).toHaveLength(2);
        expect(result.content).toContain('function test1()');
        expect(result.content).toContain('function test2()');
        expect(result.content).not.toContain('function test3()');
    });

    /**
     * Shows how file paths are included in the aggregated output.
     * Each file's content is preceded by a comment containing its path.
     */
    it('includes file paths in output', async () => {
        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();

        const files = ['test1.js', 'test2.js', 'nested/test3.js'];
        for (const file of files) {
            expect(result.content).toContain(`/* FILE: ${file}`);
        }
    });
});
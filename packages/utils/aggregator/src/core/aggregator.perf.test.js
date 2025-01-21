/**
 * @module utils/aggregator/tests/performance
 * @description Performance benchmarks and scalability tests for the Aggregator utility.
 * Validates performance characteristics under various load conditions:
 * - Large numbers of files
 * - Large individual files
 * - Deep directory structures
 * - Memory usage patterns
 */

import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import Aggregator from './aggregator.js';

/**
 * Performance test suite for the Aggregator.
 * Measures and validates performance characteristics under different load scenarios.
 */
describe('Aggregator Performance', () => {
    let tmpDir;

    beforeEach(async () => {
        tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aggregator-perf-test-'));
    });

    afterEach(async () => {
        await fs.rm(tmpDir, {recursive: true, force: true});
    });

    /**
     * Creates test files according to specified parameters
     * @param {Object} config - File creation configuration
     * @param {number} [config.fileCount=1] - Number of files to create
     * @param {number} [config.sizeKB=1] - Size of each file in KB
     * @param {number} [config.depth=0] - Directory nesting depth
     * @param {string} [config.extension='.js'] - File extension
     * @returns {Promise<string[]>} Array of created file paths
     */
    async function createFiles(config) {
        const {
            fileCount = 1,
            sizeKB = 1,
            depth = 0,
            extension = '.js'
        } = config;

        const content = 'x'.repeat(sizeKB * 1024);
        const files = [];

        for (let i = 0; i < fileCount; i++) {
            const parts = [];
            for (let d = 0; d < depth; d++) {
                parts.push(`depth${d}`);
            }
            parts.push(`file${i}${extension}`);

            const filePath = path.join(tmpDir, ...parts);
            await fs.mkdir(path.dirname(filePath), {recursive: true});
            await fs.writeFile(filePath, content);
            files.push(filePath);
        }

        return files;
    }

    /**
     * Tests processing performance with many small files.
     * Verifies the aggregator can handle large numbers of files efficiently.
     * Expected performance: >100 files/second.
     *
     * @example
     * // Processing multiple small files
     * const aggregator = new Aggregator({
     *   includePaths: ['./src'],
     *   extensions: ['.js']
     * });
     * const result = await aggregator.aggregate();
     * // Should process quickly even with many files
     */
    it('handles large numbers of small files efficiently', async () => {
        const FILE_COUNT = 1000;
        await createFiles({fileCount: FILE_COUNT, sizeKB: 1});

        const startTime = process.hrtime.bigint();

        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();
        const endTime = process.hrtime.bigint();
        const durationMs = Number(endTime - startTime) / 1_000_000;

        expect(result.stats.totalFiles).toBe(FILE_COUNT);
        expect(result.errors).toHaveLength(0);

        // Performance assertions
        expect(durationMs).toBeLessThan(5000); // Complete within 5s
        expect(result.stats.totalFiles / (durationMs / 1000)).toBeGreaterThan(100); // >100 files/second
    });

    /**
     * Tests handling of large individual files.
     * Verifies efficient streaming of large file content.
     * Expected performance: >5MB/second processing rate.
     *
     * @example
     * // Processing a large file
     * const aggregator = new Aggregator({
     *   includePaths: ['./large-files'],
     *   extensions: ['.js']
     * });
     * const result = await aggregator.aggregate();
     * // Should handle large files without memory issues
     */
    it('handles large files efficiently', async () => {
        const SIZE_MB = 10;
        await createFiles({fileCount: 1, sizeKB: SIZE_MB * 1024});

        const startTime = process.hrtime.bigint();

        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();
        const endTime = process.hrtime.bigint();
        const durationMs = Number(endTime - startTime) / 1_000_000;

        expect(result.stats.totalFiles).toBe(1);
        expect(result.errors).toHaveLength(0);
        expect(result.stats.totalSize).toBe(SIZE_MB * 1024 * 1024);

        // Performance assertions
        expect(durationMs).toBeLessThan(1000); // Complete within 1s
        expect(result.stats.totalSize / (durationMs / 1000)).toBeGreaterThan(5 * 1024 * 1024); // >5MB/s
    });

    /**
     * Tests performance with deeply nested directories.
     * Verifies efficient directory traversal.
     * Expected performance: <100ms per depth level.
     *
     * @example
     * // Processing deeply nested files
     * const aggregator = new Aggregator({
     *   includePaths: ['./deep'],
     *   extensions: ['.js']
     * });
     * const result = await aggregator.aggregate();
     * // Should handle deep structures efficiently
     */
    it('handles deeply nested directories efficiently', async () => {
        const DEPTH = 50;
        const FILES_PER_DEPTH = 2;

        for (let d = 0; d < DEPTH; d++) {
            await createFiles({
                fileCount: FILES_PER_DEPTH,
                depth: d
            });
        }

        const startTime = process.hrtime.bigint();

        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();
        const endTime = process.hrtime.bigint();
        const durationMs = Number(endTime - startTime) / 1_000_000;

        const expectedFiles = DEPTH * FILES_PER_DEPTH;
        expect(result.stats.totalFiles).toBe(expectedFiles);
        expect(result.errors).toHaveLength(0);

        // Performance assertions
        expect(durationMs).toBeLessThan(3000); // Complete within 3s
        expect(durationMs / DEPTH).toBeLessThan(100); // <100ms per depth level
    });

    /**
     * Tests memory efficiency with mixed content.
     * Verifies memory usage patterns and garbage collection.
     * Expected: Memory growth should be bounded by largest single file.
     *
     * @example
     * // Processing mixed content
     * const aggregator = new Aggregator({
     *   includePaths: ['./mixed'],
     *   extensions: ['.js']
     * });
     * const result = await aggregator.aggregate();
     * // Should maintain reasonable memory usage
     */
    it('handles memory efficiently with large datasets', async () => {
        await createFiles({fileCount: 100, sizeKB: 1});     // Small files
        await createFiles({fileCount: 10, sizeKB: 1024});   // Medium files
        await createFiles({fileCount: 2, sizeKB: 5 * 1024}); // Large files

        const startHeap = process.memoryUsage().heapUsed;

        const aggregator = new Aggregator({
            includePaths: [tmpDir],
            extensions: ['.js']
        });

        const result = await aggregator.aggregate();
        const endHeap = process.memoryUsage().heapUsed;
        const heapGrowthMB = (endHeap - startHeap) / (1024 * 1024);

        expect(result.errors).toHaveLength(0);

        // Memory usage assertions
        expect(heapGrowthMB).toBeLessThan(100); // Reasonable heap growth
        expect(heapGrowthMB).toBeLessThan(20); // Bounded by largest file size
    });
});
/**
 * @module utils/aggregator
 * @category Utils
 * @subcategory Aggregation
 */

import {beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import {Aggregator} from './aggregator';
import fastGlob from 'fast-glob';
import {execSync} from 'child_process';

vi.mock('fast-glob');
const mockGlob = fastGlob as vi.MockedFunction<typeof fastGlob>;

describe('Aggregator', () => {
    beforeAll(() => {
        expect(() => execSync('pnpm run getSTARoot')).not.toThrow();
    });

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('given absolute paths', () => {
        it('should preserve them as-is', async () => {
            mockGlob.mockResolvedValue(['/absolute/path/file.ts']);
            const aggregator = new Aggregator({
                includePaths: ['/absolute/path/**/*.ts']
            });

            await aggregator.aggregate();

            expect(mockGlob).toHaveBeenCalledWith(['/absolute/path/**/*.ts'], {
                dot: true,
                absolute: true
            });
        });
    });

    describe('given relative paths', () => {
        it('should resolve through getSTARoot', async () => {
            mockGlob.mockResolvedValue(['file.ts']);
            const aggregator = new Aggregator({
                includePaths: ['./relative/path/**/*.ts']
            });

            await aggregator.aggregate();

            expect(mockGlob).toHaveBeenCalledWith(
                expect.arrayContaining(['./relative/path/**/*.ts']),
                expect.objectContaining({dot: true, absolute: true})
            );
        });
    });

    describe('given glob patterns', () => {
        it('should handle includes and excludes', async () => {
            mockGlob.mockResolvedValue(['src/foo.ts', 'src/bar.ts']);
            const aggregator = n
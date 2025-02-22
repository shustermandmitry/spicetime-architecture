import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { resolveLocation } from './location';
import { existsSync } from 'fs';
import { join, relative } from 'path';

// Mock fs and process.cwd
vi.mock('fs');
vi.mock('process', () => ({
    cwd: vi.fn().mockReturnValue('/test/current/dir')
}));

describe('location', () => {
    const CWD = '/test/current/dir';

    beforeEach(() => {
        vi.clearAllMocks();
        (existsSync as Mock).mockReset();
        vi.spyOn(process, 'cwd').mockReturnValue(CWD);
    });

    describe('resolveLocation', () => {
        it('finds package.json and sta.json in directory tree', async () => {
            (existsSync as Mock).mockImplementation((path: string) => {
                const relativePath = relative(CWD, path);
                return relativePath === 'package.json' || relativePath === 'sta.json';
            });

            const location = await resolveLocation();
            const expectedPackagePath = join(CWD, 'package.json');
            const expectedStaPath = join(CWD, 'sta.json');

            expect(relative(CWD, location.packagePath)).toBe(relative(CWD, expectedPackagePath));
            expect(relative(CWD, location.staRootPath!)).toBe(relative(CWD, expectedStaPath));
        });

        it('falls back to cwd when package.json not found', async () => {
            (existsSync as Mock).mockReturnValue(false);

            const location = await resolveLocation();

            expect(location.packagePath).toBe(CWD);
            expect(location.staRootPath).toBeNull();
        });

        it('returns null for staRootPath when sta.json not found', async () => {
            (existsSync as Mock).mockImplementation((path: string) => {
                const relativePath = relative(CWD, path);
                return relativePath === 'package.json';
            });

            const location = await resolveLocation();
            const expectedPackagePath = join(CWD, 'package.json');

            expect(relative(CWD, location.packagePath)).toBe(relative(CWD, expectedPackagePath));
            expect(location.staRootPath).toBeNull();
        });

        it('traverses up directory tree to find files', async () => {
            (existsSync as Mock).mockImplementation((path: string) => {
                return path === '/test/package.json' || path === '/test/sta.json';
            });

            const location = await resolveLocation();

            expect(relative('/test', location.packagePath)).toBe('package.json');
            expect(relative('/test', location.staRootPath!)).toBe('sta.json');
        });
    });
});
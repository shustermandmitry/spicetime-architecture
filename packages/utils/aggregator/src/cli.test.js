/**
 * @module utils/aggregator/tests/cli
 * @description CLI integration tests demonstrating command-line usage and behavior.
 * Shows how to use the aggregator utility from the command line with various options.
 */

import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {exec} from 'child_process';
import {promisify} from 'util';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execAsync = promisify(exec);

/**
 * CLI integration test suite.
 * Demonstrates command-line usage patterns and options:
 * - Basic file aggregation
 * - Extension filtering
 * - Output redirection
 * - Depth control
 * - Pattern exclusion
 */
describe('CLI', () => {
    let tmpDir;
    let cliPath;

    /**
     * Sets up test environment with sample files:
     * - test1.js: JavaScript file
     * - test2.js: JavaScript file
     * - nested/test3.js: Nested JavaScript file
     * - style.css: CSS file for extension filtering
     */
    beforeEach(async () => {
        tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aggregator-cli-test-'));

        await fs.writeFile(path.join(tmpDir, 'test1.js'), 'console.log("test1")');
        await fs.writeFile(path.join(tmpDir, 'test2.js'), 'console.log("test2")');
        await fs.mkdir(path.join(tmpDir, 'nested'));
        await fs.writeFile(path.join(tmpDir, 'nested/test3.js'), 'console.log("test3")');
        await fs.writeFile(path.join(tmpDir, 'style.css'), '.test { color: red }');

        cliPath = path.resolve('./src/cli.js');
    });

    afterEach(async () => {
        await fs.rm(tmpDir, {recursive: true, force: true});
    });

    /**
     * Helper to run CLI with arguments
     * @param {string} args - Command line arguments
     * @returns {Promise<{stdout: string, stderr: string, code: number}>}
     */
    async function runCLI(args) {
        try {
            const {stdout, stderr} = await execAsync(`node ${cliPath} ${args}`);
            return {stdout, stderr, code: 0};
        } catch (error) {
            return {
                stdout: error.stdout,
                stderr: error.stderr,
                code: error.code
            };
        }
    }

    /**
     * Tests basic CLI usage with default options.
     * @example
     * $ spicetime-aggregate --paths "./src"
     */
    it('aggregates files with default options', async () => {
        const {stdout, code} = await runCLI(`--paths ${tmpDir}`);

        expect(code).toBe(0);
        expect(stdout).toContain('test1');
        expect(stdout).toContain('test2');
        expect(stdout).toContain('test3');
        expect(stdout).not.toContain('.test { color: red }');
        expect(stdout).toContain('Files processed: 3');
    });

    /**
     * Shows custom extension filtering.
     * @example
     * $ spicetime-aggregate --paths "./src" --extensions ".css"
     */
    it('respects custom file extensions', async () => {
        const {stdout, code} = await runCLI(
            `--paths ${tmpDir} --extensions ".css"`
        );

        expect(code).toBe(0);
        expect(stdout).toContain('.test { color: red }');
        expect(stdout).not.toContain('console.log');
        expect(stdout).toContain('Files processed: 1');
    });

    /**
     * Demonstrates output file redirection.
     * @example
     * $ spicetime-aggregate --paths "./src" --output "output.txt"
     */
    it('writes output to file when specified', async () => {
        const outputFile = path.join(tmpDir, 'output.txt');
        const {code} = await runCLI(
            `--paths ${tmpDir} --output ${outputFile}`
        );

        expect(code).toBe(0);

        const content = await fs.readFile(outputFile, 'utf8');
        expect(content).toContain('test1');
        expect(content).toContain('test2');
        expect(content).toContain('test3');
    });

    /**
     * Shows depth limiting functionality.
     * @example
     * $ spicetime-aggregate --paths "./src" --max-depth 1
     */
    it('respects max depth option', async () => {
        const {stdout, code} = await runCLI(
            `--paths ${tmpDir} --max-depth 1`
        );

        expect(code).toBe(0);
        expect(stdout).toContain('test1');
        expect(stdout).toContain('test2');
        expect(stdout).not.toContain('test3');
        expect(stdout).toContain('Files processed: 2');
    });

    /**
     * Demonstrates pattern exclusion.
     * @example
     * $ spicetime-aggregate --paths "./src" --exclude "nested,test"
     */
    it('handles exclude patterns', async () => {
        const {stdout, code} = await runCLI(
            `--paths ${tmpDir} --exclude "nested"`
        );

        expect(code).toBe(0);
        expect(stdout).toContain('test1');
        expect(stdout).toContain('test2');
        expect(stdout).not.toContain('test3');
        expect(stdout).toContain('Files processed: 2');
    });

    /**
     * Shows handling of multiple input paths.
     * @example
     * $ spicetime-aggregate --paths "./src,./lib"
     */
    it('handles multiple paths', async () => {
        const tmpDir2 = await fs.mkdtemp(path.join(os.tmpdir(), 'aggregator-cli-test2-'));
        await fs.writeFile(path.join(tmpDir2, 'other.js'), 'console.log("other")');

        try {
            const {stdout, code} = await runCLI(
                `--paths ${tmpDir},${tmpDir2}`
            );

            expect(code).toBe(0);
            expect(stdout).toContain('test1');
            expect(stdout).toContain('test2');
            expect(stdout).toContain('test3');
            expect(stdout).toContain('other');
            expect(stdout).toContain('Files processed: 4');
        } finally {
            await fs.rm(tmpDir2, {recursive: true, force: true});
        }
    });

    /**
     * Shows error handling with invalid paths.
     * @example
     * $ spicetime-aggregate --paths "/invalid/path"
     */
    it('fails gracefully with invalid path', async () => {
        const {stderr, code} = await runCLI(
            '--paths /path/that/does/not/exist'
        );

        expect(code).not.toBe(0);
        expect(stderr).toContain('Aggregation failed');
    });

    /**
     * Shows validation of max-depth argument.
     * @example
     * $ spicetime-aggregate --paths "./src" --max-depth invalid
     */
    it('fails gracefully with invalid max-depth', async () => {
        const {stderr, code} = await runCLI(
            `--paths ${tmpDir} --max-depth invalid`
        );

        expect(code).not.toBe(0);
        expect(stderr).toContain('max-depth must be a number');
    });

    /**
     * Shows help output.
     * @example
     * $ spicetime-aggregate --help
     */
    it('displays help with --help flag', async () => {
        const {stdout, code} = await runCLI('--help');

        expect(code).toBe(0);
        expect(stdout).toContain('Options:');
        expect(stdout).toContain('--paths');
        expect(stdout).toContain('--extensions');
        expect(stdout).toContain('--exclude');
        expect(stdout).toContain('--max-depth');
        expect(stdout).toContain('--output');
    });
});
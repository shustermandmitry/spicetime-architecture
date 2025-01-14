// File: packages/spicetime-react-app/src/components/PatchDispatcher/cli.ts

/**
 * @module PatchDispatcher
 * @description Command line interface for patch processing
 */

import path from 'path';
import {promises as fs} from 'fs';
import {PatchProcessor} from '@/components/PatchDispatcher/core/processor'
import {FileSystemOperations} from '@/components/PatchDispatcher/core/types'

/**
 * CLI entry point
 */
async function main(): Promise<void> {
    if (process.argv.length < 3) {
        console.error('Error: Please provide a patch file as an argument');
        process.exit(1);
    }

    const patchDir = path.join(process.cwd(), 'patches');
    const patchFileName = process.argv[2];

    // Validate patch file input
    if (!patchFileName.endsWith('.patch')) {
        console.error('Error: Invalid patch file. Please provide a valid .patch file.');
        process.exit(1);
    }

    const patchFile = path.join(patchDir, patchFileName);

    // Check if the patches directory exists
    try {
        await fs.access(patchDir);
    } catch (err: any) {
        console.error(`Error accessing patches directory: ${err.message}`);
        process.exit(1);
    }

    // Try processing the patch file, adding a general error boundary
    try {
        await processPatchFile(patchFile);
    } catch (error: any) {
        console.error('An unexpected error occurred while processing:', error.message || error);
        process.exit(1);
    }
}

/**
 * Process patch file and report results
 * @param filePath - Path to patch file
 */
async function processPatchFile(filePath: string): Promise<void> {
    const processor = new PatchProcessor(fileSystem);

    try {
        console.log(`Processing ${filePath}...`);

        const content = await fileSystem.readFile(filePath);
        const result = await processor.processContent(content);

        if (result.success) {
            console.log('\nPatch applied successfully:');
            result.operations.forEach((op) => {
                console.log(`  ${op.type}: ${op.path}`);
            });
        } else {
            console.error('\nPatch failed:', result.error?.message ?? 'Unknown error');
            if (result.error?.line) {
                console.error(`Error occurred at line ${result.error.line}`);
            }
            process.exit(1);
        }
    } catch (error: any) {
        console.error('Fatal error while processing the patch file:', error.message || error);
        process.exit(1);
    }
}

/**
 * File system operations implementation.unstructured using Node.js fs module
 */
// Explicitly handle the promise type since `fs.mkdir` returns `Promise<string | undefined>` when using `recursive: true`.
const fileSystem: FileSystemOperations = {
    readFile: (p: string) => fs.readFile(p, 'utf8'),
    writeFile: (p: string, content: string) => fs.writeFile(p, content),
    exists: async (p: string) => {
        try {
            await fs.access(p);
            return true;
        } catch {
            return false;
        }
    },
    mkdir: async (p: string): Promise<string | undefined> => await fs.mkdir(p, {recursive: true})
};
/**
 * PatchProcessor class would be implemented here or imported from another module
 */

/**
 * Ensure main function execution
 */
main().catch((err) => {
    console.error('Unexpected error occurred at the application level:', err.message || err);
    process.exit(1);
});
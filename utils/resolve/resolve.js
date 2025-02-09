/**
 * @module utils/fs/resolve
 * @category Utils
 * @subcategory FileSystem
 */

import path from 'path';
import {stat} from 'fs/promises';
import fastGlob from 'fast-glob';
import {PathError} from '@spicetime/util-error';
import {createEvent} from '@spicetime/util-events';

/**
 * Resolves file paths or glob patterns from given root or process.cwd()
 * @param {string|string[]} patterns - Path or glob patterns to resolve
 * @param {Object} [options] - Resolution options
 * @param {string} [options.root] - Base resolution path (absolute or relative to process.cwd())
 * @param {string[]} [options.extensions] - File extensions to include
 * @param {string[]} [options.excludePatterns] - Glob patterns to exclude
 * @param {number} [options.maxDepth] - Maximum directory traversal depth
 * @returns {Promise<string[]>} Array of resolved absolute paths
 * @throws {PathError} When resolution fails
 */
export async function resolvePaths(patterns, options = {}) {
    try {
        // Determine base path
        const base = options.root ?
            path.isAbsolute(options.root) ?
                options.root :
                path.resolve(process.cwd(), options.root) :
            process.cwd();

        createEvent('resolve base', base);

        const resolvedPatterns = (Array.isArray(patterns) ? patterns : [patterns])
            .map(p => path.join(base, path.isAbsolute(p) ?
                path.relative(base, p) : p)
            );

        createEvent('resolve paths', resolvedPatterns.join(', '));

        const files = await fastGlob(resolvedPatterns, {
            absolute: true,
            ignore: options.excludePatterns,
            dot: false,
            deep: options.maxDepth ?? Infinity,
            cwd: base
        });

        if (options.extensions?.length) {
            return files.filter(file =>
                options.extensions.some(ext => file.endsWith(ext))
            );
        }

        return files;

    } catch (err) {
        throw new PathError(err.message, 'resolvePaths', {
            patterns,
            options
        });
    }
}

/**
 * Validates path existence from given root or process.cwd()
 * @param {string} filePath - Path to validate
 * @param {string} [root] - Base resolution path (absolute or relative to process.cwd())
 * @returns {Promise<string>} Absolute path
 * @throws {PathError} When path doesn't exist or validation fails
 */
export async function validatePath(filePath, root) {
    try {
        const base = root ?
            path.isAbsolute(root) ?
                root :
                path.resolve(process.cwd(), root) :
            process.cwd();

        const absPath = path.join(base,
            path.isAbsolute(filePath) ?
                path.relative(base, filePath) : filePath
        );

        const stats = await stat(absPath);
        createEvent('validate path', absPath, null, {stats});

        return absPath;

    } catch (err) {
        throw new PathError(err.message, 'validatePath', {
            path: filePath,
            root
        });
    }
}
/**
 * @module utils/fs
 */

import fastGlob from 'fast-glob';
import {stat} from 'fs/promises';
import path from 'path';
import {createEvent} from '../events/createEvent.js';

export class Aggregator {
    constructor(config) {
        this.config = config;
    }

    /**
     * Aggregate file contents according to configuration
     * @returns {Promise<Object>} Aggregation result
     */
    async aggregate() {
        const files = await Promise.all(
            this.config.includePaths.map(p => resolveFiles(p))
        );
        // ... implement aggregation logic
    }
}

export async function resolveFiles(pathOrPattern) {
    try {
        const absPath = path.isAbsolute(pathOrPattern)
            ? pathOrPattern
            : path.resolve(process.cwd(), pathOrPattern);

        if (!fastGlob.isDynamicPattern(absPath)) {
            try {
                const stats = await stat(absPath);
                return [{
                    path: absPath,
                    info: createEvent(
                        'returned file content',
                        absPath,
                        null,
                        {stats, type: stats.isDirectory() ? 'directory' : 'file'}
                    )
                }];
            } catch (e) {
                return [{
                    path: absPath,
                    info: createEvent('returned file content', absPath, e.message)
                }];
            }
        }

        const files = await fastGlob(absPath, {
            absolute: true,
            stats: true,
            suppressErrors: true
        });

        return files.length ? files.map(file => ({
            path: file,
            info: createEvent(
                'returned file content',
                file,
                '',
                {stats: file.stats, type: 'file'}
            )
        })) : [{
            path: absPath,
            info: createEvent(
                'returned file content',
                absPath,
                'No matches found'
            )
        }];

    } catch (e) {
        return [{
            path: pathOrPattern,
            info: createEvent(
                'returned file content',
                pathOrPattern,
                e.message
            )
        }];
    }
}
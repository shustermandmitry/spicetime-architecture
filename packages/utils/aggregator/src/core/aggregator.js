/**
 * @module utils/aggregator
 * @description File content aggregator utility that combines source files into a single output.
 *
 * @example
 * // Basic usage
 * import { Aggregator } from '@spicetime/aggregator';
 *
 * const aggregator = new Aggregator({
 *   includePaths: ['./src'],
 *   extensions: ['.js', '.jsx'],
 *   excludePatterns: ['node_modules']
 * });
 *
 * const result = await aggregator.aggregate();
 *
 * @example
 * // CLI usage
 * spicetime-aggregate --paths "./src" --extensions ".js,.jsx" --output "aggregated.txt"
 */

import fs from 'fs/promises';
import path from 'path';
import glob from 'glob';

/**
 * Configuration options for the Aggregator
 * @typedef {Object} AggregatorConfig
 * @property {string[]} includePaths - Paths to aggregate content from
 * @property {string[]} extensions - File extensions to include
 * @property {string[]} [excludePatterns] - Patterns to exclude
 * @property {number} [maxDepth=Infinity] - Maximum directory depth
 */

/**
 * Result of content aggregation
 * @typedef {Object} AggregateResult
 * @property {string} content - Combined file contents
 * @property {string[]} files - Processed file paths
 * @property {Array<{path: string, message: string}>} errors - Errors encountered
 * @property {Object} stats - Aggregation statistics
 * @property {number} stats.totalFiles - Number of files processed
 * @property {number} stats.totalSize - Total content size in bytes
 * @property {number} stats.skippedFiles - Number of files skipped
 */

/**
 * Core aggregator class for combining file contents
 */
class Aggregator {
    /**
     * Creates a new Aggregator instance
     * @param {AggregatorConfig} config - Configuration options
     * @param {string} [cwd=process.cwd()] - Working directory
     */
    constructor(config, cwd = process.cwd()) {
        this.config = {
            maxDepth: Infinity,
            excludePatterns: [],
            ...config
        };
        this.cwd = cwd;
    }

    /**
     * Aggregates content from files matching the configured patterns
     * @returns {Promise<AggregateResult>} Aggregated content and metadata
     */
    async aggregate() {
        const result = {
            content: '',
            files: [],
            errors: [],
            stats: {
                totalFiles: 0,
                totalSize: 0,
                skippedFiles: 0
            }
        };

        try {
            for (const includePath of this.config.includePaths) {
                const resolvedPath = path.resolve(this.cwd, includePath);
                const globPattern = path.join(
                    resolvedPath,
                    this.config.maxDepth === Infinity ? '**/*' : '*'.repeat(this.config.maxDepth)
                );

                const files = glob.sync(globPattern, {nodir: true});

                const filteredFiles = files.filter(file => {
                    const ext = path.extname(file);
                    return this.config.extensions.includes(ext) &&
                        !this.config.excludePatterns?.some(pattern => file.includes(pattern));
                });

                for (const file of filteredFiles) {
                    try {
                        const content = await fs.readFile(file, 'utf8');
                        const relativePath = path.relative(this.cwd, file);

                        result.content += this._formatContent(relativePath, content);
                        result.files.push(relativePath);
                        result.stats.totalFiles++;
                        result.stats.totalSize += content.length;
                    } catch (error) {
                        result.errors.push({
                            path: file,
                            message: error.message
                        });
                        result.stats.skippedFiles++;
                    }
                }
            }
        } catch (error) {
            result.errors.push({
                path: 'aggregator',
                message: `Global aggregation error: ${error.message}`
            });
        }

        return result;
    }

    /**
     * Formats content with file path comment
     * @private
     * @param {string} filePath - Path to the file
     * @param {string} content - File content
     * @returns {string} Formatted content
     */
    _formatContent(filePath, content) {
        return `\n/* FILE: ${filePath} */\n${content}\n`;
    }
}

export default Aggregator;
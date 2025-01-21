#!/usr/bin/env node

/**
 * @module utils/aggregator/cli
 * @description Command line interface for the file content aggregator.
 *
 * @example
 * # Basic usage
 * spicetime-aggregate --paths "./src" --extensions ".js,.jsx"
 *
 * @example
 * # Multiple paths and output file
 * spicetime-aggregate -p "./src,./lib" -e ".ts,.js" -o "aggregated.txt"
 *
 * @example
 * # With exclude patterns and depth limit
 * spicetime-aggregate --paths "./src" --exclude "tests,fixtures" --max-depth 2
 */

import {Command} from 'commander';
import fs from 'fs/promises';
import path from 'path';
import Aggregator from './core/aggregator.js';

/**
 * Parses a comma-separated string into an array
 * @param {string} value - Comma-separated string
 * @returns {string[]} Array of trimmed values
 */
function parseList(value) {
    return value.split(',').map(item => item.trim());
}

/**
 * Formats byte size to human readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
function formatSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Prints aggregation statistics
 * @param {import('./core/aggregator.js').AggregateResult} result
 */
function printStats(result) {
    console.log('\nAggregation Stats:');
    console.log(`Files processed: ${result.stats.totalFiles}`);
    console.log(`Total size: ${formatSize(result.stats.totalSize)}`);

    if (result.stats.skippedFiles > 0) {
        console.log(`Skipped files: ${result.stats.skippedFiles}`);
    }

    if (result.errors.length > 0) {
        console.error('\nErrors encountered:');
        result.errors.forEach(error => {
            console.error(`${error.path}: ${error.message}`);
        });
    }
}

/**
 * Validates CLI options and returns config
 * @param {object} options - Commander options object
 * @returns {import('./core/aggregator.js').AggregatorConfig}
 */
function validateOptions(options) {
    const config = {
        includePaths: parseList(options.paths),
        extensions: parseList(options.extensions),
        excludePatterns: parseList(options.exclude),
        maxDepth: options.maxDepth === 'Infinity'
            ? Infinity
            : parseInt(options.maxDepth, 10)
    };

    if (isNaN(config.maxDepth)) {
        throw new Error('max-depth must be a number or "Infinity"');
    }

    return config;
}

const program = new Command();

program
    .name('spicetime-aggregate')
    .description('Aggregate file contents based on patterns')
    .option(
        '-p, --paths <paths>',
        'Comma-separated paths to include',
        './src'
    )
    .option(
        '-e, --extensions <extensions>',
        'Comma-separated file extensions',
        '.js,.jsx'
    )
    .option(
        '-x, --exclude <patterns>',
        'Comma-separated exclude patterns',
        'node_modules,dist'
    )
    .option(
        '-d, --max-depth <depth>',
        'Maximum directory depth',
        'Infinity'
    )
    .option(
        '-o, --output <file>',
        'Output file path'
    );

program.parse();

const options = program.opts();

async function main() {
    try {
        const config = validateOptions(options);
        const aggregator = new Aggregator(config);
        const result = await aggregator.aggregate();

        printStats(result);

        if (options.output) {
            const outputPath = path.resolve(process.cwd(), options.output);
            await fs.writeFile(outputPath, result.content, 'utf8');
            console.log(`\nOutput written to: ${outputPath}`);
        } else {
            console.log('\nAggregated Content:');
            console.log(result.content);
        }

    } catch (error) {
        console.error('Aggregation failed:', error.message);
        process.exit(1);
    }
}

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
    process.exit(1);
});

main();
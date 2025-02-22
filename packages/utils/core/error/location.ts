/**
 * @module utils/core/STError/location
 * @packageDocumentation
 *
 * Location resolution utilities for STError system.
 * Internal module for resolving package and project paths.
 */

import { findUpSync } from 'find-up';
import type { Location } from './location.type';

export async function resolveLocation(): Promise<Location> {
    try {
        const packagePath = findUpSync('package.json') || process.cwd();
        const staRootPath = findUpSync('sta.json');

        return {
            packagePath,
            staRootPath: staRootPath  ?? null
        };
    } catch {
        return {
            packagePath: process.cwd(),
            staRootPath: null
        };
    }
}
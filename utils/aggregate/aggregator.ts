/**
 * @module utils/aggregator
 * @category Utils
 * @subcategory Aggregation
 */

import {execSync} from 'child_process';
import fastGlob from 'fast-glob';
import {readFile} from 'fs/promises';
import {TSError} from '@sta/error-util';
import {AggregateResult, AggregatorConfig} from './aggregator.types';
import {join} from 'path';

export class Aggregator {
    private config: AggregatorConfig;
    private staRoot: string;

    constructor(config: AggregatorConfig) {
        this.config = config;
        this.staRoot = '';
    }

    public async aggregate(): Promise<AggregateResult> {
        await this.initSTARoot();

        try {
            const patterns = this.buildGlobPatterns();
            const files = await fastGlob(patterns, {
                ignore: this.config.excludePatterns,
                dot: true,
                absolute: true
            });

            const contents = await Promise.all(
                files.map(file => readFile(file, 'utf-8'))
            );

            return {
                files,
                content: contents.join('\n')
            };

        } catch (error) {
            throw new TSError('File aggregation failed', {
                info: {
                    localMessage: 'Failed to collect or read files',
                    remoteMessage: error instanceof Error ? error.message : String(error),
                    packageTemplateInfo: {
                        domain: await this.getDomain(),
                        name: await this.getPackageName()
                    },
                    packageInstanceInfo: {
                        pathToPackageRoot: process.cwd(),
                        pathToSTARoot: this.staRoot
                    }
                }
            });
        }
    }

    private async initSTARoot(): Promise<void> {
        try {
            this.staRoot = execSync('pnpm run getSTARoot').toString().trim();
        } catch (error) {
            throw new TSError('Failed to get STA root', {
                info: {
                    localMessage: 'getSTARoot command failed',
                    remoteMessage: error instanceof Error ? error.message : String(error),
                    packageTemplateInfo: {
                        domain: await this.getDomain(),
                        name: await this.getPackageName()
                    },
                    packageInstanceInfo: {
                        pathToPackageRoot: process.cwd(),
                        pathToSTARoot: ''
                    }
                }
            });
        }
    }

    private async getDomain(): Promise<string> {
        return execSync('pnpm run getDomain').toString().trim();
    }

    private async getPackageName(): Promise<string> {
        return execSync('pnpm run getPackageName').toString().trim();
    }

    private resolvePath(path: string): string {
        if (path.startsWith('/')) return path;
        return join(this.staRoot, path);
    }

    private buildGlobPatterns(): string[] {
        const patterns: string[] = [];

        for (const path of this.config.includePaths) {
            if (this.config.extensions?.length) {
                for (const ext of this.config.extensions) {
                    patterns.push(this.resolvePath(`${path}/**/*${ext}`));
                }
            } else {
                patterns.push(this.resolvePath(path));
            }
        }

        return patterns;
    }
}

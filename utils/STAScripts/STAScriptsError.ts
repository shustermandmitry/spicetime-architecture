/**
 * @module utils/staScripts/error
 * @category Utils
 * @subcategory Scripts
 *
 * Error handling for script execution.
 * Wraps all script failures with package context
 * and error chain preservation.
 *
 * @remarks
 * Error design focuses on:
 * - Automated context collection
 * - Clean error propagation
 * - Direct script execution
 * - Package-aware error chains
 */

import {GetDomain} from './getDomain';
import {GetPackageName} from './getPackageName';
import {STError} from '@sta/error';

/**
 * Script execution error wrapper.
 * Collects package context and preserves error chains.
 *
 * @class STAScriptError
 * @extends {STError}
 *
 * @example
 * ```ts
 * throw new STAScriptError('getPackage', error);
 * ```
 */
export class STAScriptError extends STError {
    /**
     * Creates script error with context
     *
     * @param scriptName - Name of failed script
     * @param error - Original error or message
     */
    constructor(scriptName: string, error: unknown) {
        const domain = new GetDomain().execute();
        const packageName = new GetPackageName().execute();

        super('Script execution failed', {
            info: {
                localMessage: `${scriptName} script failed`,
                remoteMessage: error instanceof Error ? error.message : String(error),
                packageTemplateInfo: {
                    domain: domain,
                    name: packageName
                },
                packageInstanceInfo: {
                    pathToPackageRoot: process.cwd()
                }
            }
        });
    }
}
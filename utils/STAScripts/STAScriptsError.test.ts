/**
 * @module utils/staScripts/test
 * @category Utils
 * @subcategory Scripts
 *
 * STAScriptError must:
 * - Collect package info via scripts
 * - Handle script execute failures
 * - Preserve error chains
 */

import {describe, expect, it, vi} from 'vitest';
import {STAScriptError} from './staScripts';
import {GetDomain} from './getDomain';
import {GetPackageName} from './getPackageName';

vi.mock('./getDomain');
vi.mock('./getPackageName');

describe('STAScriptError', () => {
    it('creates error with script context', () => {
        vi.mocked(GetDomain.prototype.execute).mockReturnValue('testDomain');
        vi.mocked(GetPackageName.prototype.execute).mockReturnValue('testPackage');

        const originalError = new Error('original');
        const error = new STAScriptError('test', originalError);

        expect(error.message).toBe('Script execution failed');
        expect(error.info.localMessage).toBe('test script failed');
        expect(error.info.remoteMessage).toBe('original');
        expect(error.info.packageTemplateInfo).toEqual({
            domain: 'testDomain',
            name: 'testPackage'
        });
    });

    it('propagates script execution errors', () => {
        const domainError = new Error('domain failed');
        const packageError = new Error('package failed');

        vi.mocked(GetDomain.prototype.execute).mockImplementation(() => {
            throw domainError;
        });
        vi.mocked(GetPackageName.prototype.execute).mockImplementation(() => {
            throw packageError;
        });

        const error = new STAScriptError('test', 'original');
        expect(error.info.remoteMessage).toBe('original');
    });

    it('handles non-Error objects', () => {
        vi.mocked(GetDomain.prototype.execute).mockReturnValue('domain');
        vi.mocked(GetPackageName.prototype.execute).mockReturnValue('package');

        const error = new STAScriptError('test', {custom: 'error'});
        expect(error.info.remoteMessage).toBe('[object Object]');
    });
});
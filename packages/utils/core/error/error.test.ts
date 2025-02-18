import { describe, it, expect, beforeEach, vi } from 'vitest';
import { STError } from './error';
import type { ErrorInfo, Location } from './error.type';

describe('STError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue('/test/current/dir');
  });

  describe('core functionality', () => {
    it('creates error with basic message', () => {
      const error = new STError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('STError');
    });

    it('includes error info in instance', () => {
      const error = new STError('Test error');
      const expectedInfo: ErrorInfo = {
        errorType: 'STError',
        message: 'Test error',
        location: {
          packagePath: expect.any(String),
          staRootPath: null
        },
        extInfo: null
      };
      expect(error.info).toMatchObject(expectedInfo);
    });

    it('handles extended info', () => {
      const extInfo = { code: 500, details: 'Additional info' };
      const error = new STError('Test error', extInfo);
      const expectedInfo: ErrorInfo = {
        errorType: 'STError',
        message: 'Test error',
        location: expect.any(Object),
        extInfo
      };
      expect(error.info).toMatchObject(expectedInfo);
    });
  });

  describe('custom error creation', () => {
    it('creates custom error type', () => {
      const ValidationError = STError.createCustomError('ValidationError');
      const error = new ValidationError('Invalid input');
      const expectedInfo: ErrorInfo = {
        errorType: 'ValidationError',
        message: 'Invalid input',
        location: expect.any(Object),
        extInfo: null
      };
      expect(error.info).toMatchObject(expectedInfo);
    });

    it('maintains extended info in custom errors', () => {
      const ValidationError = STError.createCustomError('ValidationError');
      const extInfo = { fields: ['email'] };
      const error = new ValidationError('Invalid input', extInfo);
      const expectedInfo: ErrorInfo = {
        errorType: 'ValidationError',
        message: 'Invalid input',
        location: expect.any(Object),
        extInfo
      };
      expect(error.info).toMatchObject(expectedInfo);
    });
  });

  describe('location resolution', () => {
    it('falls back to cwd when no package.json found', () => {
      const error = new STError('Test error');
      const expectedLocation: Location = {
        packagePath: '/test/current/dir',
        staRootPath: null
      };
      expect(error.info.location).toMatchObject(expectedLocation);
    });
  });

  describe('error chaining', () => {
    it('chains external error information', () => {
      const originalError = new STError('Original error');
      const error = new STError('Operation failed', originalError);
      const expectedInfo: ErrorInfo = {
        errorType: 'STError',
        message: 'Operation failed',
        location: expect.any(Object),
        extInfo: originalError
      };
      expect(error.info).toMatchObject(expectedInfo);
    });

    it('handles nested STErrors', () => {
      const innerError = new STError('Inner error');
      const outerError = new STError('Outer error', innerError);
      expect(outerError.info.extInfo).toBe(innerError);
      expect((outerError.info.extInfo as STError).info.errorType).toBe('STError');
    });
  });
});

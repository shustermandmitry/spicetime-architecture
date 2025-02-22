import { describe, it, expect, vi, beforeEach } from 'vitest';
import { STError } from './STError';
import { resolveLocation } from './location';

// Mock resolveLocation utility
vi.mock('./location', () => ({
  resolveLocation: vi.fn().mockResolvedValue({
    packagePath: '/test/package/path',
    staRootPath: '/test/sta/root'
  })
}));

describe('STError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('creates error with basic message', async () => {
      const error = await STError.create('Test error');

      expect(error.message).toBe('Test error');
      expect(error.name).toBe('STError');
      expect(error.info.errorType).toBe('STError');
      expect(error.info.message).toBe('Test error');
      expect(resolveLocation).toHaveBeenCalled();
    });

    it('includes location information', async () => {
      const error = await STError.create('Test error');

      expect(error.info.location).toEqual({
        packagePath: '/test/package/path',
        staRootPath: '/test/sta/root'
      });
      expect(resolveLocation).toHaveBeenCalled();
    });

    it('handles Error as extInfo', async () => {
      const cause = new Error('Original error');
      const error = await STError.create('Wrapped error', cause);

      expect(error.cause).toBe(cause);
      expect(error.info.extInfo).toEqual({
        name: 'Error',
        message: 'Original error',
        stack: cause.stack
      });
      expect(resolveLocation).toHaveBeenCalled();
    });
  });

  describe('createSync', () => {
    it('creates error with basic message', () => {
      const error = STError.createSync('Test error');

      expect(error.message).toBe('Test error');
      expect(error.name).toBe('STError');
      expect(error.info.errorType).toBe('STError');
      expect(error.info.message).toBe('Test error');
    });

    it('uses current working directory for location', () => {
      const error = STError.createSync('Test error');

      expect(error.info.location).toEqual({
        packagePath: process.cwd(),
        staRootPath: undefined
      });
    });

    it('handles Error as extInfo', () => {
      const cause = new Error('Original error');
      const error = STError.createSync('Wrapped error', cause);

      expect(error.cause).toBe(cause);
      expect(error.info.extInfo).toEqual({
        name: 'Error',
        message: 'Original error',
        stack: cause.stack
      });
    });
  });
});
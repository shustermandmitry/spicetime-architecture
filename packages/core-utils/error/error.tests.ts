/**
 * @module core-utils/error/tests
 * @category Tests
 * @packageDocumentation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Error } from './Error';
import type { ErrorInfo, Location } from './Error.types';
import * as path from 'path';
import * as fs from 'fs';

vi.mock('fs');
vi.mock('path');

/**
 * Main test suite for Error utility
 * @group Core Tests
 */
describe('Error', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(process, 'cwd').mockReturnValue('/test/current/dir');
  });

  /**
   * Tests for core error functionality
   * @group Core Features
   */
  describe('core functionality', () => {
    /**
     * Validates basic error creation
     * @test Creates error with message
     */
    it('creates error with basic message', () => {
      const error = new Error('Test error');
      expect(error.message).toBe('Test error');
      expect(error.name).toBe('Error');
      expect(error instanceof Error).toBe(true);
    });

    /**
     * Validates error info structure
     * @test Error info completeness
     */
    it('includes error info in instance', () => {
      const error = new Error('Test error');
      const expectedInfo: ErrorInfo = {
        errorType: 'Error',
        message: 'Test error',
        location: {
          packagePath: expect.any(String),
          staRootPath: null
        },
        extInfo: null
      };
      expect(error.info).toMatchObject(expectedInfo);
    });

    /**
     * Tests extended info handling
     * @test Extended info attachment
     */
    it('handles extended info', () => {
      const extInfo = { code: 500, details: 'Additional info' };
      const error = new Error('Test error', extInfo);
      const expectedInfo: ErrorInfo = {
        errorType: 'Error',
        message: 'Test error',
        location: expect.any(Object),
        extInfo
      };
      expect(error.info).toMatchObject(expectedInfo);
    });
  });

  /**
   * Tests for custom error type creation
   * @group Custom Errors
   */
  describe('custom error creation', () => {
    /**
     * Validates custom error type factory
     * @test Custom error creation
     */
    it('creates custom error type', () => {
      const ValidationError = Error.createCustomError('ValidationError');
      const error = new ValidationError('Invalid input');
      const expectedInfo: ErrorInfo = {
        errorType: 'ValidationError',
        message: 'Invalid input',
        location: expect.any(Object),
        extInfo: null
      };
      expect(error.info).toMatchObject(expectedInfo);
    });

    /**
     * Tests extended info in custom errors
     * @test Custom error with extended info
     */
    it('maintains extended info in custom errors', () => {
      const ValidationError = Error.createCustomError('ValidationError');
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

  /**
   * Tests for location resolution functionality
   * @group Location Resolution
   */
  describe('location resolution', () => {
    beforeEach(() => {
      vi.mocked(fs.existsSync).mockImplementation((filePath: string) => {
        return filePath.includes('package.json') || filePath.includes('sta.json');
      });
    });

    /**
     * Tests package.json location resolution
     * @test Package path resolution
     */
    it('resolves package.json location', () => {
      vi.mocked(fs.existsSync).mockImplementation(path => path.includes('package.json'));
      const error = new Error('Test error');
      const expectedLocation: Location = {
        packagePath: expect.any(String),
        staRootPath: null
      };
      expect(error.info.location).toMatchObject(expectedLocation);
    });

    /**
     * Tests CWD fallback behavior
     * @test CWD fallback
     */
    it('falls back to cwd when no package.json found', () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);
      const error = new Error('Test error');
      const expectedLocation: Location = {
        packagePath: process.cwd(),
        staRootPath: null
      };
      expect(error.info.location).toMatchObject(expectedLocation);
    });

    /**
     * Tests STA root path resolution
     * @test STA root resolution
     */
    it('resolves STA root path when present', () => {
      vi.mocked(fs.existsSync).mockImplementation(path => 
        path.includes('package.json') || path.includes('sta.json')
      );
      const error = new Error('Test error');
      const expectedLocation: Location = {
        packagePath: expect.any(String),
        staRootPath: expect.any(String)
      };
      expect(error.info.location).toMatchObject(expectedLocation);
    });
  });

  /**
   * Tests for extended functionality beyond core spec
   * @group Extended Features
   */
  describe('extended error features', () => {
    /**
     * Tests for error chaining functionality
     * @group Error Chaining
     */
    describe('error chaining', () => {
      /**
       * Tests external error chaining
       * @test Error chain creation
       */
      it('chains external error information', () => {
        const originalError = new Error('Original error');
        const error = new Error('Operation failed', originalError);
        const expectedInfo: ErrorInfo = {
          errorType: 'Error',
          message: 'Operation failed',
          location: expect.any(Object),
          extInfo: originalError
        };
        expect(error.info).toMatchObject(expectedInfo);
      });

      /**
       * Tests nested error handling
       * @test Nested error handling
       */
      it('handles nested Errors', () => {
        const innerError = new Error('Inner error');
        const outerError = new Error('Outer error', innerError);
        expect(outerError.info.extInfo).toBe(innerError);
        expect((outerError.info.extInfo as Error).info.errorType).toBe('Error');
      });
    });

    /**
     * Tests for error info safety features
     * @group Data Safety
     */
    describe('error info safety', () => {
      /**
       * Tests circular reference handling
       * @test Circular reference safety
       */
      it('handles circular references gracefully', () => {
        const circularObj: any = { a: 1 };
        circularObj.self = circularObj;
        const error = new Error('Test error', circularObj);
        expect(() => JSON.stringify(error.info)).not.toThrow();
      });

      /**
       * Tests non-serializable data handling
       * @test Non-serializable data safety
       */
      it('handles non-serializable data', () => {
        const nonSerializable = {
          fn: () => {},
          symbol: Symbol('test')
        };
        const error = new Error('Test error', nonSerializable);
        expect(() => JSON.stringify(error.info)).not.toThrow();
      });
    });
  });
});

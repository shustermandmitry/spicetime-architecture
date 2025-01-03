// Adds custom jest matchers from Testing Library
import '@testing-library/jest-dom';

// If you used Jest and relied on the `jest` object, here’s how to map it:
import { vi } from 'vitest';

// Use `global` to define mock APIs Jest would provide
globalThis.jest = vi;

// Example: Mocking global fetch for all React components
globalThis.fetch = (...args) => {
  console.error('Global fetch was mocked. Ensure you mock fetch calls in your tests.');
  return Promise.reject(new Error('Global fetch is not implemented.'));
};
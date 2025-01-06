// Adds custom Jest matchers from Testing Library
import '@testing-library/jest-dom'

// If you used Jest and relied on the `jest` object, here’s how to map it:
import { vi } from 'vitest'

// Use `global` to define mock APIs Jest would provide
globalThis.jest = vi;

// Example: Mocking global fetch for all React components
globalThis.fetch = vi.fn(async (...args) => {
  console.error(`Mocked fetch was called with args: ${args}`)
  throw new Error('Global fetch is not implemented.')
})
# Testing the Code

We use **Vitest** for unit and integration testing, providing a fast and reliable testing workflow. This document outlines how to run tests, write unit/integration tests, mock behaviors, and configure the test environment efficiently.

---

## Running Tests

### **Basic Commands**

- **Run all tests:**
  ```bash
  pnpm test
  ```

- **Run tests only on changed files:**
  ```bash
  pnpm test:changed
  ```

---

## Writing Tests

### **Unit Tests**

Unit tests focus on testing individual functions or components in isolation, without relying on external dependencies or APIs.

#### Example of a Unit Test for a Utility Function:
```typescript
import { addNumbers } from '@/utils/math'

describe('addNumbers utility', () => {
  it('correctly adds two numbers', () => {
    const result = addNumbers(2, 3)
    expect(result).toBe(5)
  })
})
```

#### Example of a Unit Test for a React Component:
```tsx
import { render, screen } from '@testing-library/react'
import Button from '@/components/Button'

describe('Button Component', () => {
  it('renders with the correct label', () => {
    render(<Button label="Click Me" />)
    expect(screen.getByRole('button')).toHaveTextContent('Click Me')
  })
})
```

### **Integration Tests**

Integration tests validate the interaction between multiple components, services, or modules to ensure they work together as expected.

#### Example of an Integration Test:
```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '@/App'

describe('App Integration', () => {
  it('renders the home page and navigates to about page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    // Check if Home Page is correctly rendered
    expect(screen.getByText('Welcome to Home Page')).toBeInTheDocument()

    // Navigate to About Page
    fireEvent.click(screen.getByText('About'))
    expect(screen.getByText('Welcome to About Page')).toBeInTheDocument()
  })
})
```

---

## Mocking with `vi` Globals

To test components or modules with external dependencies, **mocking** is essential. Vitest provides the `vi` global object to create manual or auto-mocks.

### **Mocking APIs with `vi.stubGlobal`**
Mock global objects for APIs like `localStorage` or `fetch`.

```typescript
// Mock localStorage
vi.stubGlobal('localStorage', {
  getItem: vi.fn().mockReturnValue('mockedData'),
  setItem: vi.fn()
})

describe('LocalStorage Mock', () => {
  it('reads mocked data', () => {
    expect(localStorage.getItem('key')).toBe('mockedData')
  })
})
```

### **Mocking Modules with `vi.mock`**
Replace the behavior of a module or library to isolate dependencies.

Example: Mocking `axios` in an API call:
```typescript
import axios from 'axios'
import { fetchData } from '@/services/api'

vi.mock('axios')

describe('fetchData API', () => {
  it('returns data from the mocked API', async () => {
    // Set up mock
    vi.spyOn(axios, 'get').mockResolvedValueOnce({
      data: { message: 'Hello, World!' }
    })

    const data = await fetchData()
    expect(data).toEqual({ message: 'Hello, World!' })
  })
})
```

### **Mocking Timers & Intervals with `vi.useFakeTimers`**
Useful for testing code with `setTimeout`, `setInterval`, or other time-specific logic.

```typescript
vi.useFakeTimers()

it('executes timeout callback', () => {
  const mockFn = vi.fn()

  setTimeout(mockFn, 1000)
  vi.advanceTimersByTime(1000) // Fast-forward time
  expect(mockFn).toHaveBeenCalled()
})

vi.useRealTimers()
```

---

## Avoiding Common Pitfalls

1. **Misusing Mock Clearings**:
   Always reset or restore mocks to avoid cross-test interference:
   ```typescript
   afterEach(() => {
     vi.clearAllMocks() // Clears all mock calls and instances
     vi.restoreAllMocks() // Restores original implementations
   })
   ```

2. **Mocked Behavior Collisions**:
   Be cautious with global mocks (`stubGlobal`) as multiple tests using the same mock might clash.

3. **Incorrect Environment Expectations**:
   Vitest runs in a simulated **JS DOM environment**, so it might not perfectly replicate a real browser.

4. **Ignoring TypeScript Errors in Tests**:
   Ensure your test files are also checked for type correctness to maintain consistency:
   - Include test files in your `tsconfig.json`.

---

## Testing Configuration

The behavior of the testing environment is controlled by the configuration file `root/tools/vite-config/base.ts`. Below is an overview of key configurations:

### `test.environment`
Defines the test environment. We use **`jsdom`** to simulate a browser-like behavior during testing:
```typescript
environment: 'jsdom'
```

### `test.setupFiles`
Specifies the **setup file** to include shared test logic, global mocks, or polyfills. Defined in `vitest.setup.js`:
```typescript
setupFiles: './vitest.setup.js'
```

#### Example `vitest.setup.js`:
```javascript
import { vi } from 'vitest'

// Mock global objects here (e.g., localStorage, fetch)
vi.stubGlobal('localStorage', {
  getItem: () => null,
  setItem: () => {}
})

// Setup polyfills, spies, or utilities if necessary
```

### `test.coverage`
Controls code coverage reports to ensure comprehensive testing:
```typescript
coverage: {
  provider: 'v8', // V8-based coverage engine
  reporter: ['text', 'json', 'html'] // Output formats
}
```

### Additional Options in `base.ts`
Below are additional test-specific configurations:
- **`globals: true`**: Allows defining global methods (e.g., `it`, `describe`) without imports.
- **`css: true`**: Enables testing components with styles.

---

## Summary

### Key Steps for Testing:
1. Write unit tests for isolated functions or components.
2. Write integration tests to validate interactions between modules.
3. Use `vi` globals (`stubGlobal`, `mock`, `useFakeTimers`) for mocking dependencies.
4. Always reset mocks after tests (`vi.clearAllMocks`, `vi.restoreAllMocks`).
5. Refer to the configuration in `root/tools/vite-config/base.ts` to modify test behavior.

### For Further Exploration:
- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Docs](https://testing-library.com/docs/)

---

This guide should help standardize your testing practices and avoid common issues. Let us know if you face any challenges or have suggestions to improve these processes!
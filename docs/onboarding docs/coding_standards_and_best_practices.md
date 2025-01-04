# Code Standards & Best Practices

Adopting consistent and clear coding standards leads to better maintainability, readability, and collaboration across the team. This document outlines the standards, tools, and best practices to follow in this project.

---

## **1. Coding Style Guidelines**

### **1.1 Consistent Formatting**
- Follow the configured **ESLint** and **Prettier** rules to maintain a clean and consistent codebase.
- Always run linting and formatting tools before committing code.

#### Commands:
```bash
# Check and fix linting issues
pnpm lint:fix

# Format the codebase
pnpm format
```

- Automated formatting is enforced on committed code using Husky and lint-staged, so ensure pre-commit hooks are active.

### **1.2 Naming Conventions**
- **Variables:** Use clear, descriptive, and camelCase variable names.
  - Bad: `let x = 10;`
  - Good: `let retryAttempts = 10;`
- **Functions:** Use verbs/action words to describe their behavior.
  - Bad: `function data() {}`
  - Good: `function fetchData() {}`
- **Constants:** Use `UPPERCASE_SNAKE_CASE` for constant values.
  - Example: `const API_ENDPOINT = "https://api.example.com";`
- **Files:** Use kebab-case for filenames. For example:
  - `user-profile.ts`
  - `cart-utils.ts`

### **1.3 Code Organization**
- Group related constants, helper functions, and types in appropriately named files.
- Limit large files by splitting code logically into smaller modules.
- Prioritize using TypeScript interfaces/types for robust type safety.

---

## **2. TypeScript Best Practices**

### **2.1 Enable Strict Mode**
Ensure `strict` mode is enabled in `tsconfig.json`. This enables:
- **No implicit `any`** types.
- **Type-safety enforcement** for all variables and function arguments.
  
Example:
```ts
// Bad
function multiply(a, b) {
  return a * b;
}

// Good
function multiply(a: number, b: number): number {
  return a * b;
}
```

### **2.2 Use Interfaces and Types**
- Use `interface` for defining object shapes and `type` for unions and other advanced types.
  
Example:
```ts
interface User {
  id: number;
  name: string;
}

type Response = User | null;
```

---

## **3. Documentation Standards**

### **3.1 Commenting**
- Use **JSDoc** comments for all exported functions, classes, and complex logic.
- Describe:
  - The purpose of the function/class.
  - Input parameters (with types and purpose).
  - Expected return value.

#### Example:
```ts
/**
 * Fetches user data from the API.
 *
 * @param {number} userId - The unique ID of the user to fetch.
 * @return {Promise<User>} A promise resolving with the user data.
 */
async function fetchUser(userId: number): Promise<User> {
  const response = await axios.get(`/api/users/${userId}`);
  return response.data;
}
```

### **3.2 Inline Comments**
Use inline comments sparingly to clarify complex logic:
```ts
// This logic prevents infinite loops when maxRetries is reached
if (retryAttempts >= maxRetries) {
  throw new Error("Max retries reached");
}
```

---

## **4. Testing Guidelines**

### **4.1 Write Tests for All Code**
Every feature or bug fix must include tests. Aim for:
- **Unit tests** for all business logic.
- **Integration tests** for service-to-service logic.
- **End-to-end tests** for critical user flows.

### **4.2 Testing Best Practices**
- Use **Testing Library** for React components.
- Use **MSW** (Mock Service Worker) for mocking API communication.
- Follow the **AAA pattern** (Arrange-Act-Assert) in tests for readability.

#### Example Test (React Component):
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Counter } from "./Counter";

test("increments counter on button click", () => {
  // Arrange
  render(<Counter />);

  // Act
  userEvent.click(screen.getByRole("button", { name: /increment/i }));

  // Assert
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

### **4.3 Run Tests Locally**
Use the following commands before pushing code:
```bash
# Run unit/integration tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Check test coverage
pnpm test:coverage
```

---

## **5. Git Best Practices**

### **5.1 Commit Messages**
Use meaningful commit messages that convey the purpose of the change:
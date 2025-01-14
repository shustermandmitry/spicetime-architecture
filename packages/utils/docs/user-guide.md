# @spicetime/utils Documentation

**Version:** `1.0.0`  
**Purpose:** A general-purpose utilities framework for JavaScript/TypeScript.

---

## Installation

Install `@spicetime/utils`:

```bash
pnpm add @spicetime/utils
```

---

## Core Features

1. **Composable Utilities:** Dynamically add or remove utilities.
2. **Logger Integration:** Reusable logging system (like `@spicetime/tsTest`).
3. **Typed Utilities:** Strongly typed API for easily extendable utilities.

---

## Usage

### Example Project Structure

```plaintext
my-project/
├── src/
│   ├── utils.config.ts    # Utility composition configuration
│   ├── utilities/         # Custom utility modules
│   ├── app.ts             # Consumer application
├── package.json
```

---

### Step 1: Define Utilities

#### Example String Utility

```typescript
// src/utilities/stringManipulations.ts
export const stringManipulations = {
  capitalize: (str: string) => str.charAt(0).toUpperCase() + str.slice(1),
};
```

#### Example Object Utility

```typescript
// src/utilities/objectHelpers.ts
export const objectHelpers = {
  deepMerge: (target: any, source: any) => {
    return {
      ...target,
      ...source
    };
  }
};
```

---

### Step 2: Compose Utilities

Register and compose utilities in `utils.config.ts`.

```typescript
import { utils } from '@spicetime/utils';
import { stringManipulations } from './utilities/stringManipulations';
import { objectHelpers } from './utilities/objectHelpers';

// Add utilities
utils.addUtility('capitalize', stringManipulations.capitalize);
utils.addUtility('deepMerge', objectHelpers.deepMerge);

export default utils;
```

---

### Step 3: Use Utilities Across Your App

Use the helpers in the codebase:

```typescript
import utils from './utils.config';

// Usage examples
const title = utils.capitalize('hello world');
console.log(title); // "Hello world"

const merged = utils.deepMerge({ a: 1 }, { b: 2 });
console.log(merged); // { a: 1, b: 2 }
```

---

### Logger Usage

Capture logs:

```typescript
import { logger } from '@spicetime/utils';

// Log errors and warnings
logger.log('A warning occurred.', 'warn');
logger.log('An error occurred.', 'error');

// Retrieve all logs
console.log(logger.getLogs());
```

---

## API Reference

### `utils.addUtility(key: string, utility: Function): void`

- **Description:** Adds a utility to the `utils` object.
- **Params:**
    - `key`: Unique key for the utility.
    - `utility`: The utility function.
- **Example:**

```typescript
utils.addUtility('truncate', (str: string, len: number) =>
  str.length > len ? str.slice(0, len) + '...' : str
);
```

---

### `utils.removeUtility(key: string): void`

- **Description:** Removes a utility by key.
- **Params:**
    - `key`: Unique key of the utility to remove.
- **Example:**

```typescript
utils.removeUtility('capitalize');
```

---

### `utils.getUtilities(): Readonly<Record<string, any>>`

- **Description:** Retrieves all registered utilities.
- **Example:**

```typescript
const registeredUtils = utils.getUtilities();
console.log(registeredUtils);
```

---

## Future Enhancements

1. Integrate optional directory auto-loading for utilities.
2. Potential CLI for quick-use logs or utilities testing.

Achieve scalable and reusable application utilities with ease!
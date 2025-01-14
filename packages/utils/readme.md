# @spicetime/utils

A versatile and composable utility framework designed for JavaScript/TypeScript projects.

## Features

- Dynamically add and extend utilities for application workflows.
- Fully typed API for type-safe utility composition.
- Built-in reusable logging system for errors and warnings.

## Installation

Install `@spicetime/utils` in your project:

```bash
pnpm add @spicetime/utils
```

## Basic Usage

Define and register utilities in a configuration file (`utils.config.ts`), and then access them anywhere in your
project.

```typescript
import { utils } from '@spicetime/utils';

// Register utilities
utils.addUtility('capitalize', (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1)
);
utils.addUtility('deepMerge', (obj1: any, obj2: any) => ({
  ...obj1,
  ...obj2
}));

export default utils;
```

Use registered utilities in your app:

```typescript
import utils from './utils.config';

const title = utils.capitalize('hello world');
console.log(title); // "Hello world"

const mergedObject = utils.deepMerge({ a: 1 }, { b: 2 });
console.log(mergedObject); // { a: 1, b: 2 }
```

## Further Documentation

For full examples, configuration guides, and API references,
visit [link docs/user-guide.md](https://yourdocswebsite.com/utils).
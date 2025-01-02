# SpiceTime React App

React frontend for SpiceTime development environment.

## Features

- PatchDispatcher for code mutations
- GraphQL integration
- Real-time collaboration
- Self-modifying capabilities

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run tests
pnpm test

# Run Storybook
pnpm storybook

# Generate documentation
pnpm docs:generate
```

## Architecture

- Next.js 14 React app
- GraphQL with Apollo Client
- Vitest for testing
- Storybook for component development

## Components

### PatchDispatcher

File system mutation handler. See [PatchDispatcher docs](src/components/PatchDispatcher/docs/DESIGN.md).

## Documentation

- API: `docs/api`
- GraphQL Schema: `docs/graphql`
- Components: `docs/storybook`
- TypeScript: `docs/typedoc`
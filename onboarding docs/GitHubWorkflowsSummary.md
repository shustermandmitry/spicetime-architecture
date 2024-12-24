# GitHub Workflows

GitHub Actions are used to automate tasks like testing and documentation deployment. Here’s a summary of all workflows:

## Documentation Workflow
- **Trigger**: Push to `main` branch for changes in `src/`, `docs/`, or `schema.graphql`.
- **Purpose**: Automatically generates, validates, and deploys docs.
- **Steps**:
  - Check out code.
  - Set up Node.js.
  - Install dependencies using `npm ci`.
  - Generate, validate, and deploy documentation.

## Test All Workflow
- **Trigger**: On release creation or manual dispatch.
- **Purpose**: Run all tests across the application.
- **Steps**:
  - Set up Node.js and `pnpm`.
  - Cache dependencies.
  - Run `pnpm run test:all`.

## Test Changed Workflow
- **Trigger**: On push to `main`.
- **Purpose**: Test only the changed parts of the codebase.
- **Steps**:
  - Set up Node.js and `pnpm`.
  - Cache dependencies.
  - Run `pnpm run test:changed`.

## Test Workflow
- **Trigger**: On pushes and pull requests to `main`.
- **Purpose**: Run tests for the whole codebase.
- **Steps**:
  - Set up Node.js and `pnpm`.
  - Cache dependencies.
  - Run `pnpm run test`.
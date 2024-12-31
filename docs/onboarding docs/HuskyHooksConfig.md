# Pre-Commit Checks: Husky Hooks

Husky is used to enforce pre-commit checks and maintain code quality. Below are the hooks configured for this project:

- **Pre-commit Hook**: Runs linting and tests before allowing a commit:
  ```bash
  pnpm lint && pnpm test
  ```

- **Commit-msg Hook**: Ensures commit messages follow the given format.

These hooks will run automatically when you attempt to commit code.
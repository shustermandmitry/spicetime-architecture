# Generating Documentation

Documentation is automatically generated and validated as part of the CI/CD pipeline. However, you can manually work with docs locally using these commands:

- Generate docs:
  ```bash
  pnpm run docs.typedoc:generate
  ```

- Validate docs:
  ```bash
  pnpm run docs.typedoc:validate
  ```

Make sure all changes are reflected properly in `/docs`.
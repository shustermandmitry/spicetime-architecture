# Docker in Development and Testing Guide

This guide provides step-by-step instructions and key insights into using **Docker** for development and testing in the project. By isolating services into containers, you can create a consistent environment across teams and CI pipelines.

---

## **Prerequisites**
Before you begin, ensure the following tools are installed on your system:
- **Docker Desktop** or **Docker CLI**: [Install Docker](https://docs.docker.com/get-docker/).
- **pnpm**: The project uses `pnpm` as the package manager. Install it globally using `corepack`:
  ```bash
  corepack enable && corepack prepare pnpm@latest --activate
  ```

---

## **File Overview**

### Dockerfiles
- **`docker/dev/Dockerfile`**  
  A Dockerfile tailored for the development environment. Includes tools like `typescript` to run the app in dev mode.
- **`docker/test/Dockerfile`**  
  A lighter Dockerfile for testing purposes, optimized for running test suites.

### Compose Files
- **`docker-compose.dev.yml`**  
  Configures services for development, including a development server (`dev`) and a debug mode (`dev-debug`).
- **`docker-compose.test.yml`**  
  Configures services for testing, including running all tests (`test`), test watch mode (`test-watch`), and test debugging (`test-debug`).

---

## **Development Setup**

### Building the Development Environment
To build the Docker image for development, run:
```bash
pnpm docker:build:all
```
This will:
- Build the `dev` service using `docker/dev/Dockerfile`.

### Starting the Development Server
Launch the development environment using:
```bash
pnpm docker:dev
```
This will:
- Mount the project directory as a volume for live code reloads.
- Map port `3000` (configurable) for accessing the app.

You can access the app using:### Debugging in Development
To attach a debugger to the development environment, run:
```bash
pnpm docker:dev-debug
```
This will:
- Expose port `9229` for debugging.
- Allow debugging the app using a tool like Chrome DevTools or VS Code.

---

## **Testing Setup**

### Running All Tests
To run the entire test suite, execute:
```bash
pnpm docker:test
```
This will:
- Build the `test` service using `docker/test/Dockerfile`.
- Run `pnpm test:all` as specified in `docker-compose.test.yml`.

### Running Tests in Watch Mode
For running tests in watch mode during development, use:
```bash
docker-compose -f docker-compose.test.yml --profile test-watch-mode up
```
This will:
- Start the `test-watch` service.
- Watch for changes and re-run tests dynamically.

### Debugging Tests
To attach a debugger while running tests, use:
```bash
docker-compose -f docker-compose.test.yml --profile debug-tests up
```
This will:
- Expose port `9229` for attaching breakpoints during tests.

---

## **Stop and Clean Up**

### Stopping All Services
To stop all services, run:
```bash
pnpm docker:down
```
This will:
- Stop and remove all containers for development and testing.

### Clearing Docker Resources
To remove unused Docker images or volumes, use:
```bash
pnpm run docker:prune
```

---

## **Environment Variables**

This project allows dynamic control of ports and environment settings through the following variables:

| Variable      | Default Value | Description                              |
|---------------|---------------|------------------------------------------|
| `DEV_PORT`    | `3000`        | Port for the development app.           |
| `NODE_ENV`    | `development` | Specifies the environment configuration.|

You can override these values in your terminal before running Docker commands:
```bash
export DEV_PORT=4000
pnpm docker:dev
```

---

## **Best Practices**

### Add `.dockerignore`
Ensure you have a `.dockerignore` file at the root of your project to avoid unnecessary files being included in the Docker build context:### Use Profiles for Flexibility
The `docker-compose` files have **profiles** to enable or disable services dynamically. For example:
- Use `dev-debug` for debugging development environments.
- Use `test-watch-mode` for watching tests during development.
- Use `run-all-tests` for CI pipelines.

---

## **Cheat Sheet**

| Command                                | Description                                              |
|----------------------------------------|----------------------------------------------------------|
| `pnpm docker:dev`                      | Starts the development server.                          |
| `pnpm docker:dev-debug`                | Starts the server with debugging enabled.               |
| `pnpm docker:test`                     | Runs all tests.                                          |
| `docker-compose up --profile test-watch-mode` | Runs tests in watch mode.                          |
| `docker-compose up --profile debug-tests`     | Debug tests with a debugger on port `9229`.      |
| `pnpm docker:down`                     | Stops all services.                                      |
| `pnpm docker:prune`                    | Removes unused Docker images, containers, or volumes.   |

---

## Notes for CI Integration
- Ensure **Docker caching** is used effectively in CI pipelines by leveraging the `pnpm-lock.yaml` integrity. For example:
  ```yaml
  cache:
    paths:
      - ~/.npm/
      - /pnpm/store/
  ```
- Use the `run-all-tests` profile for pipelines to run the entire test suite.

---

## **Conclusion**
This guide outlines how to use Docker effectively for local development and testing. It ensures uniformity across environments and simplifies onboarding for new team members. For specific workflows or improvements, always refer to the project's [Dockerfiles](./docker/) and compose configurations.

---

Let me know if there are additional tweaks or specific use cases you'd like to add!
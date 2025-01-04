# Docker in Development and Testing Guide

This guide provides step-by-step instructions and key insights into using **Docker** for development and testing in the project. By isolating services into containers, you can create a consistent and reproducible environment across teams and CI pipelines while ensuring that local setups remain clean.

---

## **Prerequisites**
Make sure you have the following installed:

- **Docker Desktop** or **Docker CLI**: [Install Docker](https://docs.docker.com/get-docker/).
- **pnpm**: This project uses `pnpm` as the package manager. Install it globally:
  ```bash
  corepack enable && corepack prepare pnpm@latest --activate
  ```

---

## **File Overview**

### Dockerfiles
- **`docker/dev/Dockerfile`**  
  - For development. Installs tools and dependencies to run the app in development mode with live reload.
- **`docker/test/Dockerfile`**  
  - Focused on testing. Ideal for running tests or continuous integration pipelines.

### Compose Files
- **`docker-compose.dev.yml`**  
  - Sets up the development environment with services optimized for live development (`dev`) and debug modes (`dev-debug`).
- **`docker-compose.test.yml`**  
  - Configures the test environment with services for running tests, debugging tests, and test watch mode.

---

## **Development Workflow**

### Building the Development Environment
To build the Docker image for the development server, run:
```bash
pnpm docker:build:all
```
This builds all defined services, including the test containers, if needed.

### Starting the Development Server
Run this command to start the development environment:
```bash
pnpm docker:dev
```
This:
- Binds your local project directory to the Docker container, allowing live reloads.
- Exposes port `3000` by default for your app.

Access the app at:
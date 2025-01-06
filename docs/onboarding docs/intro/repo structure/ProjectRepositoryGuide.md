# Project Repository

Welcome to the project repository! This guide outlines the workflows, branch strategies, and CI/CD pipelines used in this repo.

## Git Workflow

We use a feature-branching workflow to keep the codebase clean and easy to manage.

### Branches

1. **`main`**:  
   - The production branch. Always stable, releases are created from this branch.  
2. **`develop`**:  
   - Contains the latest development code. All features and fixes are integrated here.  

### Branch Naming Conventions

- **Features:**  
  `feature/{name}` → Example: `feature/add-header-component`

- **Bugs/Fixes:**  
  `fix/{name}` → Example: `fix/fix-header-click-bug`

- **Hotfixes:**  
  `hotfix/{name}` → Example: `hotfix/crash-on-login`

---

## Development Workflow

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/project.git
   cd project
   ```

2. **Start feature development:**
   ```bash
   git checkout -b feature/{name}
   ```

3. **Commit changes:**
   Follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard:
   ```bash
   git add .
   git commit -m "feat: short description of feature"
   ```

4. **Push and Open PR:**
   ```bash
   git push origin feature/{name}
   ```
   Open a Pull Request to the `develop` branch.

---

## CI/CD Pipeline

Our repository uses **GitHub Actions** for continuous integration and release management.

1. **CI Workflow:**  
   - Triggers on pushes or pull requests to `develop` or `main`.
   - Checks if the code builds and passes tests.

2. **Release Workflow:**
   - Push a tag to trigger a release.  
   Example:
     ```bash
     git tag v1.0.0
     git push origin v1.0.0
     ```

3. Ensure you have access to the project secrets (e.g., `NPM_TOKEN`) for publishing releases.

---

## Setup Guide for Developers

1. Install [Node.js](https://nodejs.org) and [pnpm](https://pnpm.io/):
   ```bash
   npm install -g pnpm
   pnpm install
   ```

2. Run tests before pushing:
   ```bash
   pnpm test
   ```

3. Follow the branching strategy and ensure your code is reviewed before merging.

### Contact
For any questions or help on contributing, reach out to the repository maintainers.
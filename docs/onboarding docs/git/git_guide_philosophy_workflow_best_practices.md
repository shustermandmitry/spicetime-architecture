# Git Guide: Philosophy, Workflows, and Best Practices

Understanding Git and how we use it is critical for seamless collaboration, clean code history, and efficient development. This guide introduces Git's philosophy, how it fits within our workflow, and provides a complete reference for commands and workflows.

---

## **1. What is Git?**

Git is a **distributed version control system (VCS)** used for managing project changes over time. It enables:
- **Collaboration**: Teams can share, review, and build on each other’s work in parallel.
- **Versioning**: Every code change is saved as a snapshot, creating a verifiable history.
- **Branching & Merging**: Developers can work independently on features or fixes in isolated branches, which can later be merged back into the main project.

> **Philosophy of Git:** Git encourages a dynamic, non-linear workflow where snapshots of code are lightweight and branching is fast and efficient.

**Why use Git?**
- It avoids overwriting changes, making collaborative development seamless.
- It acts as a safety net, allowing you to roll back changes when things go wrong.
- It enforces accountability through commit history and pull request reviews.

---

## **2. Git in This Project**

In this project:
- We use a **feature-branch workflow** to separate development of new features and fixes from the main codebase.
- A clean **main branch** (`main`) is maintained and represents the stable version of the project.
- Additional automation via Continuous Integration (CI) ensures that only tested and reviewed code is merged.
- **Pull Requests (PRs)** are required for any changes to be introduced into the `main` branch. They include review steps and automated checks.
- All work must follow **Git conventions** for naming, commits, and collaboration to ensure consistency.

---

## **3. Git Workflows**

### **3.1 Feature-Branch Workflow**
This workflow isolates feature development into individual branches before merging them into `main`.

#### Workflow Steps:
1. **Checkout the `main` branch and pull the latest changes:**
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Create a new branch for your work:**
   - Use the format: `<type>/<branch-name>`.  
     Examples:
     - `feat/login-page`
     - `fix/cart-error`
     - `test/create-order-test`
     ```bash
     git checkout -b feat/login-page
     ```

3. **Work on your changes locally.**
   - Stage and commit changes incrementally (avoid large commits):
     ```bash
     git add .
     git commit -m "feat(login): add UI for login page"
     ```

4. **Push your branch to the remote repository:**
   ```bash
   git push origin feat/login-page
   ```

5. **Open a Pull Request**:
   - Base branch: `main`.
   - Add meaningful details about your changes for reviewers (link any Jira ticket, design reference, etc.).
   - Ensure automated tests pass in the CI pipeline.

6. **Address Review Feedback**:
   - Commit updates suggested in PR reviews:
     ```bash
     git commit -m "fix(login): handle edge case for empty user input"
     ```
   - Keep commits contextual and small.

7. **Merge After Approval**:
   - Once the PR is approved and tested, merge your branch into `main`.

---

### **3.2 Hotfix Workflow**
For urgent fixes or production bugs, use a **hotfix** workflow.

#### Workflow Steps:
1. Create a new branch based on the `main` branch:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b fix/critical-bug
   ```

2. Apply the fix and commit the changes:
   ```bash
   git add .
   git commit -m "fix(payment): resolve critical bug in checkout flow"
   ```

3. Push your branch and create a Pull Request for immediate review/merge:
   ```bash
   git push origin fix/critical-bug
   ```

---

### **3.3 Release Management Workflow**
Releases are tagged and maintained using **release branches** to ensure stability.

#### Workflow:
1. Create a release branch based on the latest `main` branch:
   ```bash
   git checkout -b release/1.2.0
   ```

2. Prepare the branch:
   - Test thoroughly.
   - Update version files (e.g., `package.json`, `CHANGELOG.md`).
   - Fix any last-minute issues.

3. Merge the changes into `main` and tag the release:
   ```bash
   git checkout main
   git merge release/1.2.0
   git tag v1.2.0
   git push origin main --tags
   ```

4. Deploy from the release tag and clean up the branch after confirmation:
   ```bash
   git branch -d release/1.2.0
   ```

---

## **4. Git Commands Quick Reference**

### Branch Management:
- Check current branch:
  ```bash
  git branch
  ```
- Create a new branch:
  ```bash
  git checkout -b feat/your-branch-name
  ```
- Switch to an existing branch:
  ```bash
  git checkout branch-name
  ```
- Delete a branch:
  ```bash
  git branch -d branch-name
  ```

### Commit Management:
- Stage changes for commit:
  ```bash
  git add file-name
  ```
- Commit staged changes:
  ```bash
  git commit -m "fix(description): your summary here"
  ```
- Amend the last commit:
  ```bash
  git commit --amend
  ```

### Sync with Remote:
- Push changes to the branch:
  ```bash
  git push origin branch-name
  ```
- Pull the latest changes:
  ```bash
  git pull origin branch-name
  ```

### Merging:
- Merge another branch into your branch:
  ```bash
  git merge branch-name
  ```
- Abort a conflict during merge:
  ```bash
  git merge --abort
  ```

---

## **5. Git Best Practices**

1. **Always Pull Before You Push**  
   Keep your branch up-to-date with the `main` branch to avoid conflicts:
   ```bash
   git pull origin main --rebase
   ```

2. **Write Meaningful Commit Messages**  
   see: (git commit ethics)<git-ethics>
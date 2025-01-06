# **CommitLint: Commit Message Linting**

## **What is CommitLint?**

CommitLint is a tool that ensures that commit messages comply with predefined standards. It plays a vital role in maintaining a clean and meaningful commit history, which is critical for collaboration, automation, and changelog generation.

---

## **Configuration: `commitlint.config.js`**

CommitLint is configured via a `commitlint.config.js` file that defines:
- **Allowed commit types** (e.g., `feat`, `fix`, `docs`).
- **Casing rules** for scopes and subjects.
- **Max line length** for commit message bodies.

### **Key Rules Defined**
- **`type-enum`**:
  Specifies the allowed `type` values, ensuring commit purposes are consistent.

- **`scope-case`**:
  Scopes (if provided) must always follow `kebab-case` for readability.

- **`subject-case`**:
  Prohibits specific subject cases (e.g., `PascalCase`, `UPPER_CASE`).

- **`body-max-line-length`**:
  Limits commit body lines to 100 characters for enhanced message readability.

---

## **CommitLint in Automation**

CommitLint is integrated into the project workflow at two stages:
1. **Locally**:
   - Runs during the git commit phase, rejecting invalid commit messages before they are created.
   
2. **In CI/CD**:
   - GitHub Actions validates commit messages in pull requests, ensuring all contributors follow established standards.

---

## **Benefits of CommitLint**
1. **Maintains Clarity**:
   - A consistent format helps contributors understand commit purposes easily.
2. **Supports Automation**:
   - Useful for semantic release and changelog generation.
3. **Prevents Noise**:
   - Rejects unstructured or unclear commit messages early.

---

## **How to Use CommitLint Locally**

To enable CommitLint for local development:
1. Install CommitLint:
   ```sh
   pnpm install @commitlint/{cli,config-conventional} husky
   ```
2. Add a Husky commit-msg hook:
   ```sh
   npx husky add .husky/commit-msg "npx commitlint --edit"
   ```

With this setup, every commit message will be validated before being created.

---

## **Examples of Valid Commit Messages**
- `feat(authentication): add login endpoint`
- `fix(ui): resolve button alignment issue`
- `docs(readme): update usage examples`

---

CommitLint enforces clear and consistent commit messages across the team, serving as a foundation for an organized development process.
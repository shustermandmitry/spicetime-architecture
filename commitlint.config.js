/**
 * @file CommitLint configuration file
 * @description Enforces rules for commit message formatting to stay consistent with
 * the Conventional Commits specification. 
 */

module.exports = {
  // Extends the preset rules from '@commitlint/config-conventional'.
  extends: ['@commitlint/config-conventional'],

  // Custom rules to enhance the base configuration.
  rules: {
    /**
     * @rule `type-enum`
     * Restricts commit "type" (e.g., `feat`, `fix`) to specific allowed values.
     * Each type describes the purpose or impact of a commit.
     */
    'type-enum': [2, 'always', [
      'feat',     // New feature added
      'fix',      // Bug fix
      'docs',     // Documentation updates
      'style',    // Code style changes (e.g., whitespace, semicolons)
      'refactor', // Non-functional code changes
      'perf',     // Performance improvements
      'test',     // Adding or fixing tests
      'chore',    // Maintenance tasks
      'revert',   // Reverts previous changes
      'ci',       // CI/CD configuration changes
    ]],

    /**
     * @rule `scope-case`
     * Enforces that the scope (if provided) should always be in kebab-case.
     */
    'scope-case': [2, 'always', 'kebab-case'],

    /**
     * @rule `subject-case`
     * Prevents the subject (first line of commit message) from using:
     * - Start-case
     * - PascalCase
     * - UPPER_CASE
     */
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],

    /**
     * @rule `body-max-line-length`
     * Limits each line in the commit body to 100 characters for better readability.
     */
    'body-max-line-length': [2, 'always', 100]
  }
}
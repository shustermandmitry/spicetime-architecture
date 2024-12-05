module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', [
      'feat',     // new feature
      'fix',      // bug fix
      'docs',     // documentation
      'style',    // formatting, missing semicolons, etc
      'refactor', // code change that neither fixes a bug nor adds a feature
      'perf',     // performance improvements
      'test',     // adding missing tests
      'chore',    // maintain
      'revert',   // revert changes
      'ci',       // ci/cd changes
    ]],
    'scope-case': [2, 'always', 'kebab-case'],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
    'body-max-line-length': [2, 'always', 100]
  }
}

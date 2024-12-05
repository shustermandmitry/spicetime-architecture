module.exports = {
  plantumlVersion: "1.2022.7",
  outDir: "docs/.generated/architecture",
  input: [
    "docs/architecture/diagrams",
    "docs/architecture/decisions"
  ],
  watch: {
    onSuccess: "npm run docs:build"
  }
}
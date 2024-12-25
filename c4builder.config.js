module.exports = {
  plantumlVersion: "1.2022.7",
  outDir: "docs.typedoc/.generated/architecture",
  input: [
    "docs.typedoc/architecture/diagrams",
    "docs.typedoc/architecture/decisions"
  ],
  watch: {
    onSuccess: "npm run docs.typedoc:build"
  }
}
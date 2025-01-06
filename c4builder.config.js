/**
 * @file Configuration file for C4Builder, a tool for generating C4 Model diagrams.
 * The configuration specifies input directories for diagrams and decisions,
 * output destinations, and automation commands that run on successful diagram generation.
 */
 
module.exports = {
  // PlantUML Version: Specifies the version of PlantUML to use for diagram generation.
  plantumlVersion: "1.2022.7",

  // Output Directory: Determines where the generated diagram files will be saved.
  outDir: "docs.typedoc/.generated/architecture",

  // Input Directories: Specifies directories containing source diagrams and decisions files.
  input: [
    "docs.typedoc/architecture/diagrams", // Directory for architecture diagrams
    "docs.typedoc/architecture/decisions" // Directory for architecture ADR (decision records)
  ],

  // Automation: Rebuild documentation automatically when diagrams are successfully generated.
  watch: {
    // Runs the provided command after successful completion of tasks.
    onSuccess: "npm run docs.typedoc:build"
  }
};
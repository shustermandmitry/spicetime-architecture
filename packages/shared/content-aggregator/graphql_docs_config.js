module.exports = {
  schema: "./src/shared/graphql/schema.gql", // Path to your GraphQL schema
  outputDir: "./docs/graphql-docs", // Where the docs will be generated
  includeDeprecated: false, // Exclude deprecated fields/types
  fileExtension: "md", // Output in Markdown format
  prettify: true, // Make it nicely formatted
};
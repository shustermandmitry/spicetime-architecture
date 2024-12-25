const { buildSchema, graphqlSync, getIntrospectionQuery, printSchema } = require('graphql');
const { readFileSync, writeFileSync } = require('fs');
const path = require('path');

// Path to your SDL file
const schemaPath = path.resolve(__dirname, './src/schema.gql');
const outputPath = path.resolve(__dirname, './schema.json');

// Read SDL file
let schemaSDL;
try {
  schemaSDL = readFileSync(schemaPath, 'utf8');
  console.log('Schema file successfully read.');
} catch (error) {
  console.error('Error reading schema file:', error.message);
  process.exit(1);
}

// Build GraphQL Schema
let schema;
try {
  schema = buildSchema(schemaSDL);
  console.log('Schema built successfully.');
} catch (error) {
  console.error('Error building schema:', error.message);
  process.exit(1);
}

// Generate Introspection JSON
const result = graphqlSync(schema, getIntrospectionQuery());

if (result.errors) {
  console.error('Error generating introspection:', result.errors);
  process.exit(1);
}

// Write JSON to file
writeFileSync(outputPath, JSON.stringify(result.data, null, 2));
console.log('Schema introspection JSON generated at:', outputPath);

// Optional: Generate SDL file for confirmation
writeFileSync(path.resolve(__dirname, './schema.graphql'), printSchema(schema));
console.log('Readable schema SDL file generated at:', path.resolve(__dirname, './schema.graphql'));
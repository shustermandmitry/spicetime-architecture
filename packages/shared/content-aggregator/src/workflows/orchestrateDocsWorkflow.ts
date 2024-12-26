import { generate } from "@graphql-codegen/cli";
import fs from "fs";
import { PathConfig } from "../utils/pathUtils";

export async function orchestrateDocsWorkflow(paths: PathConfig): Promise<void> {
  console.log("\nStarting GraphQL documentation workflow...\n");

  // Ensure schema file exists
  if (!fs.existsSync(paths.schemaPath)) {
    throw new Error(`Schema file not found at: ${paths.schemaPath}`);
  }

  // Generate JSON schema from GraphQL schema
  console.log("Step 1: Generating JSON schema...");
  await generate(
    {
      schema: paths.schemaPath,
      generates: {
        [paths.outputJsonPath]: {
          plugins: ["introspection"],
        },
      },
    },
    true
  );
  console.log(`✔ JSON schema generated: ${paths.outputJsonPath}`);

  // Generate TypeScript resolvers
  console.log("\nStep 2: Generating TypeScript resolvers...");
  await generate(
    {
      schema: paths.schemaPath,
      generates: {
        [paths.resolversPath]: {
          plugins: ["typescript", "typescript-resolvers"],
        },
      },
    },
    true
  );
  console.log(`✔ Resolvers generated: ${paths.resolversPath}`);
}

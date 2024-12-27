
/**
 * Configuration for paths used in the workflow
 */
export type PathConfig = {
  schemaPath: string;
  outputPath: string;
  [key: string]: string;
};
  
import path from "path";

export interface PathConfig {
  schemaPath: string;
  outputJsonPath: string;
  resolversPath: string;
}

export function setupPaths(): PathConfig {
  const schemaPath = path.resolve("./packages/shared/content-aggregator/src/shared/graphql/schema.gql");
  const outputJsonPath = path.resolve("./packages/shared/content-aggregator/src/shared/graphql/schema.json");
  const resolversPath = path.resolve("./packages/shared/content-aggregator/src/shared/graphql/resolvers.ts");

  return { schemaPath, outputJsonPath, resolversPath };
}

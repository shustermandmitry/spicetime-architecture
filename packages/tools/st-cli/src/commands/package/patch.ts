/**
 * Patch system for modifying package files
 * @module commands/package/patch
 * @category Commands
 *
 * @description
 * Handles application of patch files that can modify multiple files across the monorepo.
 * Provides smart path resolution and safe application of changes.
 *
 * Patch File Format:
 * - Files are separated by lines starting with '---'
 * - Each section starts with target path
 * - Content follows immediately after path line
 *
 * @example Patch File
 * ```
 * --- packages/services/auth/config.ts
 * export const config = {
 *   port: 3000
 * };
 *
 * --- packages/services/auth/types.ts
 * export interface AuthConfig {
 *   port: number;
 * }
 * ```
 *
 * Path Resolution:
 * 1. Absolute paths are used as-is
 * 2. Relative paths are resolved against:
 *    - Previous resolution in same directory
 *    - Monorepo root
 *    - Matching files in repo
 * 3. Numbered selection for multiple matches
 * 4. Custom path input supported
 *
 * Safety Features:
 * - Plans all changes before execution
 * - Shows comprehensive preview
 * - Requires explicit confirmation
 * - Supports file backups
 * - Rolls back on errors
 *
 * Backup System:
 * - Sequential numbering (file.1.ts, file.2.ts)
 * - Preserves original extensions
 * - Only backs up files, not directories
 *
 * @example Usage in Code
 * ```typescript
 * // Apply patches with preview
 * await applyPatch('./my-changes.txt');
 * ```
 *//**
 * Package creation functionality
 Patch File Parser and Handler

 // packages/tools/st-cli/src/commands/package/patch.ts
 /**
 * Patch file parsing and application functionality
 * @module commands/package/patch
 */
/**
 * Patch system for modifying package files
 * @module commands/package/patch
 * @category Commands
 */

/**
 * Package creation implementation
 * @module commands/package/create
 * @category Commands
 */

import path from 'path';
import fs from 'fs-extra';
import { PathStructure, PackageType, resolvePackagePath } from '../../utils/paths';

export interface CreatePackageOptions {
  name: string;
  type: PackageType;
  gql?: boolean;
  structure?: string;
  patch?: string;
}

export async function createPackage(
  structure: PathStructure,
  options: CreatePackageOptions
): Promise<void> {
  // Get full package path based on type
  const packageDir = resolvePackagePath(structure, options.name, options.type);

  // Ensure directory doesn't exist
  if (await fs.pathExists(packageDir)) {
    throw new Error(`Package directory already exists: ${packageDir}`);
  }

  // Create package directory structure
  await fs.ensureDir(packageDir);

  // Generate base configuration
  await generateBaseConfig(packageDir, options);

  // Add GraphQL configuration if requested
  if (options.gql) {
    await generateGqlConfig(packageDir, options);
  }

  // Generate additional structure if provided
  if (options.structure) {
    const { parseStructureFile, generateStructure } = await import('./structure/parser');
    const structureTree = await parseStructureFile(options.structure);
    await generateStructure(packageDir, structureTree);
  }

  // Apply patch if provided
  if (options.patch) {
    const { applyPatch } = await import('./patch');
    await applyPatch(options.patch);
  }

  console.log(`Created package: ${options.name} in ${packageDir}`);
}

async function generateBaseConfig(packageDir: string, options: CreatePackageOptions): Promise<void> {
  const packageJson = {
    name: options.name,
    version: "1.0.0",
    main: "src/index.ts",
    scripts: {
      test: "pnpm exec vitest",
      build: "pnpm tsc",
      "docs:generate": "pnpm typedoc",
      clean: "rimraf dist",
    },
    dependencies: {
      "zod": "^3.22.5"
    },
    devDependencies: {
      "@types/node": "^22.10.2",
      "vitest": "^2.1.8",
      "typescript": "^5.7.2",
      "typedoc": "^0.25.7",
      "typedoc-plugin-markdown": "^3.17.1"
    }
  };

  const tsConfig = {
    compilerOptions: {
      module: "commonjs",
      target: "es2019",
      outDir: "dist",
      rootDir: "./",
      strict: true,
      esModuleInterop: true,
    },
    include: ["src/**/*.ts", "tests/**/*.ts"]
  };

  const typedocConfig = {
    entryPoints: ["src"],
    out: "docs/typedoc",
    plugin: ["typedoc-plugin-markdown"],
    categorizeByGroup: true,
    excludePrivate: true,
    excludeExternals: true,
    readme: "README.md",
  };

  await Promise.all([
    fs.writeJSON(path.join(packageDir, 'package.json'), packageJson, { spaces: 2 }),
    fs.writeJSON(path.join(packageDir, 'tsconfig.json'), tsConfig, { spaces: 2 }),
    fs.writeJSON(path.join(packageDir, 'typedoc.json'), typedocConfig, { spaces: 2 }),
    generateReadme(packageDir, options),
    setupDirectoryStructure(packageDir)
  ]);
}

async function generateGqlConfig(packageDir: string, options: CreatePackageOptions): Promise<void> {
  const gqlDependencies = {
    "@apollo/server": "4.11.2",
    "@graphql-tools/graphql-file-loader": "8.0.8",
    "@graphql-tools/load": "8.0.9"
  };

  const gqlDevDependencies = {
    "@graphql-codegen/cli": "^5.0.3",
    "@graphql-codegen/typescript": "^4.1.2",
    "@graphql-codegen/typescript-resolvers": "^4.4.1",
    "@graphql-tools/utils": "^10.7.0",
    "get-graphql-schema": "^2.1.2"
  };

  const packageJsonPath = path.join(packageDir, 'package.json');
  const packageJson = await fs.readJSON(packageJsonPath);

  packageJson.dependencies = { ...packageJson.dependencies, ...gqlDependencies };
  packageJson.devDependencies = { ...packageJson.devDependencies, ...gqlDevDependencies };
  packageJson.scripts = {
    ...packageJson.scripts,
    "generate-types": "pnpm graphql-codegen --config codegen.yml",
    "generate-docs": "pnpm exec graphql-docs-gen -s ./src/shared/graphql/schema.gql -o docs",
    "generate-all": "pnpm run generate-types && pnpm run generate-docs"
  };

  // Write updated package.json
  await fs.writeJSON(packageJsonPath, packageJson, { spaces: 2 });

  // Create GraphQL directory structure and base files
  const graphqlDir = path.join(packageDir, 'src', 'shared', 'graphql');
  await fs.ensureDir(graphqlDir);

  // Create base schema file
  const baseSchema = `type Query {
 hello: String!
}

type Mutation {
 echo(message: String!): String!
}`;

  await fs.writeFile(path.join(graphqlDir, 'schema.gql'), baseSchema);

  // Create codegen config
  const codegenConfig = {
    overwrite: true,
    schema: "./src/shared/graphql/schema.gql",
    generates: {
      "./src/shared/graphql/schema.json": {
        plugins: ["introspection"]
      },
      "./src/shared/graphql/resolvers.ts": {
        plugins: ["typescript", "typescript-resolvers"]
      }
    }
  };

  await fs.writeYAML(path.join(packageDir, 'codegen.yml'), codegenConfig);
}

async function generateReadme(packageDir: string, options: CreatePackageOptions): Promise<void> {
  const readme = `# ${options.name}

Part of the SpiceTime framework ${getPackageDescription(options)}.

## Development

\`\`\`bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build
pnpm build

# Generate documentation
pnpm docs:generate
\`\`\`

## Documentation

See the [docs](./docs) directory for detailed documentation.`;

  await fs.writeFile(path.join(packageDir, 'README.md'), readme);

  // Create docs directory with placeholder files
  const docsDir = path.join(packageDir, 'docs');
  await fs.ensureDir(docsDir);
}

async function setupDirectoryStructure(packageDir: string): Promise<void> {
  const dirs = [
    'src',
    'tests',
    'docs',
  ];

  await Promise.all(
    dirs.map(dir => fs.ensureDir(path.join(packageDir, dir)))
  );
}

function getPackageDescription(options: CreatePackageOptions): string {
  switch (options.type) {
    case 'service':
      return 'providing backend services';
    case 'client':
      return 'implementing frontend functionality';
    case 'shared':
      return 'providing shared utilities and components';
    case 'tool':
      return 'providing development tooling';
    default:
      return 'providing internal functionality';
  }
}
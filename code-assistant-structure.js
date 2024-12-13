// scripts/setup-code-assistant.js
const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'spicetime-architecture';

function createDirectories() {
    const directories = [
        // Service structure
        'packages/services/code-assistant/src/graphql',
        'packages/services/code-assistant/src/services',
        'packages/services/code-assistant/src/utils',
        'packages/services/code-assistant/src/types',
        'packages/services/code-assistant/tests',
        'packages/services/code-assistant/docs',

        // WebStorm client structure
        'packages/clients/code-assistant-webstorm/src/graphql',
        'packages/clients/code-assistant-webstorm/src/services',
        'packages/clients/code-assistant-webstorm/src/ui',
        'packages/clients/code-assistant-webstorm/src/actions',
        'packages/clients/code-assistant-webstorm/src/icons',
        'packages/clients/code-assistant-webstorm/tests',
        'packages/clients/code-assistant-webstorm/docs',

        // Shared code structure
        'packages/internal/code-assistant-core/src',
        'packages/internal/code-assistant-core/tests',
        'packages/internal/code-assistant-core/docs'
    ];

    directories.forEach(dir => {
        const fullPath = path.join(ROOT_DIR, dir);
        fs.mkdirSync(fullPath, { recursive: true });
    });
}

// Service package.json
const servicePackageJson = {
    "name": "@spicetime/code-assistant-service",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "dev": "ts-node-dev --respawn src/index.ts",
        "build": "tsc",
        "start": "node dist/index.js",
        "test": "vitest run",
        "lint": "eslint src/",
        "generate": "graphql-codegen",
        "docs": "typedoc --options typedoc.json",
        "docs:watch": "typedoc --options typedoc.json --watch"
    },
    "dependencies": {
        "@apollo/server": "^4.9.5",
        "graphql": "^16.8.1",
        "@spicetime/code-assistant-core": "workspace:*",
        "winston": "^3.11.0"
    },
    "devDependencies": {
        "@graphql-codegen/cli": "^5.0.0",
        "@graphql-codegen/typescript": "^4.0.1",
        "@types/node": "^20.9.0",
        "ts-node-dev": "^2.0.0",
        "typescript": "^5.2.2",
        "vitest": "^0.34.6",
        "typedoc": "^0.25.3",
        "typedoc-plugin-markdown": "^3.17.1",
        "typedoc-plugin-mermaid": "^1.10.0"
    }
};

// WebStorm client package.json
const clientPackageJson = {
    "name": "@spicetime/code-assistant-webstorm",
    "version": "0.1.0",
    "private": true,
    "scripts": {
        "build": "tsc",
        "package": "gradle buildPlugin",
        "test": "vitest run",
        "lint": "eslint src/",
        "docs": "typedoc --options typedoc.json",
        "docs:watch": "typedoc --options typedoc.json --watch"
    },
    "dependencies": {
        "@apollo/client": "^3.8.7",
        "@spicetime/code-assistant-core": "workspace:*",
        "graphql": "^16.8.1"
    },
    "devDependencies": {
        "@types/node": "^20.9.0",
        "typescript": "^5.2.2",
        "vitest": "^0.34.6",
        "typedoc": "^0.25.3",
        "typedoc-plugin-markdown": "^3.17.1",
        "typedoc-plugin-mermaid": "^1.10.0"
    }
};

// Shared core package.json
const corePackageJson = {
    "name": "@spicetime/code-assistant-core",
    "version": "0.1.0",
    "private": true,
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "scripts": {
        "build": "tsc",
        "test": "vitest run",
        "lint": "eslint src/",
        "docs": "typedoc --options typedoc.json",
        "docs:watch": "typedoc --options typedoc.json --watch"
    },
    "devDependencies": {
        "@types/node": "^20.9.0",
        "typescript": "^5.2.2",
        "vitest": "^0.34.6",
        "typedoc": "^0.25.3",
        "typedoc-plugin-markdown": "^3.17.1",
        "typedoc-plugin-mermaid": "^1.10.0"
    }
};

// TypeDoc configuration for service
const serviceTypedocConfig = {
    "entryPoints": ["src/index.ts"],
    "out": "docs",
    "plugin": ["typedoc-plugin-markdown", "typedoc-plugin-mermaid"],
    "theme": "default",
    "excludePrivate": true,
    "excludeProtected": true,
    "excludeExternals": true,
    "includeVersion": true,
    "categorizeByGroup": true,
    "categoryOrder": ["Services", "Models", "Utilities", "*"],
    "navigationLinks": {
        "GitHub": "https://github.com/your-org/spicetime-architecture"
    },
    "customCss": "./docs/custom.css",
    "validation": {
        "notExported": true,
        "invalidLink": true,
        "notDocumented": "error"
    }
};

// TypeDoc configuration for client
const clientTypedocConfig = {
    ...serviceTypedocConfig,
    "categoryOrder": ["Actions", "UI Components", "Services", "Utilities", "*"]
};

// TypeDoc configuration for core
const coreTypedocConfig = {
    ...serviceTypedocConfig,
    "categoryOrder": ["Models", "Utilities", "Interfaces", "*"]
};

// GraphQL schema remains the same
const schemaContent = `type Query {
  suggestCode(context: CodeContext!): CodeSuggestion!
  analyzeCode(code: String!): CodeAnalysis!
}

type Mutation {
  submitFeedback(suggestionId: ID!, feedback: FeedbackInput!): Boolean!
}

input CodeContext {
  fileContent: String!
  cursorPosition: Position!
  filePath: String!
  projectContext: ProjectContext!
}

input Position {
  line: Int!
  character: Int!
}

input ProjectContext {
  dependencies: [String!]!
  tsConfig: String
  projectType: ProjectType!
}

enum ProjectType {
  REACT
  NODE
  GRAPHQL
  FULLSTACK
}

type CodeSuggestion {
  id: ID!
  suggestion: String!
  explanation: String!
  confidence: Float!
  references: [CodeReference!]!
}

type CodeAnalysis {
  issues: [CodeIssue!]!
  suggestions: [CodeSuggestion!]!
  complexity: ComplexityAnalysis!
}

type CodeIssue {
  severity: IssueSeverity!
  message: String!
  line: Int!
  character: Int!
}

type ComplexityAnalysis {
  cyclomaticComplexity: Int!
  maintainabilityIndex: Float!
  suggestions: [String!]!
}

type CodeReference {
  title: String!
  url: String!
  relevance: Float!
}

input FeedbackInput {
  rating: Int!
  comment: String
  accepted: Boolean!
}

enum IssueSeverity {
  ERROR
  WARNING
  INFO
}`;

// CSS for TypeDoc customization
const typeDocCss = `
.tsd-typography {
  line-height: 1.6;
}

.tsd-page-title {
  padding: 2rem 0;
  background: #f8f9fa;
}

.tsd-navigation.primary li {
  padding: 0.2rem 0;
}

code {
  background-color: #f6f8fa;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}
`;

function writeFiles() {
    // Write package.json files
    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/services/code-assistant/package.json'),
        JSON.stringify(servicePackageJson, null, 2)
    );

    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/clients/code-assistant-webstorm/package.json'),
        JSON.stringify(clientPackageJson, null, 2)
    );

    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/internal/code-assistant-core/package.json'),
        JSON.stringify(corePackageJson, null, 2)
    );

    // Write TypeDoc configurations
    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/services/code-assistant/typedoc.json'),
        JSON.stringify(serviceTypedocConfig, null, 2)
    );

    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/clients/code-assistant-webstorm/typedoc.json'),
        JSON.stringify(clientTypedocConfig, null, 2)
    );

    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/internal/code-assistant-core/typedoc.json'),
        JSON.stringify(coreTypedocConfig, null, 2)
    );

    // Write custom CSS for TypeDoc
    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/services/code-assistant/docs/custom.css'),
        typeDocCss
    );

    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/clients/code-assistant-webstorm/docs/custom.css'),
        typeDocCss
    );

    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/internal/code-assistant-core/docs/custom.css'),
        typeDocCss
    );

    // Write GraphQL schema
    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/services/code-assistant/src/graphql/schema.graphql'),
        schemaContent
    );

    // Create basic README files
    const readmeContent = `# SpiceTime Code Assistant
This package is part of the SpiceTime Code Assistant system.

## Documentation
Documentation is generated using TypeDoc and can be found in the \`docs\` directory.
To generate documentation:

\`\`\`bash
pnpm docs
\`\`\`

For development with live updates:

\`\`\`bash
pnpm docs:watch
\`\`\`
`;

    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/services/code-assistant/README.md'),
        readmeContent
    );

    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/clients/code-assistant-webstorm/README.md'),
        readmeContent
    );

    fs.writeFileSync(
        path.join(ROOT_DIR, 'packages/internal/code-assistant-core/README.md'),
        readmeContent
    );
}

function main() {
    try {
        createDirectories();
        writeFiles();
        console.log('✨ Code Assistant structure created successfully');
    } catch (error) {
        console.error('Error creating code assistant structure:', error);
        process.exit(1);
    }
}

main();
// setup.js
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const SERVICE_NAME = 'gateway';
const BASE_DIR = path.join('packages', 'services', SERVICE_NAME);

// File contents
const packageJson = {
  "name": "@spicetime/gateway-service",
  "version": "0.1.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts",
    "dev": "tsup src/index.ts --format esm,cjs --watch --dts",
    "start": "node dist/index.js",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint src",
    "typecheck": "tsc --noEmit",
    "generate:schema": "graphql-codegen"
  },
  "dependencies": {
    "@apollo/server": "^4.9.3",
    "graphql": "^16.8.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@graphql-codegen/cli": "^5.0.0",
    "@graphql-codegen/typescript": "^4.0.1",
    "@graphql-codegen/typescript-resolvers": "^4.0.1",
    "tsup": "^7.2.0",
    "typescript": "^5.2.2",
    "vitest": "^0.34.6",
    "@types/node": "^20.8.0"
  }
};

const tsConfig = {
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "lib": ["ES2020"],
    "declaration": true,
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests"]
};

const vitestConfig = `
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/']
    }
  }
});
`;

// Directory structure with file contents
const structure = {
  src: {
    'index.ts': `export * from './server';`,
    'server.ts': `// Server implementation will go here`,
    schema: {
      'typeDefs.ts': `// GraphQL type definitions will go here`,
      'resolvers.ts': `// GraphQL resolvers will go here`
    },
    domain: {
      types: {
        'index.ts': `export * from './gateway';`,
        'gateway.ts': `// Gateway types will go here`
      },
      services: {
        'index.ts': `export * from './gateway';`,
        'gateway.ts': `// Gateway service implementation will go here`
      },
      'errors.ts': `// Error definitions will go here`
    },
    infrastructure: {
      database: {},
      ai: {}
    },
    utils: {
      'index.ts': `export * from './context';`,
      'context.ts': `// Context utilities will go here`
    }
  },
  tests: {
    schema: {
      'resolvers.test.ts': `// Resolver tests will go here`
    },
    domain: {
      services: {
        'gateway.test.ts': `// Gateway service tests will go here`
      }
    },
    infrastructure: {
      ai: {
        'integration.test.ts': `// AI integration tests will go here`
      }
    }
  },
  docs: {
    'README.md': `# Gateway Service\n\nGraphQL gateway for SpiceTime services`,
    'schema.md': `# GraphQL Schema Documentation`,
    'deployment.md': `# Deployment Guide`
  }
};

async function createDirectory(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  await createDirectory(dir);
  
  if (typeof content === 'object') {
    await fs.writeFile(filePath, JSON.stringify(content, null, 2));
  } else {
    await fs.writeFile(filePath, content);
  }
}

async function createProjectStructure(baseDir, structure) {
  for (const [name, content] of Object.entries(structure)) {
    const currentPath = path.join(baseDir, name);
    
    if (typeof content === 'object' && !Buffer.isBuffer(content)) {
      await createDirectory(currentPath);
      await createProjectStructure(currentPath, content);
    } else {
      await createFile(currentPath, content);
    }
  }
}

async function setupProject() {
  try {
    // Create base directory
    await createDirectory(BASE_DIR);

    // Create project structure
    await createProjectStructure(BASE_DIR, structure);

    // Create config files
    await createFile(path.join(BASE_DIR, 'package.json'), packageJson);
    await createFile(path.join(BASE_DIR, 'tsconfig.json'), tsConfig);
    await createFile(path.join(BASE_DIR, 'vitest.config.ts'), vitestConfig);

    // Initialize git if not already initialized
    try {
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    } catch {
      execSync('git init', { cwd: BASE_DIR });
    }

    console.log('✨ Project structure created successfully');
    console.log('\nNext steps:');
    console.log(`1. cd ${BASE_DIR}`);
    console.log('2. npm install');
    console.log('3. npm run dev');
    
  } catch (error) {
    console.error('Error setting up project:', error);
    process.exit(1);
  }
}

// Run setup
setupProject();

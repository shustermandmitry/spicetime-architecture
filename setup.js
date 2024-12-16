// setup.js
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const SERVICE_NAME = 'gateway';
const BASE_DIR = path.join('packages', 'services', SERVICE_NAME);

// Minimal working configuration
const minimalStructure = {
  src: {
    'index.ts': `export * from './server';`,
    'server.ts': `import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

export interface ServerConfig {
  port: number;
}

export class GatewayServer {
  private server: ApolloServer;
  
  constructor(private config: ServerConfig) {
    this.server = new ApolloServer({
      typeDefs: \`#graphql
        type Query {
          health: String
        }
      \`,
      resolvers: {
        Query: {
          health: () => 'OK'
        }
      }
    });
  }

  async start() {
    const { url } = await startStandaloneServer(this.server, {
      listen: { port: this.config.port }
    });
    console.log(\`Server ready at \${url}\`);
  }
}`,
  }
};

const packageJson = {
  "name": "@spicetime/gateway-service",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "./node_modules/.bin/tsup",
    "dev": "./node_modules/.bin/tsup --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest"
  },
  "dependencies": {
    "@apollo/server": "^4.9.3",
    "graphql": "^16.8.1"
  },
  "devDependencies": {
    "tsup": "^7.2.0",
    "typescript": "^5.2.2",
    "vitest": "^0.34.6",
    "@types/node": "^20.8.0"
  }
};

const tsConfig = {
  "compilerOptions": {
    "target": "es2020",
    "module": "esnext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "lib": ["es2020"],
    "outDir": "./dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
};

const tsupConfig = `import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
})
`;

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
    await createProjectStructure(BASE_DIR, minimalStructure);

    // Create config files
    await createFile(path.join(BASE_DIR, 'package.json'), packageJson);
    await createFile(path.join(BASE_DIR, 'tsconfig.json'), tsConfig);
    await createFile(path.join(BASE_DIR, 'tsup.config.ts'), tsupConfig);

    console.log('✨ Project structure created successfully');
    console.log('\nNext steps:');
    console.log(`1. cd ${BASE_DIR}`);
    console.log('2. pnpm install');
    console.log('3. pnpm run dev');
    
  } catch (error) {
    console.error('Error setting up project:', error);
    process.exit(1);
  }
}

// Run setup
setupProject();

const fs = require('fs');
const path = require('path');

// Root and Templates Directory
const rootDir = process.cwd();
const templatesDir = path.join(rootDir, 'templates');

// Template Definitions
const templates = {
  'react-app': {
    files: {
      'package.json': `
{
  "name": "react-app",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^4.4.9",
    "typescript": "^5.2.2",
    "eslint": "^8.49.0"
  }
}
      `,
      'tsconfig.json': `
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "jsx": "react",
    "strict": true,
    "moduleResolution": "Node",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
      `,
      'src/index.tsx': `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
      `,
      'src/App.tsx': `
import React from 'react';

const App: React.FC = () => {
  return (
    <div>
      <h1>Hello, React!</h1>
      <p>Welcome to your new Vite-powered React app.</p>
    </div>
  );
};

export default App;
      `,
    },
  },

  'graphql-service': {
    files: {
      'package.json': `
{
  "name": "graphql-service",
  "version": "0.1.0",
  "scripts": {
    "dev": "ts-node-dev src/index.ts",
    "lint": "eslint src"
  },
  "dependencies": {
    "apollo-server": "^3.11.0",
    "graphql": "^16.8.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "ts-node-dev": "^2.0.0",
    "eslint": "^8.49.0",
    "typescript": "^5.2.2"
  }
}
      `,
      'tsconfig.json': `
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
      `,
      'src/index.ts': `
import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(\`🚀  Server ready at \${url}\`);
});
      `,
      'src/schema.ts': `
import { gql } from 'apollo-server';

export const typeDefs = gql\`
  type Query {
    hello: String
  }
\`;
      `,
      'src/resolvers.ts': `
export const resolvers = {
  Query: {
    hello: () => 'Hello, World!',
  },
};
      `,
    },
  },

  'package': {
    files: {
      'package.json': `
{
  "name": "utility-package",
  "version": "0.1.0",
  "scripts": {
    "build": "tsc"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "@types/node": "^20.8.0"
  }
}
      `,
      'tsconfig.json': `
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "CommonJS",
    "strict": true,
    "declaration": true,
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
      `,
      'src/index.ts': `
// Utility functions go here

export const example = () => {
  return 'Utility works!';
};
      `,
    },
  },
};

// Helper to Create Folders
function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Helper to Create Files
function createFileSync(filePath, content) {
  ensureDirSync(path.dirname(filePath));
  fs.writeFileSync(filePath, content.trim(), 'utf8');
}

// Create a Template
function createTemplate(name, template) {
  const templatePath = path.join(templatesDir, name);

  // Create the directory for the template
  ensureDirSync(templatePath);

  // Write the files for the template
  Object.entries(template.files).forEach(([filePath, content]) => {
    const fullPath = path.join(templatePath, filePath);
    createFileSync(fullPath, content);
  });

  console.log(`✨ Template "${name}" created successfully.`);
}

// Main Execution
(function setup() {
  console.log('Starting project scaffolding without extra dependencies...');

  // Create the templates directory
  ensureDirSync(templatesDir);

  // Create each template
  Object.entries(templates).forEach(([name, template]) => {
    createTemplate(name, template);
  });

  console.log('🎉 All templates were set up successfully in the "templates" directory!');
})();
const fs = require('fs');
const path = require('path');

// Define Idea Manager structure
const projectRoot = process.cwd();

const structure = {
  folders: [
    'docs/ideas-dumpster',
    'docs/structured',
    'db/mongo',
    'db/redis',
    'scripts',
    'src/context-engine',
    'src/embeddings',
    'src/relationships',
  ],
  files: {
    'README.md': `
# Idea Manager

**Idea Manager** helps you capture, process, and manage ideas. It provides tools for building contextual relationships, semantic searches, and querying data.

## Features
1. Process raw ideas from \`docs/ideas-dumpster/\`.
2. Store ideas, embeddings, and relationships using MongoDB (or extendable alternatives).
3. Query notes using keywords, tags, or similarity.

## How to Use
### 1. Install Dependencies
Run the following inside the project folder:
\`\`\`
pnpm install
\`\`\`

### 2. Process Notes
Run:
\`\`\`
node scripts/process-notes.js
\`\`\`

### 3. Query Notes
Query your stored notes:
\`\`\`
node scripts/query.js
\`\`\`

Extend this library as needed with embedding/relationship features.
`,
    'scripts/process-notes.js': `
// Placeholder: Read and save raw notes to MongoDB

const fs = require('fs');
const path = require('path');
const mongoClient = require('mongodb').MongoClient;

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'idea_manager';

async function connectToDb() {
  const client = await mongoClient.connect(MONGO_URI);
  return client.db(DB_NAME);
}

async function processFile(filePath, db) {
  const content = fs.readFileSync(filePath, 'utf8');
  const note = { content, timestamp: new Date().toISOString() };
  await db.collection('raw_notes').insertOne(note);
  console.log(\`Saved: \${filePath}\`);
}

(async function () {
  const notesDir = path.join(__dirname, '../docs/ideas-dumpster');
  const db = await connectToDb();

  const files = fs.readdirSync(notesDir).filter(file => file.endsWith('.md'));
  for (const file of files) {
    await processFile(path.join(notesDir, file), db);
  }

  console.log('Finished processing notes!');
})();
`,
    'scripts/query.js': `
// Placeholder: Query notes from MongoDB

const mongoClient = require('mongodb').MongoClient;

const MONGO_URI = 'mongodb://localhost:27017';
const DB_NAME = 'idea_manager';

(async function () {
  const client = await mongoClient.connect(MONGO_URI);
  const db = client.db(DB_NAME);

  const notes = await db.collection('raw_notes').find().toArray();
  console.log('Here are your notes:', notes);

  client.close();
})();
`,
    'src/context-engine/semantic-search.js': `
// Placeholder: Perform similarity search

const cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (magnitudeA * magnitudeB);
};

module.exports = cosineSimilarity;
`,
    'src/embeddings/generate-embeddings.js': `
// Placeholder: Generate embeddings

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({ apiKey: 'YOUR_OPENAI_API_KEY' });
const openai = new OpenAIApi(configuration);

async function generateEmbedding(content) {
  const response = await openai.createEmbedding({
    input: content,
    model: 'text-embedding-ada-002',
  });
  return response.data.data[0].embedding;
}

module.exports = generateEmbedding;
`,
  },
};

// Generate package.json
function generatePackageJSON() {
  const packageJSON = {
    name: "idea-manager",
    version: "1.0.0",
    description: "A tool for capturing, processing, and querying ideas with embeddings and relationships.",
    main: "index.js",
    scripts: {
      start: "node scripts/process-notes.js",
      query: "node scripts/query.js"
    },
    author: "Your Name",
    license: "MIT",
    dependencies: {
      mongodb: "^5.0.0",
      openai: "^4.0.0"
    }
  };

  const target = path.join(projectRoot, "package.json");
  if (!fs.existsSync(target)) {
    fs.writeFileSync(target, JSON.stringify(packageJSON, null, 2));
    console.log("Created file: package.json");
  } else {
    console.log("File exists: package.json");
  }
}

// Main setup function
function setupProject() {
  console.log('Setting up Idea Manager package...');

  // Create folders
  structure.folders.forEach(folder => {
    const target = path.join(projectRoot, folder);
    if (!fs.existsSync(target)) {
      fs.mkdirSync(target, { recursive: true });
      console.log(`Created folder: ${folder}`);
    } else {
      console.log(`Folder exists: ${folder}`);
    }
  });

  // Create files
  Object.entries(structure.files).forEach(([file, content]) => {
    const target = path.join(projectRoot, file);
    if (!fs.existsSync(target)) {
      fs.writeFileSync(target, content.trim());
      console.log(`Created file: ${file}`);
    } else {
      console.log(`File exists: ${file}`);
    }
  });

  // Generate package.json
  generatePackageJSON();

  console.log('\n🎉 Idea Manager package is ready! Run `pnpm install` to set up dependencies.');
}

// Run setup
setupProject();
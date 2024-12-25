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
  console.log(`Saved: ${filePath}`);
}

(async function () {
  const notesDir = path.join(__dirname, '../docs.typedoc/ideas-dumpster');
  const db = await connectToDb();

  const files = fs.readdirSync(notesDir).filter(file => file.endsWith('.md'));
  for (const file of files) {
    await processFile(path.join(notesDir, file), db);
  }

  console.log('Finished processing notes!');
})();
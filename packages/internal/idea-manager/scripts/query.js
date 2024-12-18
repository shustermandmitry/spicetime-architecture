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
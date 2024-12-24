/**
 * Context Builder for the project.
 *
 * This script provides application-wide context for services such as database, authentication, etc.
 */

const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

// MongoDB setup
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DATABASE_NAME = process.env.DATABASE_NAME || 'mydatabase';

// JWT secret (should be secure for production environments)
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// MongoDB client instance
const client = new MongoClient(MONGO_URI);

/**
 * Connect to the MongoDB database.
 */
async function connectToDatabase() {
  if (!client.isConnected) {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('MongoDB connected successfully.');
  }
  return client.db(DATABASE_NAME);
}

/**
 * Decode and verify a JWT token.
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Invalid token:', error.message);
    throw new Error('Unauthorized');
  }
}

/**
 * Build the context with authentication and database connection.
 */
async function buildContext({ headers }) {
  const token = headers?.authorization?.split(' ')[1];
  let user = null;

  if (token) {
    user = verifyToken(token);
  }

  const db = await connectToDatabase();

  return { user, db };
}

module.exports = { buildContext };

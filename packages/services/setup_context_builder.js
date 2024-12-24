const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Run shell commands and show progress in the terminal
function runCommand(command) {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error while running "${command}":`, error.message);
    process.exit(1); // Exit on failure
  }
}

// Create and populate the context-builder directory with a boilerplate
function setupContextBuilder() {
  const CONTEXT_BUILDER_DIR = path.join(process.cwd(), 'context-builder'); // Creates in the current directory
  const CONTEXT_FILE = path.join(CONTEXT_BUILDER_DIR, 'context.js');

  // Step 1: Create the directory
  if (!fs.existsSync(CONTEXT_BUILDER_DIR)) {
    fs.mkdirSync(CONTEXT_BUILDER_DIR, { recursive: true });
    console.log('Created "context-builder" directory.');
  } else {
    console.log('"context-builder" directory already exists, skipping creation.');
  }

  // Step 2: Populate context.js with boilerplate code
  const contextCode = `/**
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
`;

  fs.writeFileSync(CONTEXT_FILE, contextCode);
  console.log(`Populated "${CONTEXT_FILE}" with default content.`);
}

// Main function that handles everything
function main() {
  try {
    console.log('Starting context builder setup...');

    // Step 1: Set up "context-builder"
    setupContextBuilder();

    // Step 2: Git add, commit, and push changes
    console.log('Staging changes...');
    runCommand('git add .'); // Stage all changes

    console.log('Committing changes...');
    const commitMessage = 'feat: add context manager module and boilerplate';
    runCommand(`git commit -m "${commitMessage}"`); // Commit changes with a message

    console.log('Pushing changes...');
    runCommand('git push'); // Push changes to the current branch

    console.log('🎉 Context manager setup complete! Changes have been committed and pushed.');
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

main();
# Idea Manager

**Idea Manager** helps you capture, process, and manage ideas. It provides tools for building contextual relationships, semantic searches, and querying data.

## Features
1. Process raw ideas from `docs/ideas-dumpster/`.
2. Store ideas, embeddings, and relationships using MongoDB (or extendable alternatives).
3. Query notes using keywords, tags, or similarity.

## How to Use
### 1. Install Dependencies
Run the following inside the project folder:
```
pnpm install
```

### 2. Process Notes
Run:
```
node scripts/process-notes.js
```

### 3. Query Notes
Query your stored notes:
```
node scripts/query.js
```

Extend this library as needed with embedding/relationship features.
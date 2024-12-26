# this is depricated in favor of encapsulation into react component.
but a good illustration to the workings of GQLDoc component


# Developer Guide to GraphQL Documentation and Workflow

This guide outlines the workflow for maintaining your GraphQL schema (`schema.gql`) as the single source of truth. It explains how to automate:

- **Human-friendly API documentation** with `graphql-docs`.
- **TypeScript definitions** and **resolver skeletons** with `graphql-codegen`.

---

## Workflow Overview

### Key Outputs:
1. **Human-Friendly Docs**: HTML/Markdown documentation from `graphql-docs`.
2. **TypeScript Types**: Type-safe interfaces and resolver skeletons from `graphql-codegen`.
3. **Resolver Templates**: Boilerplate for implementing API behavior.

### Steps:
1. Annotate `schema.gql` with meaningful comments.
2. Generate docs and TypeScript code.
3. Implement logic with pre-generated resolver types.

---

## 1. Annotating the Schema

Your schema acts as the source of truth; annotate it with `"""` SDL-style comments.

Example `src/schema.gql`:
```graphql
""" Represents a user """
type User {
  """ Unique ID of the user """
  id: ID!

  """ Full name """
  name: String!
}

""" Root queries """
type Query {
  """ Fetch all users """
  users: [User!]!
}
```

---

## 2. Generating Documentation with `graphql-docs`

### Install:
```bash
npm install --save-dev graphql-docs
```

### Generate Docs:
```bash
graphql-docs -s src/schema.gql -o docs
```

### Automate:
Add to `package.json`:
```json
"scripts": {
  "generate-docs": "graphql-docs -s src/schema.gql -o docs"
}
```

Run:
```bash
npm run generate-docs
```

---

## 3. Generating TypeScript Code with `graphql-codegen`

### Install:
```bash
npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-resolvers
```

### Setup `codegen.yml`:
```yaml
overwrite: true
schema: "src/schema.gql"
generates:
  src/generated/graphql.ts:
    plugins:
      - typescript
      - typescript-resolvers
```

### Generate:
```bash
npx graphql-codegen
```

### Automate:
Add to `package.json`:
```json
"scripts": {
  "generate-types": "graphql-codegen --config codegen.yml"
}
```

Run:
```bash
npm run generate-types
```

---

## 4. Full Workflow Automation

Combine everything into one command.

In `package.json`:
```json
"scripts": {
  "generate-all": "npm run generate-types && npm run generate-docs"
}
```

Run:
```bash
npm run generate-all
```

This regenerates documentation and types whenever schema changes.

---

## 5. Implementing Resolvers

Use the generated resolver skeletons to add logic.

Generated `graphql.ts` example:
```typescript
export type QueryResolvers = {
  users: () => Promise<User[]>;
};
```

Example resolver:
```typescript
import { QueryResolvers } from './generated/graphql';

export const queryResolvers: QueryResolvers = {
  users: async (_, __, { dataSources }) => {
    return dataSources.userAPI.getAllUsers();
  },
};
```

---

## Directory Structure
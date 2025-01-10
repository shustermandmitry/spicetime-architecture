# Proposal: Integrating Treenity with Spicetime

## Overview

This document outlines a multi-layered implementation to integrate Treenity’s patch-driven real-time state management
system with Spicetime’s React-based front end. The architecture includes **real-time communication**, **unified spaces
**, and a permission-aware schema design, while maintaining scalability and separation of responsibilities.

---

## 1. High-Level Architecture

1. **Treenity Layer (Low-level Patch System)**:
    - Backbone of the system managing **real-time data synchronization** and **tree-like structures** using patches.
    - Interacts with React directly for state management and updates.

2. **GraphQL Schema Layer**:
    - Abstraction layer for **services, entities**, and operations.
    - Exposes Treenity nodes + business logic declaratively.
    - Modular permission system integrated at the **space** and **schema** levels.

3. **Spaces and Borders**:
    - Logical grouping of entities into "Spaces."
    - Define clear "Borders" (permissions) for each space and schema.

4. **React Frontend**:
    - Dynamically updates its state with **streams of patches** (via WebSockets).
    - Queries GraphQL for higher-level abstractions or batch-fetch operations when needed.

---

## 2. Layers in Detail

### Layer 1: Treenity Patch Protocol

#### Purpose

- To enable **high-frequency, real-time, incremental updates** for the dynamic tree representing all entities/processes.
- Provide efficient and transparent distributed node synchronization.

#### Implementation

- **WebSocket-based Streaming Protocol**:
    - Patches and changes propagate across the distributed net.
    - Example operations include `ADD`, `EDIT`, `DELETE`.

#### Example WebSocket Implementation

- **Patch Stream:**
  The WebSocket server streams changes (patches) directly to subscribed clients:
  ```json
  {
    "type": "PATCH",
    "path": "tree/path/to/node",
    "operation": "ADD",
    "value": {
      "name": "newNode",
      "data": {
        "key": "value"
      }
    }
  }
  ```

- **React State Integration**:
   ```tsx
   import { useEffect, useState } from "react";

   const useTreenityPatchStream = (path: string) => {
     const [state, setState] = useState({});

     useEffect(() => {
       const socket = new WebSocket("wss://treenity-server/patch");
       socket.onmessage = (event) => {
         const { type, path: updatePath, operation, value } = JSON.parse(event.data);
         if (operation === "ADD" && updatePath.startsWith(path)) {
           setState((prev) => ({
             ...prev,
             [value.name]: value.data,
           }));
         }
         // Handle EDIT, DELETE in a similar way.
       };
       return () => socket.close();
     }, [path]);

     return state;
   };

   // Example usage:
   const ExampleComponent = () => {
     const treeData = useTreenityPatchStream("tree/path/to/node");
     return <div>{JSON.stringify(treeData)}</div>;
   };
   ```

#### Functional Chain Execution

- **REST API Endpoint Example**:
   ```typescript
   POST /execute-functional-chain
   {
     "path": "tree/path/to/node",
     "chain": "update(status.complete) -> notify(subscribers)"
   }
   ```

- Backend interprets and executes the functional chain:
    - Updates the node.
    - Sends corresponding patches.

---

### Layer 2: GraphQL Schema Layer

#### Purpose

- Provide a declarative, structured API for clients or external consumers.
- Integrate permission system centrally.

#### Key Concepts

1. **Unified Nodes** for abstraction:
    - Map nodes to a meaningful entity via types.
    - Example:
      ```graphql
      type Node {
        id: ID!
        path: String!
        value: String
        children: [Node]
        meta: Metadata
      }
      ```

2. **Space Schema**:
    - Group a collection of nodes/entities into logical **spaces**.
    - Spaces can represent specific domains, services, or features.

3. **Permission-Aware Queries**:
    - Built-in permission system declaratively enforced in the schema.

#### Schema Examples

- **Node Query Example**:
   ```graphql
   type Query {
     getNode(path: String!): Node
   }
   ```

- **Perform Function Example**:
   ```graphql
   type Mutation {
     performAction(
       path: String!
       chain: String! # e.g., "update(status.complete)"
     ): Node
   }
   ```

---

### Layer 3: Spaces and Borders

#### Purpose

- Provides high-level abstractions, logical grouping, and permission systems for schema and data interaction.

#### Permission System

- Implemented as middleware that integrates permissions for every schema.
- **Permissions Defined by Nodes in Space**:
  Each **Space** has nodes that define "who" can do "what."

#### Implementation Details

1. **Define Permissions via GraphQL Directives**:
   ```graphql
   directive @permission(
     roles: [String]!
     allow: [String]
     deny: [String]
   ) on FIELD_DEFINITION
   ```

   Example:
   ```graphql
   type Service {
     id: ID!
     name: String!
     @permission(roles: ["admin"], allow: ["query", "update"], deny: ["delete"])
   }
   ```

2. **React Middleware Enforcer**:
   Permissions are checked **per subscription/message**.
   Example in Node.js:
   ```typescript
   const permissionMiddleware = (req, res, next) => {
     const user = req.user; // Assume user is injected from Auth.
     const roles = user?.roles || [];
     const { allow, deny } = req.space?.permissions || {};

     if (allow?.length && !allow.some((action) => roles.includes(action))) {
       return res.status(403).send("Forbidden");
     }
     if (deny?.length && deny.some((action) => roles.includes(action))) {
       return res.status(403).send("Forbidden");
     }
     next();
   };
   ```

#### Permission System on React

Permissions funnel into the React app via the GraphQL schema:

- Example:
    - User queries a "space" node.
    - Schema enforces permissions via the directive.
    - React app displays or hides elements based on permissions.

---

## React + Treenity Communication Workflow

React components receive updates via:

1. **WebSocket-driven Patches** in real-time (immediate updates to state).
2. **GraphQL Queries/Mutations** for higher-level operations.

Example React Workflow:

1. Subscribe to WebSocket for **low-level updates**:
   ```tsx
   const state = useTreenityPatchStream("tree/path/to/service");
   ```

2. Query structured spaces via GraphQL:
   ```graphql
   query {
     getNode(path: "tree/path/to/service") {
       id
       value
       children {
         id
         value
       }
     }
   }
   ```

---

## Closing: Benefits

1. **Multi-layered design** ensures scalability.
2. Highly **reactive patch-driven updates** allow seamless state changes in React.
3. **Modular permission system** guarantees security and space-oriented borders.
4. Unified Treenity tree provides a cohesive graph across the network.

---
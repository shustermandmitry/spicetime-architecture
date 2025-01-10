# Overview: Space Permission System in Treenity

## **Overview**

Treenity's Space Permission System is designed to enforce fine-grained access control within logical "spaces." Each
space represents a domain of data, operations, and entities (e.g., "Marketing", "Sales"), and the permission layers
define who can access or modify specific resources.

---

## **Key Components**

### 1. **Spaces**

- Logical groupings of entities or topics.
- Serve as boundaries for organizing data and managing permissions.

**Examples of Spaces:**

- `Marketing`: Campaigns, tasks, and performance reports.
- `Sales`: Orders, customers, and tracking.
- `Development`: Code repositories, build processes.

### 2. **Permissions**

- Rules that govern what actions are allowed within a space.
- Each permission includes:
    - **Roles**: Define the type of user (e.g., admin, editor, viewer).
    - **Resources**: Specify which entities/paths are protected.
    - **Actions**: Allowable operations (e.g., `READ`, `WRITE`, `EXECUTE`).

---

## **Permission Model Design**

### **Hierarchy of Permissions**

1. **Global Permissions**:
    - Apply globally across all spaces, typically used for admin users.
2. **Space Permissions**:
    - Apply specifically to a space (e.g., `Marketing`).
3. **Node-Level Permissions**:
    - Apply to specific paths or nodes in the tree within a space.

---

## **1. Permission Schema**

### **GraphQL Type Definition**

Represents the structure of permissions and their assignments.

```graphql
type Permission {
  id: ID!
  space: String!
  resource: String!
  role: String!
  actions: [String!]!
}

type Role {
  id: ID!
  space: String!
  name: String!
  permissions: [Permission!]!
}
```

---

### **Permission Example**

**Space**: `Marketing`  
**Role**: `Editor`  
**Permissions**:

- Can `READ` and `WRITE` campaigns.
- Can `EXECUTE` task-related workflows.

Example Permissions:

```json
[
  {
    "space": "Marketing",
    "resource": "tree/spaces/marketing/campaigns",
    "role": "Editor",
    "actions": [
      "READ",
      "WRITE"
    ]
  },
  {
    "space": "Marketing",
    "resource": "tree/spaces/marketing/tasks",
    "role": "Editor",
    "actions": [
      "EXECUTE"
    ]
  }
]
```

---

## **2. Permission Evaluation**

To evaluate if a user can access/modify a resource:

- Match the user’s role to the resource’s permissions.
- Ensure the role contains the required action (`READ`, `WRITE`, `EXECUTE`).

### **Flow Diagram**
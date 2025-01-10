# Guide: Patch Protocol Design for Treenity

## **Overview**

This guide explains the design of the **Treenity Patch Protocol**, which facilitates real-time, incremental, and
distributed updates across a structured tree system. The protocol ensures efficient communication of changes, supports
distributed syncing, and builds the foundation for scalable collaboration.

---

## **Key Components of the Patch Protocol**

1. **Patches**:
   A patch is an atomic operation that represents a single change (e.g., `ADD`, `EDIT`, `DELETE`) within the tree
   structure.

2. **Tree Structure**:
   Treenity stores data in a **tree-like hierarchical format** where every node/path has a unique address.

3. **Distributed State Management**:
   Patches keep multiple clients (or nodes) synchronized by propagating incremental updates in near real-time.

4. **Streaming Protocol**:
   WebSocket-based streams ensure low latency for patch delivery.

---

## **1. Anatomy of a Patch**

A single patch contains the following fields:

| **Field**     | **Description**                                         |
|---------------|---------------------------------------------------------|
| `type`        | The operation type (`ADD`, `EDIT`, `DELETE`, etc.).     |
| `path`        | The unique address of the affected node in the tree.    |
| `operation`   | The action to perform (e.g., adding/editing data).      |
| `value`       | The payload/data associated with the operation.         |
| `timestamp`   | The time of the operation to track synchronization.     |
| `meta` (opt.) | Optional metadata for context; e.g., user info or tags. |

### Example Patch:

```json
{
  "type": "PATCH",
  "path": "tree/spaces/marketing/tasks/101",
  "operation": "EDIT",
  "value": {
    "status": "in-progress"
  },
  "timestamp": 1698762345678,
  "meta": {
    "user": "john.doe"
  }
}
```

---

## **2. Tree Updates Using Patches**

The tree has the following structure:
tree/spaces/marketting/tasks/101/name:"Campaign Planning" status": "assigned"

When a patch with the following data is received:

```json
{
  "type": "PATCH",
  "path": "tree/spaces/marketing/tasks/101",
  "operation": "EDIT",
  "value": {
    "status": "in-progress"
  }
}
```

### Resulting Change:

```json
{
  "tree/spaces/marketing/tasks/101": {
    "name": "Campaign Planning",
    "status": "in-progress"
  }
}
```

---

## **3. Protocol Operations**

### **Supported Patch Operations**

| **Operation** | **Description**                                   | **Example**                                                  |
|---------------|---------------------------------------------------|--------------------------------------------------------------|
| `ADD`         | Adds a new node or property.                      | Add a new task to `/spaces/marketing/tasks`.                 |
| `EDIT`        | Modifies an existing property or set of values.   | Update the `status` of a task to `completed`.                |
| `DELETE`      | Removes a node or property.                       | Delete task `101` from `/spaces/marketing/tasks`.            |
| `MOVE`        | Moves a node from one path to another.            | Move task `101` from `/tasks/review` to `/tasks/completed`.  |
| `EXECUTE`     | Trigger an action or invoke a downstream service. | Execute a workflow on path `/spaces/sales/orders/15/submit`. |

---

## **4. Real-Time Stream Implementation**

The real-time protocol utilizes **WebSocket** for low latency updates.

### **Steps for Integration**:

1. **WebSocket Connection**:
   Establish a persistent WebSocket connection between server and client.

2. **Push Patches**:
   Server streams patches to connected clients for applied changes.

3. **Client-Side Update**:
   Each client listens to incoming patches and applies them to its local state/store.

---

### **Client Patch Listener Example**

Here’s an example setup for handling patches on the client using WebSocket:

```javascript
const ws = new WebSocket('wss://treenity-server/patches');

// Listens for incoming patches
ws.onmessage = (event) => {
    const patch = JSON.parse(event.data);
    handlePatch(patch);
};

const handlePatch = (patch) => {
    const {path, operation, value} = patch;

    switch (operation) {
        case 'ADD':
            console.log(`Adding new node at path: ${path}`, value);
            break;

        case 'EDIT':
            console.log(`Editing node at path: ${path}`, value);
            break;

        case 'DELETE':
            console.log(`Deleting node at path: ${path}`);
            break;

        case 'MOVE':
            console.log(`Moving node to path: ${path}`, value);
            break;

        default:
            console.warn(`Unknown operation: ${operation}`);
    }
};
```

---

## **5. Synchronizing Across Multiple Nodes**

### **Conflict Resolution**

1. **Timestamps**:
    - Use the `timestamp` field to resolve conflicts between competing updates (latest takes precedence).

2. **Operational Transform**:
    - For collaborative edits, consider using an OT-based algorithm to maintain data consistency.

### **Example: Resolving Conflict**

Two patches arrive:

1. Patch 1: `{ "path": "tree/tasks/1", "operation": "EDIT", "value": { "status": "in-progress" }, "timestamp": 1000 }`
2. Patch 2: `{ "path": "tree/tasks/1", "operation": "EDIT", "value": { "status": "completed" }, "timestamp": 1005 }`

Result:

- Patch 2 takes precedence, as its timestamp is newer.

---

## **6. Benefits of the Patch Protocol**

1. **Real-Time Sync**:
    - Low latency updates ensure clients have up-to-date data.

2. **Efficient Data Management**:
    - Incremental patches reduce the need to transmit entire objects.

3. **Scalable Collaboration**:
    - Distributed systems can synchronize changes efficiently over WebSocket streams.

4. **Conflict Prevention**:
    - Using timestamps and operational transforms maintains consistency across nodes.

---

## **Next Steps**

1. Implement WebSocket connection pooling for better scalability.
2. Wrap the listener logic in a reusable hook (e.g., `usePatchStream`) for client applications.
3. Extend the protocol to support batch processing for high-frequency operations.

---
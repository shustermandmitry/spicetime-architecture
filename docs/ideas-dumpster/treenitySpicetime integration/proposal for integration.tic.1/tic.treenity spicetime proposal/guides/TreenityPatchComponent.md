# Example: React Component for Consuming Treenity Patch Streams

## **Overview**

This guide demonstrates how to build a React component that consumes real-time **Treenity patch streams** and
dynamically updates the UI. It also integrates with GraphQL queries for fetching data during initial loads or when batch
operations are needed.

---

## **Key Concepts**

1. **Patch Streams**:
    - Real-time updates flow through patches using WebSockets.
    - These patches represent operations (e.g., `ADD`, `EDIT`, `DELETE`) on Treenity’s structured tree.

2. **Integration Workflow**:
    - Establish a WebSocket connection to listen to the patch stream.
    - Update the local React state dynamically based on the received operations.

3. **GraphQL Queries as Fallback**:
    - Use GraphQL for initial data retrieval or complex queries beyond the scope of patches.

---

## **1. Setting Up the Patch Stream**

### **WebSocket Utility**

Create a WebSocket listener to handle incoming patches:

```javascript
// ws-client.js
export const createWebSocketClient = (url, onMessage) => {
  const ws = new WebSocket(url);

  ws.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.onmessage = (event) => {
    const patch = JSON.parse(event.data);
    onMessage(patch);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };

  return ws;
};
```

---

## **2. A React Component Consuming Patch Streams**

A React component that listens to the patch stream and updates its local state dynamically:

### **Example: Campaigns List**

```tsx
import React, { useEffect, useState } from 'react';
import { createWebSocketClient } from './ws-client';

const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    // WebSocket Connection
    const ws = createWebSocketClient('wss://treenity-server/patches', (patch) => {
      handlePatchUpdate(patch);
    });

    // Cleanup (close WebSocket on component unmount)
    return () => ws.close();
  }, []);

  const handlePatchUpdate = (patch) => {
    const { path, operation, value } = patch;

    // Dynamically handle incoming patches
    if (path.startsWith('tree/spaces/marketing/campaigns')) {
      const id = path.split('/').pop(); // Extract campaign ID
      const existing = campaigns.find((c) => c.id === id);

      switch (operation) {
        case 'ADD':
          setCampaigns([...campaigns, { id, ...value }]);
          break;

        case 'EDIT':
          setCampaigns(
            campaigns.map((c) => (c.id === id ? { ...c, ...value } : c))
          );
          break;

        case 'DELETE':
          setCampaigns(campaigns.filter((c) => c.id !== id));
          break;

        default:
          console.warn(`Unknown operation ${operation} in patch`);
      }
    }
  };

  return (
    <div>
      <h2>Marketing Campaigns</h2>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            {campaign.name} - {campaign.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignsList;
```

---

## **3. Integrating with GraphQL Queries**

To fetch initial data via a GraphQL query before applying patches:

### **GraphQL Query for Initial Campaigns**

```graphql
query GetMarketingCampaigns {
  listCampaigns(status: "active") {
    id
    name
    status
  }
}
```

### **Updated Component to Fetch Initial Data**

Use Apollo Client or any other GraphQL client library:

```tsx
import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { createWebSocketClient } from './ws-client';

const GET_CAMPAIGNS = gql`
  query GetMarketingCampaigns {
    listCampaigns(status: "active") {
      id
      name
      status
    }
  }
`;

const CampaignsList = () => {
  const { data, loading } = useQuery(GET_CAMPAIGNS);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    if (!loading && data) {
      setCampaigns(data.listCampaigns);
    }
  }, [loading, data]);

  useEffect(() => {
    // Listen to patches via WebSocket
    const ws = createWebSocketClient('wss://treenity-server/patches', (patch) => {
      handlePatchUpdate(patch);
    });

    return () => ws.close();
  }, [campaigns]);

  const handlePatchUpdate = (patch) => {
    const { path, operation, value } = patch;
    const id = path.split('/').pop();

    switch (operation) {
      case 'ADD':
        setCampaigns([...campaigns, { id, ...value }]);
        break;

      case 'EDIT':
        setCampaigns(
          campaigns.map((c) => (c.id === id ? { ...c, ...value } : c))
        );
        break;

      case 'DELETE':
        setCampaigns(campaigns.filter((c) => c.id !== id));
        break;

      default:
        console.warn('Unknown patch operation:', operation);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Marketing Campaigns</h2>
      <ul>
        {campaigns.map((campaign) => (
          <li key={campaign.id}>
            {campaign.name} - {campaign.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignsList;
```

---

## **4. Benefits**

1. **Real-Time Updates**:
    - Patches dynamically update the React state, ensuring the frontend reflects changes from Treenity instantly.

2. **Hybrid Approach**:
    - Use GraphQL for structured queries and WebSocket patches for real-time reactivity.

3. **Dynamic and Scalable**:
    - Easily expandable to handle other types of entities (e.g., `Users`, `Tasks`, etc.) by reusing the
      `handlePatchUpdate` logic.

---

## **Next Steps**

1. Enhance the `handlePatchUpdate` function to support complex functional chains.
2. Wrap WebSocket listeners into a reusable React Hook (`usePatchStream`).
3. Combine permissions into the state logic to ensure secured updates.

---
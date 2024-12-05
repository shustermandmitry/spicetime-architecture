const { ApolloClient, InMemoryCache, split, HttpLink } = require('@apollo/client');
const { GraphQLWsLink } = require('@apollo/client/link/subscriptions');
const { createClient: createWsClient } = require('graphql-ws');

function createClient({ httpUrl, wsUrl, getAuth }) {
  // Implementation here
}

module.exports = { createClient };
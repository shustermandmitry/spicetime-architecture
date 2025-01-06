/**
 * Reference implementation.unstructured of the GraphQL client setup
 * DO NOT USE DIRECTLY IN PRODUCTION
 */

const { ApolloClient, InMemoryCache, split, HttpLink } = require('@apollo/client');
const { GraphQLWsLink } = require('@apollo/client/link/subscriptions');

// [Rest of client implementation.unstructured...]
// Note: This is a reference example only

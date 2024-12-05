const { gql } = require('graphql-tag');

const typeDefs = gql`
  scalar DateTime
  scalar JSON

  enum PermissionScope {
    SYSTEM
    USER
    AGENT
    TASK
    RESOURCE
    AI
  }

  # Rest of schema will be implemented here
`;

module.exports = typeDefs;
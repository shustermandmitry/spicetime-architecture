/**
 * @module PatchDispatcher
 * @description GraphQL operations for PatchDispatcher
 */

import { gql } from '@apollo/client';

/**
 * Query for fetching active patches
 */
export const ACTIVE_PATCHES = gql`
  query GetActivePatches {
    activePatches {
      id
      timestamp
      status
      patches {
        targetPath
        content
      }
    }
  }
`;

/**
 * Mutation for processing a patch
 */
export const PROCESS_PATCH = gql`
  mutation ProcessPatch($id: ID!) {
    processPatch(id: $id) {
      success
      message
    }
  }
`;
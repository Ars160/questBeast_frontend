import { gql } from '@apollo/client';

export const NEW_SUBMISSION_SUBSCRIPTION = gql`
  subscription NewSubmission($questId: ID!) {
    newSubmission(questId: $questId) {
      id
      content
      grade
      feedback
      author {
        id
        name
      }
    }
  }
`;

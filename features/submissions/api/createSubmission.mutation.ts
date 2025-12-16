import { gql } from '@apollo/client';

export const CREATE_SUBMISSION_MUTATION = gql`
  mutation CreateSubmission($content: String!, $questId: ID!, $fileUrl: String) {
    createSubmission(content: $content, questId: $questId, fileUrl: $fileUrl) {
      id
      content
      grade
      
    }
  }
`;

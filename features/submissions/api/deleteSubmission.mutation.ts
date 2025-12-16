import { gql } from '@apollo/client';

export const DELETE_SUBMISSION_MUTATION = gql`
  mutation DeleteSubmission($id: ID!) {
    deleteSubmission(id: $id)
  }
`;

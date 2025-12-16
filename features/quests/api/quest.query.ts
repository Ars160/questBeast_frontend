import { gql } from '@apollo/client';

export const QUEST_QUERY = gql`
  query Quest($id: ID!) {
    quest(id: $id) {
      id
      title
      description
      subject
      difficulty
      reward
      creator {
        id
        name
      }
      submissions {
        id
        content
        author {
          id
          name
        }
        grade
        feedback
      }
      createdAt
    }
  }
`;

import { gql } from '@apollo/client';

export const QUESTS_QUERY = gql`
  query Quests($subject: String) {
    quests(subject: $subject) {
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
      createdAt
    }
  }
`;

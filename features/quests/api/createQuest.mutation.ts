import { gql } from '@apollo/client';

export const CREATE_QUEST_MUTATION = gql`
  mutation CreateQuest(
    $title: String!
    $description: String!
    $subject: String!
    $difficulty: Int!
    $reward: Int!
  ) {
    createQuest(
      title: $title
      description: $description
      subject: $subject
      difficulty: $difficulty
      reward: $reward
    ) {
      id
      title
    }
  }
`;

// features/quests/api/updateQuest.mutation.ts
import { gql } from '@apollo/client';

export const UPDATE_QUEST_MUTATION = gql`
  mutation UpdateQuest($id: ID!, $title: String!, $description: String!) {
    updateQuest(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

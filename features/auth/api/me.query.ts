import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      name
      email
      level
      points
      isActive
      monster {
        id
        name
        level
        hunger
        multiplier
        evolutionStage
      }
    }
  }
`;

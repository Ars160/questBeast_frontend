import { gql } from '@apollo/client';

export const LEADERBOARD_QUERY = gql`
  query Leaderboard {
    leaderboard {
      id
      user {
        id
        name
      }
      score
      rank
      period
    }
  }
`;

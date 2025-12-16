import { gql } from '@apollo/client';

export const LEADERBOARD_SUBSCRIPTION = gql`
  subscription OnLeaderboardUpdate {
    leaderboard {
      id
      user {
        id
        name
        points
      }
      score
      rank
      period
    }
  }
`;

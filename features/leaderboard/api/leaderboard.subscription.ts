import { gql } from '@apollo/client';

export const LEADERBOARD_SUBSCRIPTION = gql`
  subscription LeaderboardUpdated {
    leaderboardUpdated
  }
`;

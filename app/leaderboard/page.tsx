'use client';

import { useQuery, useSubscription } from '@apollo/client/react';
import { LEADERBOARD_QUERY } from '@/features/users/api/leaderboard.query';
import { LEADERBOARD_SUBSCRIPTION } from '@/features/leaderboard/api/leaderboard.subscription';

type User = { id: string; name: string };
type LeaderboardItem = {
  id: string;
  user: User;
  score: number;
  rank: number;
  period: string;
};
type LeaderboardResponse = { leaderboard: LeaderboardItem[] };

export default function LeaderboardPage() {
  // Получаем изначальные данные через query
  const { data, loading, error } = useQuery<LeaderboardResponse>(LEADERBOARD_QUERY);

  // Подписка на обновления в реальном времени
  const { data: subscriptionData } = useSubscription<{ leaderboardUpdated: LeaderboardItem[] }>(
    LEADERBOARD_SUBSCRIPTION
  );

  const leaderboard = subscriptionData?.leaderboardUpdated || data?.leaderboard || [];

  if (loading && !subscriptionData) return <p>Loading leaderboard...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (leaderboard.length === 0) return <p>Нет данных для рейтинга</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Rank</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.rank}</td>
              <td className="border p-2">{item.user.name}</td>
              <td className="border p-2">{item.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

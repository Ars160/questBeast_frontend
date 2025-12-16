'use client';

import { useQuery } from '@apollo/client/react';
import { QUESTS_QUERY } from '@/features/quests/api/quests.query';
import Link from 'next/link';

// Определяем тип для квеста
type Quest = {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: number;
  reward: number;
  creator: {
    id: string;
    name: string;
  };
  createdAt: string;
};

// Тип для ответа запроса
type QuestsQueryResponse = {
  quests: Quest[];
};

export default function QuestsPage() {
  const { data, loading, error } = useQuery<QuestsQueryResponse>(QUESTS_QUERY);

  if (loading) return <p>Loading quests...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Все квесты</h1>
      {data?.quests.map((quest) => (
        <Link key={quest.id} href={`/quests/${quest.id}`}>
          <div className="border p-4 rounded hover:bg-gray-100 cursor-pointer">
            <h2 className="font-bold text-lg">{quest.title}</h2>
            <p>{quest.description}</p>
            <p>
              <strong>Создатель:</strong> {quest.creator.name} |{' '}
              <strong>Награда:</strong> {quest.reward} pts
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

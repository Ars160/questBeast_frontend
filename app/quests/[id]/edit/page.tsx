'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { useParams, useRouter } from 'next/navigation';
import { QUEST_QUERY } from '@/features/quests/api/quest.query';
import { UPDATE_QUEST_MUTATION } from '@/features/quests/api/updateQuest.mutation';
import { useState } from 'react';

type Quest = {
  id: string;
  title: string;
  description: string;
};

type QuestQueryResponse = { quest: Quest };
type UpdateQuestResponse = { updateQuest: Quest };

export default function EditQuestPage() {
  const params = useParams();
  const questId = params.id as string;
  const router = useRouter();

  const { data, loading, error } = useQuery<QuestQueryResponse>(QUEST_QUERY, {
    variables: { id: questId },
  });

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [updateQuest, { loading: updating }] = useMutation<UpdateQuestResponse>(
    UPDATE_QUEST_MUTATION,
    {
      onCompleted: () => router.push(`/quests/${questId}`),
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.quest) return <p>Quest not found</p>;

  // Инициализируем state при загрузке
  if (!title) setTitle(data.quest.title);
  if (!description) setDescription(data.quest.description);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateQuest({ variables: { id: questId, title, description } });
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Edit Quest</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full border p-2"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border p-2"
          rows={5}
          required
        />
        <button
          type="submit"
          className="w-full bg-black text-white py-2"
          disabled={updating}
        >
          {updating ? 'Updating...' : 'Update Quest'}
        </button>
      </form>
    </div>
  );
}

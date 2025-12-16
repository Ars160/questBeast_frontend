'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useParams, useRouter } from 'next/navigation';
import { QUEST_QUERY } from '@/features/quests/api/quest.query';
import SubmissionForm from '@/features/submissions/SubmissionForm';
import GradeSubmissionForm from '@/features/submissions/GradeSubmissionForm'; // форма оценки

type User = { id: string; name: string };
type Submission = { id: string; content: string; grade: number; feedback?: string; author: User };
type Quest = {
  id: string;
  title: string;
  description: string;
  subject: string;
  difficulty: number;
  reward: number;
  creator: User;
  submissions: Submission[];
};
type QuestQueryResponse = { quest: Quest };

export default function QuestPage() {
  const router = useRouter();
  const params = useParams();
  const questId = params.id as string;

  const { data, loading, error, refetch } = useQuery<QuestQueryResponse>(QUEST_QUERY, {
    variables: { id: questId },
  });

  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  if (loading) return <p>Loading quest...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data?.quest) return <p>Quest not found</p>;

  const { quest } = data;

  // Приведение всех ID к строке, безопасно для TS
  const safeQuest = {
    ...quest,
    id: String(quest.id),
    submissions:
      quest.submissions
        ?.filter((sub) => sub && sub.id && sub.author)
        .map((sub) => ({
          ...sub,
          id: typeof sub.id === 'string' ? sub.id : String(sub.id),
          author: {
            ...sub.author,
            id: typeof sub.author.id === 'string' ? sub.author.id : String(sub.author.id),
          },
        })) || [],
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">{safeQuest.title}</h1>
      <p>{safeQuest.description}</p>
      <p>
        <strong>Создатель:</strong> {safeQuest.creator.name} | <strong>Награда:</strong> {safeQuest.reward} pts
      </p>

      {/* Кнопки */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowSubmissionForm((prev) => !prev)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {showSubmissionForm ? 'Закрыть форму' : 'Добавить submission'}
        </button>
        <button
          onClick={() => router.push(`/quests/${safeQuest.id}/edit`)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Редактировать квест
        </button>
      </div>

      {/* Форма для создания submission */}
      {showSubmissionForm && (
        <SubmissionForm questId={safeQuest.id} refreshSubmissions={() => refetch()} />
      )}

      {/* Список submissions */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Submissions</h2>
        {safeQuest.submissions.length === 0 && <p>Нет отправок</p>}
        {safeQuest.submissions.map((sub) => (
          <div key={sub.id} className="border p-3 rounded mb-2">
            <p>{sub.content}</p>
            <p>
              <strong>Автор:</strong> {sub.author.name} | <strong>Оценка:</strong> {sub.grade}
            </p>

            {/* Форма оценки */}
            <GradeSubmissionForm
              submissionId={sub.id}
              currentGrade={sub.grade}
              currentFeedback={sub.feedback || ''}
              onGraded={() => refetch()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

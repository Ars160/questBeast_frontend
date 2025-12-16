'use client';

import { useQuery, useMutation } from '@apollo/client/react';
import { useParams, useRouter } from 'next/navigation';
import { QUEST_QUERY } from '@/features/quests/api/quest.query';
import { UPDATE_QUEST_MUTATION } from '@/features/quests/api/updateQuest.mutation';
import { useEffect, useState } from 'react';
import withAuth from '../../../auth/withAuth';

type Quest = {
  id: string;
  title: string;
  description: string;
};

type QuestQueryResponse = { quest: Quest };
type UpdateQuestResponse = { updateQuest: Quest };

function EditQuestPage() {
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

  // Инициализируем state, когда пришёл квест
  useEffect(() => {
    if (data?.quest) {
      setTitle(data.quest.title);
      setDescription(data.quest.description);
    }
  }, [data?.quest]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-900/40 flex items-center justify-center">
      <div className="text-purple-300 animate-pulse text-xl">Загружаем свиток квеста…</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-900/40 flex items-center justify-center">
      <div className="text-red-400 text-lg">Ошибка: {error.message}</div>
    </div>
  );

  if (!data?.quest) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-900/40 flex items-center justify-center">
      <div className="text-slate-400 text-lg">Квест не найден</div>
    </div>
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateQuest({ variables: { id: questId, title, description } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-900/40 text-slate-50 flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(168,85,247,0.2),_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-500/20 ring-4 ring-purple-500/60 shadow-[0_0_40px_rgba(168,85,247,0.7)]">
            <span className="text-2xl">✏️</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            Редактировать квест
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Подправь легенду, сохрани баланс сложности и награды
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-3xl border border-purple-500/20 bg-slate-900/70 px-8 py-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.9)]"
        >
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-purple-300">
              Название
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-purple-300">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 min-h-[140px]"
              rows={5}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(168,85,247,0.8)] hover:shadow-[0_0_40px_rgba(168,85,247,1)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-70"
            disabled={updating}
          >
            {updating ? 'Сохраняем изменения…' : 'Сохранить квест'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default withAuth(EditQuestPage);

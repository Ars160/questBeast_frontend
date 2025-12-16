'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client/react';
import { useParams, useRouter } from 'next/navigation';
import { QUEST_QUERY } from '@/features/quests/api/quest.query';
import { ME_QUERY } from '@/features/auth/api/me.query';
import { NEW_SUBMISSION_SUBSCRIPTION } from '@/features/submissions/api/newSubmission.subscription';
import SubmissionForm from '@/features/submissions/SubmissionForm';
import GradeSubmissionForm from '@/features/submissions/GradeSubmissionForm';
import { DELETE_SUBMISSION_MUTATION } from '@/features/submissions/api/deleteSubmission.mutation';

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
type MeQueryResponse = { me: User | null };
type SubscriptionData = { newSubmission: Submission };

export default function QuestPage() {
  const router = useRouter();
  const params = useParams();
  const questId = params.id as string;

  const { data: questData, loading, error, refetch } = useQuery<QuestQueryResponse>(QUEST_QUERY, {
    variables: { id: questId },
  });

  const { data: meData } = useQuery<MeQueryResponse>(ME_QUERY);

  const { data: subData } = useSubscription<SubscriptionData>(NEW_SUBMISSION_SUBSCRIPTION, {
    variables: { questId },
    skip: !questId,
  });

  const [deleteSubmission, { loading: deleting }] = useMutation(DELETE_SUBMISSION_MUTATION);

  const [showSubmissionForm, setShowSubmissionForm] = useState(false);

  useEffect(() => {
    if (subData?.newSubmission) {
      console.log('🔔 Новый submission!', subData.newSubmission);
      refetch();
    }
  }, [subData, refetch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 flex items-center justify-center">
        <div className="text-emerald-400 animate-pulse text-2xl flex items-center gap-2">
          ⚔️ Загружаем древний свиток...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 flex items-center justify-center">
        <div className="max-w-md p-8 text-center text-red-400 backdrop-blur-xl rounded-3xl border border-red-500/30">
          <span className="text-4xl mb-4 block">📜❌</span>
          <h2 className="text-xl font-bold mb-2">Квест потерян во тьме</h2>
          <p className="text-slate-400">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!questData?.quest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 flex items-center justify-center">
        <div className="text-slate-400 text-xl">Квест не найден в архивах...</div>
      </div>
    );
  }

  const { quest } = questData;
  const currentUser = meData?.me;

  const isOwner = currentUser?.id === quest.creator.id;

  const safeQuest: Quest = {
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

  const canDelete = (sub: Submission) =>
    currentUser && sub.author.id === currentUser.id;

  const handleDelete = async (submissionId: string) => {
    try {
      await deleteSubmission({ variables: { id: submissionId } });
      await refetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 text-slate-50 py-12 px-4">
      {/* Фоновая подсветка */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(16,185,129,0.15),_transparent_60%)]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Заголовок квеста */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-emerald-500/20 to-purple-500/20 ring-4 ring-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.6)]">
            <span className="text-3xl">📜</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-100 to-emerald-400 bg-clip-text text-transparent mb-3">
            {safeQuest.title}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {safeQuest.description}
          </p>
        </div>

        {/* Инфо о квесте */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-8 backdrop-blur-xl">
            <div className="flex flex-wrap gap-4 text-sm mb-6">
              <div
                className={`px-4 py-2 rounded-xl font-mono font-bold ${
                  safeQuest.difficulty <= 3
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : safeQuest.difficulty <= 6
                    ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                    : 'bg-red-500/20 text-red-400 border-red-500/50'
                } border`}
              >
                Сложность {safeQuest.difficulty}/5
              </div>
              <div className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl font-mono font-bold border border-emerald-500/40">
                Награда {safeQuest.reward} XP
              </div>
              <div className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-xl font-mono border border-purple-500/40">
                {safeQuest.subject}
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-xs font-bold">
                👤
              </span>
              <span>
                Создатель:{' '}
                <span className="font-semibold text-slate-200">{safeQuest.creator.name}</span>
              </span>
            </div>
          </div>

          {/* КНОПКИ ДЕЙСТВИЙ — ТОЛЬКО ДЛЯ ВЛАДЕЛЬЦА */}
          <div className="space-y-4">
            <button
              onClick={() => setShowSubmissionForm((prev) => !prev)}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 px-6 py-4 rounded-2xl font-bold shadow-[0_0_25px_rgba(16,185,129,0.6)] hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] transition-all duration-300 hover:scale-[1.02]"
            >
              {showSubmissionForm ? '❌ Закрыть форму' : '⚔️ Принять вызов'}
            </button>

            {isOwner && (
              <button
                onClick={() => router.push(`/quests/${safeQuest.id}/edit`)}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-slate-950 px-6 py-4 rounded-2xl font-bold shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:shadow-[0_0_35px_rgba(168,85,247,0.8)] transition-all duration-300"
              >
                ✏️ Редактировать (твой)
              </button>
            )}
          </div>
        </div>

        {/* Форма для создания submission */}
        {showSubmissionForm && (
          <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/70 p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.95)] mb-12">
            <SubmissionForm questId={safeQuest.id} refreshSubmissions={() => refetch()} />
          </div>
        )}

        {/* Список submissions */}
        <div>
          <h2 className="text-2xl font-black mb-8 flex items-center gap-3 bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
            🛡️ Доска Чести ({safeQuest.submissions.length})
            <div className="flex items-center gap-1 text-emerald-400 text-sm ml-4">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>LIVE</span>
            </div>
          </h2>

          {safeQuest.submissions.length === 0 ? (
            <div className="text-center py-16 rounded-3xl bg-slate-900/50 backdrop-blur-xl border-2 border-dashed border-slate-700/50">
              <div className="text-6xl mb-6 opacity-40">🛡️</div>
              <h3 className="text-xl font-semibold text-slate-400 mb-2">Никто ещё не принял вызов</h3>
              <p className="text-slate-500">Будь первым героем!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {safeQuest.submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="group rounded-3xl border border-slate-800/50 bg-slate-900/70 p-6 backdrop-blur-xl hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold">🧙</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-100">{sub.author.name}</div>
                        <div className="text-xs text-slate-500">{new Date().toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-xl text-sm font-bold ${
                        sub.grade >= 8
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                          : sub.grade >= 5
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                          : 'bg-red-500/20 text-red-400 border-red-500/50'
                      } border`}
                    >
                      {sub.grade}/10
                    </div>
                  </div>

                  <p className="text-slate-200 mb-4 whitespace-pre-wrap leading-relaxed">
                    {sub.content}
                  </p>

                  {sub.feedback && (
                    <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 p-4 rounded-2xl border border-emerald-500/30 mb-4">
                      <p className="text-sm text-emerald-300 italic">«{sub.feedback}»</p>
                    </div>
                  )}

                  {/* Изменить + Удалить сабмишн */}
                 <div className="mt-3 w-full flex flex-col gap-3">
  <GradeSubmissionForm
    submissionId={sub.id}
    currentGrade={sub.grade}
    currentFeedback={sub.feedback || ''}
    onGraded={() => refetch()}
  />

  {canDelete(sub) && (
    <button
      disabled={deleting}
      onClick={() => handleDelete(sub.id)}
      className="
        w-full h-11
        flex items-center justify-center gap-2
        rounded-2xl
        bg-red-500/10 text-red-300
        border border-red-500/30
        hover:bg-red-500/20 hover:border-red-400
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all duration-200
      "
    >
      <span className="text-base">🗑</span>
      <span className="font-medium">Удалить </span>
    </button>
  )}
</div>


                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

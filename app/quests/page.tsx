'use client';

import { useQuery } from '@apollo/client/react';
import { QUESTS_QUERY } from '@/features/quests/api/quests.query';
import Link from 'next/link';

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

type QuestsQueryResponse = {
  quests: Quest[];
};

export default function QuestsPage() {
  const { data, loading, error } = useQuery<QuestsQueryResponse>(QUESTS_QUERY);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 flex items-center justify-center">
      <div className="text-emerald-400 animate-pulse text-xl">🔍 Ищем эпические квесты...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 flex items-center justify-center">
      <div className="text-red-400 text-lg max-w-md text-center p-8">
        ⚠️ Ошибка загрузки квестов: {error.message}
      </div>
    </div>
  );

  const quests = data?.quests || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 text-slate-50 py-12 px-4">
      {/* Фоновая подсветка */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_80%,_rgba(16,185,129,0.15),_transparent_60%)]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/20 ring-4 ring-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.6)]">
            <span className="text-2xl">📜</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
            Книга Квестов
          </h1>
          <p className="mt-2 text-lg text-slate-400">Выбери задание и докажи свою силу</p>
        </div>

        {/* Сетка квестов */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quests.map((quest) => (
            <Link key={quest.id} href={`/quests/${quest.id}`} className="group">
              <div className="group-hover:scale-[1.02] transition-all duration-300 rounded-3xl border border-emerald-500/20 bg-slate-900/70 p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.9)] hover:shadow-[0_25px_100px_rgba(16,185,129,0.3)] hover:border-emerald-400/50">
                
                {/* Сложность */}
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    quest.difficulty <= 3 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' :
                    quest.difficulty <= 6 ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                    'bg-red-500/20 text-red-400 border-red-500/50'
                  } border`}>
                    {quest.difficulty}/5
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-400">{quest.reward}</div>
                    <div className="text-xs text-emerald-400/70 uppercase tracking-wide">XP</div>
                  </div>
                </div>

                {/* Название */}
                <h2 className="text-xl font-black text-slate-100 mb-3 leading-tight group-hover:text-emerald-300 transition-colors">
                  {quest.title}
                </h2>

                {/* Описание */}
                <p className="text-sm text-slate-300 mb-4 line-clamp-3 leading-relaxed">
                  {quest.description}
                </p>

                {/* Предмет */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800/50 rounded-xl text-xs font-mono text-slate-400 mb-4">
                  <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-emerald-400 rounded-full"></span>
                  {quest.subject}
                </div>

                {/* Создатель */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
                  <span className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">👤</span>
                  <span>{quest.creator.name}</span>
                </div>

                {/* Кнопка действия */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-mono">
                    {new Date(quest.createdAt).toLocaleDateString()}
                  </span>
                  <div className="group-hover:translate-x-2 transition-transform duration-300">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 text-slate-950 rounded-xl font-semibold text-sm shadow-lg hover:shadow-[0_0_20px_rgba(16,185,129,0.6)] backdrop-blur-sm">
                      Принять квест
                      <span className="text-lg">⚔️</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {quests.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6 opacity-30">📜</div>
            <h2 className="text-2xl font-black text-slate-400 mb-4">Квесты ещё не созданы</h2>
            <p className="text-slate-500 max-w-md mx-auto">Будь первым, кто проложит путь через неизведанные земли QuestBeast</p>
          </div>
        )}
      </div>
    </div>
  );
}

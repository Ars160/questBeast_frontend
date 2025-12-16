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

  if (loading && !subscriptionData) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 flex items-center justify-center">
      <div className="text-emerald-400 animate-pulse text-xl">Загрузка таблицы лидеров...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 flex items-center justify-center">
      <div className="text-red-400 text-lg">Ошибка: {error.message}</div>
    </div>
  );
  
  if (leaderboard.length === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 flex items-center justify-center">
      <div className="text-slate-400 text-lg">🏆 Лидеров пока нет — будь первым!</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 text-slate-50 py-12 px-4">
      {/* Фоновая подсветка */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_10%,_rgba(16,185,129,0.2),_transparent_60%)]" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-12">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/20 ring-4 ring-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.6)]">
            <span className="text-2xl">🏆</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-emerald-300 to-emerald-500 bg-clip-text text-transparent">
            Таблица Лидеров
          </h1>
          <p className="mt-2 text-lg text-slate-400">Live обновления • QuestBeast Arena</p>
        </div>

        {/* Таблица лидеров */}
        <div className="bg-slate-900/70 backdrop-blur-xl rounded-3xl border border-emerald-500/20 shadow-[0_25px_100px_rgba(15,23,42,0.95)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-b border-emerald-500/30">
                  <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-wider text-emerald-300">
                    Место
                  </th>
                  <th className="px-6 py-5 text-left text-xs font-black uppercase tracking-wider text-emerald-300">
                    Воин
                  </th>
                  <th className="px-6 py-5 text-right text-xs font-black uppercase tracking-wider text-emerald-300">
                    Очки
                  </th>
                  <th className="px-6 py-5 text-right text-xs font-black uppercase tracking-wider text-emerald-300 w-28">
                    Период
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {leaderboard.map((item, index) => (
                  <tr 
                    key={item.id} 
                    className={`group hover:bg-slate-800/50 transition-all duration-200 ${
                      index === 0 ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border-emerald-500/50' : ''
                    }`}
                  >
                    <td className="px-6 py-5">
                      <div className={`flex items-center gap-2 font-black text-xl ${
                        index === 0 ? 'text-emerald-400 drop-shadow-lg' : 'text-slate-400'
                      }`}>
                        {index === 0 ? '👑' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${item.rank}`}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${
                          index === 0 ? 'from-emerald-500/30 to-emerald-400/30' : 'from-slate-700/50 to-slate-600/50'
                        } flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                          <span className="text-sm font-bold">⚔️</span>
                        </div>
                        <span className="font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                          {item.user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="text-2xl font-black bg-gradient-to-r from-emerald-400 to-emerald-500 bg-clip-text text-transparent drop-shadow-lg">
                        {item.score.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider">XP</div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <span className="px-3 py-1 bg-slate-800/50 text-xs font-mono rounded-full text-slate-400">
                        {item.period}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Подпись о live-обновлениях */}
          <div className="px-6 py-4 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 border-t border-emerald-500/20">
            <p className="text-center text-xs text-emerald-400 font-mono">
              🔴 Live • Обновляется в реальном времени
            </p>
          </div>
        </div>

        {/* Статистика снизу */}
        <div className="mt-8 text-center text-sm text-slate-500">
          Всего бойцов: <span className="font-mono text-emerald-400">{leaderboard.length}</span>
        </div>
      </div>
    </div>
  );
}

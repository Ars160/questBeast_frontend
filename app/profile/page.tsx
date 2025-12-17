'use client';

import { useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { ME_QUERY } from '@/features/auth/api/me.query';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { client } from '@/shared/apollo/client';
import { useRouter } from 'next/navigation';
import withAuth from '../auth/withAuth';

function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  const getMonsterIcon = (points: number) => {
    if (points > 1000) return '🐉';  
    if (points > 100) return '👹';  
    return '🧌';                    
  };

  const getMonsterName = (points: number) => {
    if (points > 1000) return 'Dragon';
    if (points > 100) return 'Orc';
    return 'Goblin';
  };

  useEffect(() => {
    if (!user) {
      client
        .query({ query: ME_QUERY, fetchPolicy: 'no-cache' })
        .then((res: any) => {
          if (res.data?.me) setUser(res.data.me);
        })
        .catch(() => {});
    }
  }, [user, setUser, router]);

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 flex items-center justify-center">
      <div className="text-slate-400 animate-pulse">Загрузка профиля...</div>
    </div>
  );

  const monster = user.monster;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 text-slate-50 flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,_rgba(16,185,129,0.15),_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500/10 ring-4 ring-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.5)]">
            <span className="text-3xl">👤</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-slate-100 to-emerald-300 bg-clip-text text-transparent">
            {user.name}
          </h1>
          <p className="mt-1 text-sm text-slate-400">Воин QuestBeast</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/70 px-8 py-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.9)]">
            <h2 className="text-lg font-semibold text-emerald-400 mb-6 flex items-center">
              <span className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
              Статистика
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-400">Уровень</span>
                <span className="text-2xl font-black text-emerald-400">{user.level}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-sm text-slate-400">Баллы</span>
                <div>
                  <div className="text-3xl font-black text-emerald-500">{user.points}</div>
                  <div className="text-xs text-emerald-400/70">XP</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Email</span>
                <span className="text-sm font-mono text-slate-300">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-400">Статус</span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
                  {user.isActive ? 'Активен' : 'Неактивен'}
                </span>
              </div>
            </div>
          </div>

          {monster ? (
            <div className="rounded-3xl border border-purple-500/20 bg-slate-900/70 px-8 py-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.9)]">
              <h2 className="text-lg font-semibold text-purple-400 mb-6 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2 animate-pulse"></span>
                Твой зверь
              </h2>
              <div className="text-center mb-6">
                <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-r from-purple-500/20 to-emerald-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-4">
                  <span className="text-3xl drop-shadow-lg">
                    {getMonsterIcon(user.points)}
                  </span>
                </div>
                <h3 className="text-xl font-black text-purple-400">
                  {getMonsterName(user.points)}
                </h3>
                <p className="text-xs text-slate-500 uppercase tracking-wide">{monster.evolutionStage}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Уровень</span>
                  <span className="font-mono text-sm font-bold text-purple-400">{monster.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-400">Голод</span>
                  <div className="w-20 bg-slate-800 rounded-full h-2">
                    <div className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full" style={{width: `${monster.hunger}%`}}></div>
                  </div>
                  <span className="text-xs font-mono">{monster.hunger}%</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-sm text-slate-400">Множитель XP</span>
                  <span className="text-lg font-black bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                    x{monster.multiplier.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-slate-700/50 bg-slate-900/50 p-8 text-center backdrop-blur-xl">
              <div className="text-4xl mb-4 opacity-50">🐣</div>
              <h3 className="text-xl font-semibold text-slate-400 mb-2">Зверь спит</h3>
              <p className="text-sm text-slate-500">Заверши первые квесты, чтобы пробудить питомца</p>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => {
              logout();
              router.push('/auth/login');
            }}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-slate-800 to-slate-700 text-slate-200 rounded-2xl font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(148,163,184,0.3)] hover:from-slate-700 hover:to-slate-600 transition-all duration-300 group"
          >
            <span className="mr-2">🚪</span>
            Покинуть логово
            <span className="ml-2 w-2 h-2 bg-slate-400 rounded-full group-hover:bg-slate-200 transition-colors"></span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default withAuth(ProfilePage);

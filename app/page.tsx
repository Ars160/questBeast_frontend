'use client';

import Link from 'next/link';
import { useAuthStore } from '@/shared/store/useAuthStore';

export default function HomePage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 text-slate-50">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.3),transparent_50%)]" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/20 ring-4 ring-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.8)]">
            <span className="text-4xl">🏰</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-emerald-300 to-purple-400 bg-clip-text text-transparent mb-6">
            Quest<span className="text-emerald-400">Beast</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
            Прокачивай монстра. Проходи квесты. Стань легендой арены.
          </p>
          
          {!user ? (
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-3 px-10 py-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 rounded-3xl font-black text-xl shadow-[0_0_40px_rgba(16,185,129,0.9)] hover:shadow-[0_0_60px_rgba(16,185,129,1)] transition-all hover:scale-105"
            >
              ⚔️ Вступить в битву
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/quests" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-emerald-500 text-slate-950 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all">
                📜 Квесты
              </Link>
              <Link href="/profile" className="px-8 py-4 bg-slate-800/50 text-slate-200 rounded-2xl font-bold backdrop-blur-sm hover:bg-slate-700/50 transition-all">
                👤 {user.name}
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Статистика (если авторизован) */}
      {user && (
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Очки */}
            <div className="text-center p-8 rounded-3xl bg-gradient-to-b from-slate-900/70 to-slate-950/50 backdrop-blur-xl border border-emerald-500/20 shadow-2xl">
              <div className="text-4xl font-black text-emerald-400 mb-2">{user.points}</div>
              <div className="text-sm text-emerald-300 uppercase tracking-wide font-bold">Очков XP</div>
            </div>
            
            {/* Уровень */}
            <div className="text-center p-8 rounded-3xl bg-gradient-to-b from-slate-900/70 to-slate-950/50 backdrop-blur-xl border border-purple-500/20 shadow-2xl">
              <div className="text-4xl font-black text-purple-400 mb-2">{user.level}</div>
              <div className="text-sm text-purple-300 uppercase tracking-wide font-bold">Уровень</div>
            </div>
            
            {/* Быстрые действия */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-500/10 to-purple-500/10 backdrop-blur-xl border border-emerald-500/30 shadow-2xl">
              <h3 className="text-lg font-bold text-emerald-300 mb-6">Твои действия</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Link href="/quests" className="group p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-all group-hover:scale-105">
                  <span className="block font-bold text-emerald-400 group-hover:text-emerald-300">📜</span>
                  <span>Квесты</span>
                </Link>
                <Link href="/leaderboard" className="group p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-all group-hover:scale-105">
                  <span className="block font-bold text-purple-400 group-hover:text-purple-300">🏆</span>
                  <span>Лидерборд</span>
                </Link>
                <Link href="/profile" className="group p-4 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 transition-all group-hover:scale-105">
                  <span className="block font-bold text-slate-300 group-hover:text-slate-200">👤</span>
                  <span>Профиль</span>
                </Link>
                <Link href="/quests/create" className="group p-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 transition-all group-hover:scale-105 border border-emerald-500/50">
                  <span className="block font-bold text-emerald-400 group-hover:text-emerald-300">+</span>
                  <span>Создать</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

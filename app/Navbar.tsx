'use client';

import Link from 'next/link';
import { useAuthStore } from '@/shared/store/useAuthStore';

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <nav className="backdrop-blur-xl bg-slate-900/90 border-b border-slate-800/50 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Логотип */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-black bg-gradient-to-r from-emerald-400 via-purple-400 to-emerald-500 bg-clip-text text-transparent hover:scale-105 transition-all">
            🏰 Quest<span className="text-emerald-400">Beast</span>
          </Link>
          
          {/* Навигация */}
          <div className="flex items-center gap-1">
            {user ? (
              <>
                <Link 
                  href="/quests" 
                  className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/70 backdrop-blur-sm text-sm font-semibold text-slate-200 transition-all hover:scale-105"
                >
                  📜 Квесты
                </Link>
                <Link 
                  href="/leaderboard" 
                  className="px-4 py-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/70 backdrop-blur-sm text-sm font-semibold text-slate-200 transition-all hover:scale-105"
                >
                  🏆 Лидерборд
                </Link>
                <Link 
                  href="/profile" 
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-purple-500/20 text-emerald-300 font-semibold backdrop-blur-sm transition-all hover:scale-105"
                >
                  👤 {user.name}
                </Link>
                <button 
                  onClick={logout}
                  className="px-5 py-2 ml-1 bg-gradient-to-r from-red-500/90 to-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  🚪 Выйти
                </button>
              </>
            ) : (
              <Link 
                href="/auth/login" 
                className="px-7 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] transition-all hover:scale-105"
              >
                ⚔️ Войти в битву
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

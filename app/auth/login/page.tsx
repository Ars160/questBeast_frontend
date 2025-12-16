'use client';

import { useMutation } from '@apollo/client/react';
import { LOGIN_MUTATION } from '@/features/auth/api/login.mutation';
import { ME_QUERY } from '@/features/auth/api/me.query';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { client } from '@/shared/apollo/client';

type LoginResponse = { login: string };
type LoginVariables = { email: string; password: string };
type MeResponse = { me: any };

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [login, { loading }] = useMutation<LoginResponse, LoginVariables>(
    LOGIN_MUTATION,
    {
      onCompleted: async (data) => {
        if (!data.login) return;

        setToken(data.login);

        const res = await client.query<MeResponse>({
          query: ME_QUERY,
          fetchPolicy: 'no-cache',
        });

        setUser(res.data?.me);
        router.push('/');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;

    if (!email || !password) {
      alert('Email и пароль обязательны');
      return;
    }

    login({ variables: { email, password } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900/40 text-slate-50 flex items-center justify-center px-4">
      {/* Светящееся пятно за карточкой */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.25),_transparent_55%)]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Лого / название */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 ring-2 ring-emerald-500/60 shadow-[0_0_40px_rgba(16,185,129,0.6)]">
            <span className="text-2xl">🐲</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-slate-100">Quest</span>
            <span className="text-emerald-400">Beast</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Войди, чтобы прокачивать монстра и закрывать квесты.
          </p>
        </div>

        {/* Карточка логина */}
        <div className="rounded-2xl border border-emerald-500/20 bg-slate-900/60 px-6 py-7 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium uppercase tracking-wide text-slate-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="hunter@questbeast.gg"
                className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium uppercase tracking-wide text-slate-300"
              >
                Пароль
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-700/70 bg-slate-950/70 px-3 py-2.5 text-sm text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.8)] transition hover:bg-emerald-400 hover:shadow-[0_0_40px_rgba(16,185,129,0.9)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Входим в логово…' : 'Войти в QuestBeast'}
            </button>
          </form>

          {/* Кнопка регистрации */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-center text-xs text-slate-400 mb-3">
              Нет аккаунта? Создай своего зверя!
            </p>
            <a
              href="/auth/register"
              className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-purple-500/80 to-emerald-500/80 px-4 py-2.5 text-sm font-semibold text-slate-950 backdrop-blur-sm shadow-[0_0_25px_rgba(168,85,247,0.6)] hover:shadow-[0_0_35px_rgba(168,85,247,0.8)] transition-all duration-300 hover:scale-[1.02]"
            >
              <span className="mr-2">⚔️</span>
              Создать аккаунт
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

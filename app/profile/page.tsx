'use client';

import { useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { ME_QUERY } from '@/features/auth/api/me.query';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { client } from '@/shared/apollo/client';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!user) {
      client
        .query({ query: ME_QUERY, fetchPolicy: 'no-cache' })
        .then((res: any) => {
          if (res.data?.me) setUser(res.data.me);
          else router.push('/auth/login');
        })
        .catch(() => router.push('/auth/login'));
    }
  }, [user, setUser, router]);

  if (!user) return <p>Loading...</p>;

  const monster = user.monster;

  return (
    <div className="max-w-md mx-auto mt-10 border p-6 rounded shadow space-y-4">
      <h1 className="text-2xl font-bold mb-4">Профиль</h1>

      <p><strong>Имя:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Уровень:</strong> {user.level}</p>
      <p><strong>Баллы:</strong> {user.points}</p>
      <p><strong>Активен:</strong> {user.isActive ? 'Да' : 'Нет'}</p>

      {monster && (
        <div className="border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Монстр</h2>
          <p><strong>Имя:</strong> {monster.name}</p>
          <p><strong>Уровень:</strong> {monster.level}</p>
          <p><strong>Голод:</strong> {monster.hunger}</p>
          <p><strong>Множитель:</strong> {monster.multiplier.toFixed(2)}</p>
          <p><strong>Стадия:</strong> {monster.evolutionStage}</p>
        </div>
      )}

      <button
        onClick={() => {
          logout();
          router.push('/auth/login');
        }}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
      >
        Выйти
      </button>
    </div>
  );
}

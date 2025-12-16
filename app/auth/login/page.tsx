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

  const [login] = useMutation<LoginResponse, LoginVariables>(LOGIN_MUTATION, {
    onCompleted: async (data) => {
      if (!data.login) return;

      setToken(data.login);

      const res = await client.query<MeResponse>({ query: ME_QUERY, fetchPolicy: 'no-cache' });
      console.log(res.data?.me);
      
      setUser(res.data?.me);

      router.push('/');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value.trim();
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;

    if (!email || !password) {
      alert('Email и пароль обязательны');
      return;
    }

    console.log(email, password);
    

    login({ variables: { email, password } });
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="email" type="email" placeholder="Email" className="w-full border p-2" required />
        <input name="password" type="password" placeholder="Password" className="w-full border p-2" required />
        <button className="w-full bg-black text-white py-2">Login</button>
      </form>
    </div>
  );
}

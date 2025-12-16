'use client';

import { useMutation } from '@apollo/client/react';
import { REGISTER_MUTATION } from '@/features/auth/api/register.mutation';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [register] = useMutation(REGISTER_MUTATION, {
    onCompleted: () => router.push('/auth/login'),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  register({
    variables: {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    },
  });
};


  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Name" className="w-full border p-2" required />
        <input name="email" type="email" placeholder="Email" className="w-full border p-2" required />
        <input name="password" type="password" placeholder="Password" className="w-full border p-2" required />
        <button className="w-full bg-black text-white py-2">Register</button>
      </form>
    </div>
  );
}

'use client';

import { useMutation } from '@apollo/client/react';
import { CREATE_QUEST_MUTATION } from '@/features/quests/api/createQuest.mutation';
import { useRouter } from 'next/navigation';

export default function CreateQuestPage() {
  const router = useRouter();

  const [createQuest] = useMutation(CREATE_QUEST_MUTATION, {
    onCompleted: () => router.push('/quests'),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const title = (form.elements.namedItem('title') as HTMLInputElement).value.trim();
    const description = (form.elements.namedItem('description') as HTMLInputElement).value.trim();
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value.trim();
    const difficulty = parseInt((form.elements.namedItem('difficulty') as HTMLInputElement).value);
    const reward = parseInt((form.elements.namedItem('reward') as HTMLInputElement).value);

    createQuest({ variables: { title, description, subject, difficulty, reward } });
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Создать квест</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Название" className="w-full border p-2" required />
        <input name="description" placeholder="Описание" className="w-full border p-2" required />
        <input name="subject" placeholder="Тема" className="w-full border p-2" required />
        <input name="difficulty" type="number" min="1" max="5" placeholder="Сложность" className="w-full border p-2" required />
        <input name="reward" type="number" min="10" placeholder="Награда" className="w-full border p-2" required />
        <button className="w-full bg-green-500 text-white py-2">Создать</button>
      </form>
    </div>
  );
}

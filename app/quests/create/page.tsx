'use client';

import { useMutation } from '@apollo/client/react';
import { useRef } from 'react'; 
import { CREATE_QUEST_MUTATION } from '@/features/quests/api/createQuest.mutation';
import { useRouter } from 'next/navigation';

export default function CreateQuestPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null); // ✅ useRef для формы

  const [createQuest, { loading }] = useMutation(CREATE_QUEST_MUTATION, {
    onCompleted: () => router.push('/quests'),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const title = (form.elements.namedItem('title') as HTMLInputElement).value.trim();
    const description = (form.elements.namedItem('description') as HTMLInputElement).value.trim();
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value.trim();
    const difficultyStr = (form.elements.namedItem('difficulty') as HTMLInputElement).value;
    const rewardStr = (form.elements.namedItem('reward') as HTMLInputElement).value;

    const difficulty = parseInt(difficultyStr);
    const reward = parseInt(rewardStr);

    if (!title || !description || !subject || isNaN(difficulty) || isNaN(reward)) {
      alert('Заполни все поля корректно');
      return;
    }

    if (difficulty < 1 || difficulty > 10 || reward < 10) {
      alert('Сложность 1-10, награда минимум 10');
      return;
    }

    console.log('📤 Отправляем:', { title, description, subject, difficulty, reward });

    createQuest({ 
      variables: { title, description, subject, difficulty, reward } 
    });
  };

  // ✅ Функция синхронизации слайдера
  const syncSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formRef.current) {
      const difficultyInput = formRef.current.elements.namedItem('difficulty') as HTMLInputElement;
      difficultyInput.value = e.target.value;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-900/40 text-slate-50 flex items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_80%,_rgba(168,85,247,0.2),_transparent_60%)]" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-purple-500/20 to-emerald-500/20 ring-4 ring-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.6)]">
            <span className="text-3xl">📜</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-slate-100 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
            Создать Квест
          </h1>
          <p className="mt-3 text-lg text-slate-400 max-w-md mx-auto">
            Напиши легенду, которую другие будут проходить
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-bold uppercase tracking-wide text-purple-300">
              Название легенды
            </label>
            <input
              id="title"
              name="title"
              placeholder="Уничтожить дракона в пещере..."
              className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 px-5 py-4 text-lg font-semibold text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-bold uppercase tracking-wide text-purple-300">
              Эпическое описание
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Воин должен пройти через тёмный лес, сразиться с древним стражем и добыть священный артефакт..."
              className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 px-5 py-4 text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 resize-vertical transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-bold uppercase tracking-wide text-purple-300">
              Предмет квеста
            </label>
            <input
              id="subject"
              name="subject"
              placeholder="Алхимия, Кузнечное дело, Магия огня..."
              className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/70 px-5 py-4 text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="difficulty" className="text-sm font-bold uppercase tracking-wide text-purple-300">
                Сложность
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  defaultValue="5"
                  onInput={syncSlider} // ✅ Теперь работает!
                  className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
                />
                <input
                  name="difficulty"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="5"
                  className="w-full rounded-xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-center text-lg font-mono text-purple-400 focus:border-purple-400"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="reward" className="text-sm font-bold uppercase tracking-wide text-purple-300">
                Награда XP
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="reward"
                  name="reward"
                  type="number"
                  min="10"
                  max="1000"
                  placeholder="100"
                  className="flex-1 rounded-xl border border-slate-700/70 bg-slate-950/70 px-4 py-3 text-lg font-mono text-emerald-400 focus:border-emerald-400"
                  required
                />
                <span className="text-2xl font-black text-emerald-400">✨</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-purple-500 via-purple-500 to-emerald-500 text-slate-950 rounded-3xl font-black text-lg shadow-[0_0_40px_rgba(168,85,247,0.8)] hover:shadow-[0_0_60px_rgba(168,85,247,1)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Создаём легенду...
              </>
            ) : (
              <>
                <span>⚡</span>
                Выпустить квест в мир
              </>
            )}
          </button>
        </form>

        <div className="pt-8 border-t border-slate-800/50 text-center">
          <p className="text-xs text-slate-500">
            Твой квест появится в Книге Квестов и ждёт героев ✨
          </p>
        </div>
      </div>
    </div>
  );
}

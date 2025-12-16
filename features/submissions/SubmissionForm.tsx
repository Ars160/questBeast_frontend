'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_SUBMISSION_MUTATION } from '@/features/submissions/api/createSubmission.mutation';

type SubmissionFormProps = {
  questId: string;
  refreshSubmissions: () => void;
};

export default function SubmissionForm({ questId, refreshSubmissions }: SubmissionFormProps) {
  const [content, setContent] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [createSubmission, { loading, error }] = useMutation(CREATE_SUBMISSION_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      alert('⚔️ Опиши своё решение!');
      return;
    }

    try {
      await createSubmission({
        variables: {
          content: content.trim(),
          questId,
          fileUrl: fileUrl.trim() || undefined,
        },
        refetchQueries: [{ query: CREATE_SUBMISSION_MUTATION }], // автообновление
      });
      setContent('');
      setFileUrl('');
      refreshSubmissions();
    } catch (err: any) {
      console.error('Ошибка отправки:', err);
    }
  };

  return (
    <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950/70 p-8 backdrop-blur-xl shadow-[0_20px_80px_rgba(15,23,42,0.95)]">
      <h3 className="text-xl font-black mb-6 bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
        ⚔️ Прими вызов
        <span className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-purple-400 rounded-full animate-pulse" />
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-emerald-300 mb-2">
            Твоё решение
          </label>
          <textarea
            placeholder="Опиши стратегию прохождения квеста подробно. Покажи расчёты, код или план действий..."
            className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-5 py-5 text-slate-100 outline-none resize-vertical placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 transition-all min-h-[160px] text-lg"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold uppercase tracking-wide text-slate-400 mb-2">
            Доказательства (ссылка)
          </label>
          <input
            type="url"
            placeholder="https://github.com/... или screenshot"
            className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-5 py-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 transition-all"
            value={fileUrl}
            onChange={(e) => setFileUrl(e.target.value)}
          />
          <p className="mt-1 text-xs text-slate-500">
            Опционально: ссылка на код, скриншот или файл
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 rounded-3xl font-black text-lg shadow-[0_0_40px_rgba(16,185,129,0.8)] hover:shadow-[0_0_60px_rgba(16,185,129,1)] transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? (
            <>
              <span className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              Отправляем герою вызов...
            </>
          ) : (
            <>
              <span>🗡️</span>
              Отправить решение
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 rounded-2xl bg-red-500/10 border border-red-500/30">
          <p className="text-sm text-red-400 flex items-center gap-2">
            ⚠️ {error.message || 'Ошибка при отправке'}
          </p>
        </div>
      )}

      <div className="pt-6 border-t border-slate-800/50 text-center">
        <p className="text-xs text-slate-500">
          Мастер проверит твой подвиг и выставит награду ✨
        </p>
      </div>
    </div>
  );
}

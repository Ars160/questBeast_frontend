'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { GRADE_SUBMISSION_MUTATION } from './api/gradeSubmission.mutation';

type GradeSubmissionFormProps = {
  submissionId: string;
  currentGrade?: number;
  currentFeedback?: string;
  onGraded: () => void;
};

export default function GradeSubmissionForm({
  submissionId,
  currentGrade = 0,
  currentFeedback = '',
  onGraded,
}: GradeSubmissionFormProps) {
  const [grade, setGrade] = useState(currentGrade);
  const [feedback, setFeedback] = useState(currentFeedback);
  const [isEditing, setIsEditing] = useState(false);

  const [gradeSubmission, { loading, error }] = useMutation(GRADE_SUBMISSION_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (grade < 0 || grade > 10) { 
      alert('Оценка от 0 до 10');
      return;
    }

    try {
      await gradeSubmission({
        variables: { 
          submissionId, 
          grade, 
          feedback: feedback.trim() || null 
        },
      });
      onGraded();
      setIsEditing(false);
    } catch (err: any) {
      console.error('Ошибка оценки:', err);
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 8) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (grade >= 5) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
    return 'bg-red-500/20 text-red-400 border-red-500/40';
  };

  return (
    <div className="mt-4 p-6 rounded-3xl border border-slate-800/50 bg-gradient-to-r from-slate-900/80 to-slate-950/80 backdrop-blur-xl shadow-lg hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all">
      {!isEditing ? (
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-2xl">
          <div className={`px-4 py-2 rounded-xl font-bold text-sm border ${getGradeColor(grade)}`}>
            {grade}/10
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500/80 to-emerald-500/80 text-slate-950 rounded-xl font-semibold text-xs shadow-md hover:shadow-lg transition-all hover:scale-105"
          >
            ✏️ Изменить
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-300 w-20">Оценка:</label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="flex-1 h-2 bg-slate-800 rounded-lg cursor-pointer accent-emerald-500 hover:accent-emerald-400 appearance-none"
            />
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-16 text-center bg-slate-950/70 border border-slate-700/70 rounded-xl px-2 py-1 font-mono text-emerald-400 focus:border-emerald-500"
            />
            <span className="text-lg font-black text-emerald-400">/10</span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Обратная связь
            </label>
            <input
              type="text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Что было хорошо? Что улучшить?"
              className="w-full rounded-2xl border border-slate-700/70 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 transition-all"
              maxLength={200}
            />
            <p className="text-xs text-slate-500 mt-1">
              {feedback.length}/200
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 rounded-2xl font-semibold shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_30px_rgba(16,185,129,0.8)] transition-all hover:scale-[1.02] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  Сохраняем...
                </>
              ) : (
                <>
                  ✅ Подтвердить
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-3 bg-slate-800/50 text-slate-300 rounded-2xl font-semibold hover:bg-slate-700/50 transition-all hover:scale-102"
              disabled={loading}
            >
              ❌ Отмена
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-sm text-red-400">⚠️ {error.message}</p>
        </div>
      )}
    </div>
  );
}

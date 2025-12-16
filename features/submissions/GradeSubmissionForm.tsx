// features/submissions/GradeSubmissionForm.tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { GRADE_SUBMISSION_MUTATION } from './api/gradeSubmission.mutation';

type GradeSubmissionFormProps = {
  submissionId: string;
  currentGrade?: number;
  currentFeedback?: string;
  onGraded: () => void; // для обновления списка после оценки
};

export default function GradeSubmissionForm({
  submissionId,
  currentGrade = 0,
  currentFeedback = '',
  onGraded,
}: GradeSubmissionFormProps) {
  const [grade, setGrade] = useState(currentGrade);
  const [feedback, setFeedback] = useState(currentFeedback);

  const [gradeSubmission, { loading, error }] = useMutation(GRADE_SUBMISSION_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (grade < 0 || grade > 100) {
      alert('Grade должен быть от 0 до 100');
      return;
    }
    try {
      await gradeSubmission({
        variables: { submissionId, grade, feedback },
      });
      onGraded();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-3 rounded mt-2 space-y-2">
      <input
        type="number"
        min={0}
        max={100}
        value={grade}
        onChange={(e) => setGrade(Number(e.target.value))}
        className="border p-1 w-20"
      />
      <input
        type="text"
        placeholder="Feedback"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="border p-1 w-full"
      />
      <button type="submit" disabled={loading} className="bg-green-500 text-white px-3 py-1 rounded">
        {loading ? 'Сохраняем...' : 'Оценить'}
      </button>
      {error && <p className="text-red-500">{error.message}</p>}
    </form>
  );
}
